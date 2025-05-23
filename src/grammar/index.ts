import * as $ from "@tonstudio/parser-runtime";
import type * as Ast from "@/ast/ast";
import type { FactoryAst } from "@/ast/ast-helpers";
import type { $ast } from "@/grammar/grammar";
import * as G from "@/grammar/grammar";
import { TactCompilationError } from "@/error/errors";
import type { SyntaxErrors } from "@/grammar/parser-error";
import { syntaxErrorSchema } from "@/grammar/parser-error";
import type { AstSchema } from "@/ast/getAstSchema";
import { getAstSchema } from "@/ast/getAstSchema";
import { getSrcInfo } from "@/grammar/src-info";
import { displayToString } from "@/error/display-to-string";
import { makeMakeVisitor } from "@/utils/tricks";
import type { Language, Source } from "@/imports/source";
import { emptyPath, fromString } from "@/imports/path";

const makeVisitor = makeMakeVisitor("$");

type Context = {
    ast: AstSchema;
    err: SyntaxErrors<(loc: $.Loc) => never>;
};

type Handler<T> = (ctx: Context) => T;

const map =
    <T, U>(ts: readonly T[], handler: (t: T) => Handler<U>): Handler<U[]> =>
    (ctx) => {
        return ts.map((t) => handler(t)(ctx));
    };

const parseList = <T>(node: $ast.inter<T, unknown> | undefined): T[] => {
    if (!node) {
        return [];
    }
    const { head, tail } = node;
    return [head, ...tail.map(({ right }) => right)];
};

const parseId =
    ({ name, loc }: $ast.Id | $ast.TypeId): Handler<Ast.Id> =>
    (ctx) => {
        if (name.startsWith("__gen")) {
            ctx.err.reservedVarPrefix("__gen")(loc);
        }
        if (name.startsWith("__tact")) {
            ctx.err.reservedVarPrefix("__tact")(loc);
        }
        if (name === "_") {
            return ctx.err.noWildcard()(loc);
        }
        return ctx.ast.Id(name, loc);
    };

const parseOptionalId =
    ({ name, loc }: $ast.Id | $ast.TypeId): Handler<Ast.OptionalId> =>
    (ctx) => {
        if (name.startsWith("__gen")) {
            ctx.err.reservedVarPrefix("__gen")(loc);
        }
        if (name.startsWith("__tact")) {
            ctx.err.reservedVarPrefix("__tact")(loc);
        }
        if (name === "_") {
            return ctx.ast.Wildcard(loc);
        }
        return ctx.ast.Id(name, loc);
    };

/*
    FunC can parse much more than Fift can handle. For example, _0x0 and _0 are
    valid identifiers in FunC, and using either of them compiles and is then
    interpreted fine by Fift. But if you use both, FunC still compiles, but Fift crashes.

    Same goes for plain identifiers using hashes # or emojis — you can have one
    FunC function with any of those combinations of characters, but you (generally)
    cannot have two or more of such functions.
*/
const reservedFuncIds: Set<string> = new Set([
    "_",
    "#include",
    "#pragma",
    "[",
    "]",
    "{",
    "}",
    "?",
    ":",
    "+",
    "-",
    "*",
    "/%",
    "/",
    "%",
    "~/",
    "^/",
    "~%",
    "^%",
    "<=>",
    "<=",
    "<",
    ">=",
    ">",
    "!=",
    "==",
    "~>>",
    "~",
    "^>>",
    "^",
    "&",
    "|",
    "<<",
    ">>",
    "=",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "~>>=",
    "~/=",
    "~%=",
    "^>>=",
    "^/=",
    "^%=",
    "^=",
    "<<=",
    ">>=",
    "&=",
    "|=",
    "int",
    "cell",
    "builder",
    "slice",
    "cont",
    "tuple",
    "type",
    "->",
    "forall",
    "return",
    "var",
    "repeat",
    "do",
    "while",
    "until",
    "try",
    "catch",
    "ifnot",
    "if",
    "then",
    "elseifnot",
    "elseif",
    "else",
    "extern",
    "global",
    "asm",
    "impure",
    "inline_ref",
    "inline",
    "auto_apply",
    "method_id",
    "operator",
    "infixl",
    "infixr",
    "infix",
    "const",
]);

const parseFuncId =
    ({ accessor, id, loc }: $ast.FuncId): Handler<Ast.FuncId> =>
    (ctx) => {
        if (reservedFuncIds.has(id)) {
            ctx.err.reservedFuncId()(loc);
        }
        if (id.match(/^-?([0-9]+|0x[0-9a-fA-F]+)$/)) {
            ctx.err.numericFuncId()(loc);
        }
        if (id.startsWith('"') || id.startsWith("{-")) {
            ctx.err.invalidFuncId()(loc);
        }
        return ctx.ast.FuncId((accessor ?? "") + id, loc);
    };

const baseMap = {
    IntegerLiteralBin: 2,
    IntegerLiteralOct: 8,
    IntegerLiteralDec: 10,
    IntegerLiteralHex: 16,
} as const;

const prefixMap = {
    IntegerLiteralBin: "0b",
    IntegerLiteralOct: "0o",
    IntegerLiteralDec: "",
    IntegerLiteralHex: "0x",
} as const;

const parseIntegerLiteralValue =
    ({ $, digits, loc }: $ast.IntegerLiteral["value"]): Handler<Ast.Number> =>
    (ctx) => {
        if (
            $ === "IntegerLiteralDec" &&
            digits.startsWith("0") &&
            digits.includes("_")
        ) {
            ctx.err.leadingZeroUnderscore()(loc);
        }
        const value = BigInt(prefixMap[$] + digits.replaceAll("_", ""));
        return ctx.ast.Number(baseMap[$], value, loc);
    };

const parseIntegerLiteral =
    ({ value }: $ast.IntegerLiteral): Handler<Ast.Number> =>
    (ctx) => {
        return parseIntegerLiteralValue(value)(ctx);
    };

const parseStringLiteral =
    ({ value, loc }: $ast.StringLiteral): Handler<Ast.String> =>
    (ctx) => {
        const simplifiedValue = replaceEscapeSequences(value, loc, ctx);
        return ctx.ast.String(simplifiedValue, loc);
    };

export function replaceEscapeSequences(
    stringLiteral: string,
    loc: $.Loc,
    ctx: Context,
): string {
    return stringLiteral.replace(
        /\\\\|\\"|\\n|\\r|\\t|\\v|\\b|\\f|\\u{([0-9A-Fa-f]{1,6})}|\\u([0-9A-Fa-f]{4})|\\x([0-9A-Fa-f]{2})/g,
        (match, unicodeCodePoint, unicodeEscape, hexEscape) => {
            switch (match) {
                case "\\\\":
                    return "\\";
                case '\\"':
                    return '"';
                case "\\n":
                    return "\n";
                case "\\r":
                    return "\r";
                case "\\t":
                    return "\t";
                case "\\v":
                    return "\v";
                case "\\b":
                    return "\b";
                case "\\f":
                    return "\f";
                default:
                    // Handle Unicode code point escape
                    if (unicodeCodePoint) {
                        const codePoint = parseInt(unicodeCodePoint, 16);
                        if (codePoint > 0x10ffff) {
                            ctx.err.undefinedUnicodeCodepoint()(loc);
                            return match;
                        }
                        return String.fromCodePoint(codePoint);
                    }
                    // Handle Unicode escape
                    if (unicodeEscape) {
                        const codeUnit = parseInt(unicodeEscape, 16);
                        return String.fromCharCode(codeUnit);
                    }
                    // Handle hex escape
                    if (hexEscape) {
                        const hexValue = parseInt(hexEscape, 16);
                        return String.fromCharCode(hexValue);
                    }
                    return match;
            }
        },
    );
}

const parseBoolLiteral =
    ({ value, loc }: $ast.BoolLiteral): Handler<Ast.Boolean> =>
    (ctx) => {
        return ctx.ast.Boolean(value === "true", loc);
    };

const parseNull =
    ({ loc }: $ast.Null): Handler<Ast.Null> =>
    (ctx) => {
        return ctx.ast.Null(loc);
    };

const parseStructFieldInitializer =
    ({
        name,
        init,
        loc,
    }: $ast.StructFieldInitializer): Handler<Ast.StructFieldInitializer> =>
    (ctx) => {
        const fieldId = parseId(name)(ctx);

        return ctx.ast.StructFieldInitializer(
            fieldId,
            init ? parseExpression(init)(ctx) : fieldId,
            loc,
        );
    };

const parseStructInstance =
    ({ type, body, loc }: $ast.StructInstance): Handler<Ast.StructInstance> =>
    (ctx) => {
        return ctx.ast.StructInstance(
            parseId(type)(ctx),
            map(parseList(body.fields), parseStructFieldInitializer)(ctx),
            loc,
        );
    };

const parseMapField =
    ({ key, value }: $ast.mapField): Handler<Ast.MapField> =>
    (ctx) => {
        return {
            key: parseExpression(key)(ctx),
            value: parseExpression(value)(ctx),
        };
    };

const parseMapLiteral =
    ({
        typeArgs,
        fields,
        loc,
    }: $ast.MapLiteral): Handler<Ast.MapLiteral | Ast.Id> =>
    (ctx) => {
        const type = parseMapType(typeArgs, loc)(ctx);
        if (type.kind === "type_id") {
            return ctx.ast.Id("ERROR", loc);
        }
        return ctx.ast.MapLiteral(
            type,
            map(parseList(fields), parseMapField)(ctx),
            loc,
        );
    };
const parseSetLiteral =
    ({ loc }: $ast.SetLiteral): Handler<Ast.Id> =>
    (ctx) => {
        ctx.err.noSetLiterals()(loc);
        return ctx.ast.Id("ERROR", loc);
    };

const parseInitOf =
    ({ name, params, loc }: $ast.InitOf): Handler<Ast.InitOf> =>
    (ctx) => {
        return ctx.ast.InitOf(
            parseId(name)(ctx),
            map(parseList(params.values), parseExpression)(ctx),
            loc,
        );
    };

const parseCodeOf =
    ({ name, loc }: $ast.CodeOf): Handler<Ast.CodeOf> =>
    (ctx) => {
        return ctx.ast.CodeOf(parseId(name)(ctx), loc);
    };

const parseConditional =
    ({ head, tail, loc }: $ast.Conditional): Handler<Ast.Expression> =>
    (ctx) => {
        const condition = parseExpression(head)(ctx);
        if (!tail) {
            return condition;
        }
        const { thenBranch, elseBranch } = tail;
        return ctx.ast.Conditional(
            condition,
            parseExpression(thenBranch)(ctx),
            parseExpression(elseBranch)(ctx),
            loc,
        );
    };

const parseBinary =
    ({
        exprs: { head, tail },
    }: $ast.Binary<Expression, Ast.BinaryOperation>): Handler<Ast.Expression> =>
    (ctx) => {
        return tail.reduce(
            ({ child, range }, { op, right }) => {
                const merged = $.mergeLoc(range, $.mergeLoc(op.loc, right.loc));
                return {
                    child: ctx.ast.OpBinary(
                        op.name,
                        child,
                        parseExpression(right)(ctx),
                        merged,
                    ),
                    range: merged,
                };
            },
            { child: parseExpression(head)(ctx), range: head.loc },
        ).child;
    };

const parseUnary =
    ({ prefixes, expression }: $ast.Unary): Handler<Ast.Expression> =>
    (ctx) => {
        return prefixes.reduceRight(
            ({ child, range }, { name, loc }) => {
                const merged = $.mergeLoc(loc, range);
                return {
                    child: ctx.ast.OpUnary(name, child, merged),
                    range: merged,
                };
            },
            { child: parseExpression(expression)(ctx), range: expression.loc },
        ).child;
    };

type SuffixHandler = Handler<
    (child: Ast.Expression, loc: $.Loc) => Ast.Expression
>;

const parseSuffixUnboxNotNull =
    (_: $ast.SuffixUnboxNotNull): SuffixHandler =>
    (ctx) =>
    (child, loc) => {
        return ctx.ast.OpUnary("!!", child, loc);
    };

const parseSuffixCall =
    ({ params }: $ast.SuffixCall): SuffixHandler =>
    (ctx) =>
    (child, loc) => {
        const paramsAst = map(parseList(params.values), parseExpression)(ctx);
        if (child.kind === "id") {
            return ctx.ast.StaticCall(child, paramsAst, loc);
        } else if (child.kind === "field_access") {
            return ctx.ast.MethodCall(
                child.aggregate,
                child.field,
                paramsAst,
                loc,
            );
        } else {
            ctx.err.notCallable()(loc);
            return ctx.ast.StaticCall(
                ctx.ast.Id("__invalid__", loc),
                paramsAst,
                loc,
            );
        }
    };

const parseSuffixFieldAccess =
    ({ name }: $ast.SuffixFieldAccess): SuffixHandler =>
    (ctx) =>
    (child, loc) => {
        return ctx.ast.FieldAccess(child, parseId(name)(ctx), loc);
    };

const suffixVisitor: (node: $ast.suffix) => SuffixHandler =
    makeVisitor<$ast.suffix>()({
        SuffixUnboxNotNull: parseSuffixUnboxNotNull,
        SuffixCall: parseSuffixCall,
        SuffixFieldAccess: parseSuffixFieldAccess,
    });

const parseSuffix =
    ({ expression, suffixes }: $ast.Suffix): Handler<Ast.Expression> =>
    (ctx) => {
        return suffixes.reduce(
            ({ child, range }, suffix) => {
                const merged = $.mergeLoc(range, suffix.loc);
                return {
                    child: suffixVisitor(suffix)(ctx)(child, merged),
                    range: merged,
                };
            },
            { child: parseExpression(expression)(ctx), range: expression.loc },
        ).child;
    };

const parseParens = ({ child }: $ast.Parens): Handler<Ast.Expression> => {
    return parseExpression(child);
};

// has to be an interface because of the way TS handles circular type references
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Binary extends $ast.Binary<Expression, Ast.BinaryOperation> {}

type Expression =
    | $ast.Conditional
    | Binary
    | $ast.Unary
    | $ast.Suffix
    | $ast.Parens
    | $ast.StructInstance
    | $ast.MapLiteral
    | $ast.SetLiteral
    | $ast.IntegerLiteral
    | $ast.BoolLiteral
    | $ast.InitOf
    | $ast.CodeOf
    | $ast.Null
    | $ast.StringLiteral
    | $ast.Id;

const parseExpression: (input: Expression) => Handler<Ast.Expression> =
    makeVisitor<Expression>()({
        Conditional: parseConditional,
        Binary: parseBinary,
        Unary: parseUnary,
        Suffix: parseSuffix,
        Parens: parseParens,
        StructInstance: parseStructInstance,
        MapLiteral: parseMapLiteral,
        SetLiteral: parseSetLiteral,
        IntegerLiteral: parseIntegerLiteral,
        BoolLiteral: parseBoolLiteral,
        InitOf: parseInitOf,
        CodeOf: parseCodeOf,
        Null: parseNull,
        StringLiteral: parseStringLiteral,
        Id: parseId,
    });

const parseStatementLet =
    ({ name, type, init, loc }: $ast.StatementLet): Handler<Ast.StatementLet> =>
    (ctx) => {
        return ctx.ast.StatementLet(
            parseOptionalId(name)(ctx),
            type ? parseType(type)(ctx) : undefined,
            parseExpression(init)(ctx),
            loc,
        );
    };

const parsePunnedField =
    ({ name }: $ast.PunnedField): Handler<[Ast.Id, Ast.Id]> =>
    (ctx) => {
        return [parseId(name)(ctx), parseId(name)(ctx)];
    };

const parseRegularField =
    ({
        fieldName,
        varName,
    }: $ast.RegularField): Handler<[Ast.Id, Ast.OptionalId]> =>
    (ctx) => {
        return [parseId(fieldName)(ctx), parseOptionalId(varName)(ctx)];
    };

const parseDestructItem: (
    node: $ast.destructItem,
) => Handler<[Ast.Id, Ast.OptionalId]> = makeVisitor<$ast.destructItem>()({
    PunnedField: parsePunnedField,
    RegularField: parseRegularField,
});

const parseStatementDestruct =
    ({
        type,
        fields,
        rest,
        init,
        loc,
    }: $ast.StatementDestruct): Handler<Ast.StatementDestruct> =>
    (ctx) => {
        const ids: Map<string, [Ast.Id, Ast.OptionalId]> = new Map();
        for (const param of parseList(fields)) {
            const pair = parseDestructItem(param)(ctx);
            const [field] = pair;
            const name = field.text;
            if (ids.has(name)) {
                ctx.err.duplicateField(name)(param.loc);
            }
            ids.set(name, pair);
        }

        return ctx.ast.StatementDestruct(
            parseTypeId(type)(ctx),
            ids,
            rest.$ === "RestArgument",
            parseExpression(init)(ctx),
            loc,
        );
    };

const parseStatementBlock =
    ({ body, loc }: $ast.StatementBlock): Handler<Ast.StatementBlock> =>
    (ctx) => {
        return ctx.ast.StatementBlock(parseStatements(body)(ctx), loc);
    };

const parseStatementReturn =
    ({ expression, loc }: $ast.StatementReturn): Handler<Ast.StatementReturn> =>
    (ctx) => {
        return ctx.ast.StatementReturn(
            expression ? parseExpression(expression)(ctx) : undefined,
            loc,
        );
    };

const parseStatementCondition =
    ({
        condition,
        trueBranch,
        falseBranch,
        loc,
    }: $ast.StatementCondition): Handler<Ast.StatementCondition> =>
    (ctx) => {
        if (typeof falseBranch === "undefined") {
            return ctx.ast.StatementCondition(
                parseExpression(condition)(ctx),
                parseStatements(trueBranch)(ctx),
                undefined,
                loc,
            );
        } else if (falseBranch.$ === "FalseBranch") {
            return ctx.ast.StatementCondition(
                parseExpression(condition)(ctx),
                parseStatements(trueBranch)(ctx),
                parseStatements(falseBranch.body)(ctx),
                loc,
            );
        } else {
            return ctx.ast.StatementCondition(
                parseExpression(condition)(ctx),
                parseStatements(trueBranch)(ctx),
                [parseStatementCondition(falseBranch)(ctx)],
                loc,
            );
        }
    };

const parseStatementWhile =
    ({
        condition,
        body,
        loc,
    }: $ast.StatementWhile): Handler<Ast.StatementWhile> =>
    (ctx) => {
        return ctx.ast.StatementWhile(
            parseExpression(condition)(ctx),
            parseStatements(body)(ctx),
            loc,
        );
    };

const parseStatementRepeat =
    ({
        condition,
        body,
        loc,
    }: $ast.StatementRepeat): Handler<Ast.StatementRepeat> =>
    (ctx) => {
        return ctx.ast.StatementRepeat(
            parseExpression(condition)(ctx),
            parseStatements(body)(ctx),
            loc,
        );
    };

const parseStatementUntil =
    ({
        condition,
        body,
        loc,
    }: $ast.StatementUntil): Handler<Ast.StatementUntil> =>
    (ctx) => {
        return ctx.ast.StatementUntil(
            parseExpression(condition)(ctx),
            parseStatements(body)(ctx),
            loc,
        );
    };

const parseStatementTry =
    ({ body, handler, loc }: $ast.StatementTry): Handler<Ast.StatementTry> =>
    (ctx) => {
        if (handler) {
            return ctx.ast.StatementTry(parseStatements(body)(ctx), loc, {
                catchName: parseOptionalId(handler.name)(ctx),
                catchStatements: parseStatements(handler.body)(ctx),
            });
        } else {
            return ctx.ast.StatementTry(
                parseStatements(body)(ctx),
                loc,
                undefined,
            );
        }
    };

const parseStatementForEach =
    ({
        key,
        value,
        expression,
        body,
        loc,
    }: $ast.StatementForEach): Handler<Ast.StatementForEach> =>
    (ctx) => {
        return ctx.ast.StatementForEach(
            parseOptionalId(key)(ctx),
            parseOptionalId(value)(ctx),
            parseExpression(expression)(ctx),
            parseStatements(body)(ctx),
            loc,
        );
    };

const parseStatementExpression =
    ({
        expression,
        loc,
    }: $ast.StatementExpression): Handler<Ast.StatementExpression> =>
    (ctx) => {
        return ctx.ast.StatementExpression(
            parseExpression(expression)(ctx),
            loc,
        );
    };

const parseStatementAssign =
    ({
        left,
        operator,
        right,
        loc,
    }: $ast.StatementAssign): Handler<
        Ast.StatementAssign | Ast.StatementAugmentedAssign
    > =>
    (ctx) => {
        if (operator === "=") {
            return ctx.ast.StatementAssign(
                parseExpression(left)(ctx),
                parseExpression(right)(ctx),
                loc,
            );
        } else {
            return ctx.ast.StatementAugmentedAssign(
                operator,
                parseExpression(left)(ctx),
                parseExpression(right)(ctx),
                loc,
            );
        }
    };

const parseStatement: (node: $ast.statement) => Handler<Ast.Statement> =
    makeVisitor<$ast.statement>()({
        StatementLet: parseStatementLet,
        StatementDestruct: parseStatementDestruct,
        StatementBlock: parseStatementBlock,
        StatementReturn: parseStatementReturn,
        StatementCondition: parseStatementCondition,
        StatementWhile: parseStatementWhile,
        StatementRepeat: parseStatementRepeat,
        StatementUntil: parseStatementUntil,
        StatementTry: parseStatementTry,
        StatementForEach: parseStatementForEach,
        StatementExpression: parseStatementExpression,
        StatementAssign: parseStatementAssign,
    });

const parseStatements =
    (nodes: readonly $ast.statement[]): Handler<Ast.Statement[]> =>
    (ctx) => {
        return map(nodes, parseStatement)(ctx);
    };

const parseFunctionAttribute =
    (node: $ast.FunctionAttribute): Handler<Ast.FunctionAttribute> =>
    (ctx) => {
        if (typeof node.name === "string") {
            return ctx.ast.FunctionAttribute(node.name, node.loc);
        }

        return ctx.ast.FunctionAttributeGet(
            node.name.methodId
                ? parseExpression(node.name.methodId)(ctx)
                : undefined,
            node.loc,
        );
    };

const checkAttributes =
    (kind: "constant" | "function") =>
    (
        ctx: Context,
        isAbstract: boolean,
        attributes: readonly (
            | $ast.FunctionAttribute
            | $ast.ConstantAttribute
        )[],
        loc: $.Loc,
    ) => {
        const { duplicate, tooAbstract, notAbstract } = ctx.err[kind];
        const k: Set<string> = new Set();
        for (const { name, loc } of attributes) {
            const type = typeof name === "string" ? name : name.$;
            if (k.has(type)) {
                duplicate(type)(loc);
            }
            k.add(type);
        }
        if (isAbstract && !k.has("abstract")) {
            notAbstract()(loc);
        }
        if (!isAbstract && k.has("abstract")) {
            tooAbstract()(loc);
        }
    };

const parseFunctionAttributes =
    (
        nodes: readonly $ast.FunctionAttribute[],
        isAbstract: boolean,
        loc: $.Loc,
    ): Handler<Ast.FunctionAttribute[]> =>
    (ctx) => {
        checkAttributes("function")(ctx, isAbstract, nodes, loc);
        return map(nodes, parseFunctionAttribute)(ctx);
    };

const parseConstantAttribute =
    ({ name, loc }: $ast.ConstantAttribute): Handler<Ast.ConstantAttribute> =>
    (ctx) => {
        return ctx.ast.ConstantAttribute(name, loc);
    };

const parseConstantAttributes =
    (
        nodes: readonly $ast.ConstantAttribute[],
        isAbstract: boolean,
        loc: $.Loc,
        noAttributes: boolean,
    ): Handler<Ast.ConstantAttribute[]> =>
    (ctx) => {
        const [head] = nodes;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (noAttributes && head) {
            ctx.err.topLevelConstantWithAttribute()(head.loc);
        }
        checkAttributes("constant")(ctx, isAbstract, nodes, loc);
        return map(nodes, parseConstantAttribute)(ctx);
    };

const parseParameter =
    ({ name, type, loc }: $ast.Parameter): Handler<Ast.TypedParameter> =>
    (ctx) => {
        return ctx.ast.TypedParameter(
            parseOptionalId(name)(ctx),
            parseType(type)(ctx),
            undefined,
            loc,
        );
    };

const parseInitParameter =
    ({ name, type, loc }: $ast.Parameter): Handler<Ast.TypedParameter> =>
    (ctx) => {
        const t = parseTypeOptional(type)(ctx);
        const [as, ...restAs] = type.as;
        if (restAs.length > 0) {
            ctx.err.parameterOnlyOneAs()(loc);
        }
        return ctx.ast.TypedParameter(
            parseOptionalId(name)(ctx),
            t,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
            as ? ctx.ast.Id(as.name, as.loc) : undefined,
            loc,
        );
    };

const parseTypeId =
    ({ name, loc }: $ast.TypeId): Handler<Ast.TypeId> =>
    (ctx) => {
        return ctx.ast.TypeId(name, loc);
    };

const parseMapType =
    (
        args: $ast.commaList<$ast.TypeAs> | undefined,
        loc: $.Loc,
    ): Handler<Ast.MapType | Ast.TypeId> =>
    (ctx) => {
        const parsedArgs = parseList(args);
        const [key, value, ...rest] = parsedArgs;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
        if (!key || !value || rest.length > 0) {
            ctx.err.genericArgCount("map", 2, parsedArgs.length)(loc);
            return ctx.ast.TypeId("ERROR", loc);
        }
        const [keyAs, ...restKeyAs] = key.as;
        if (restKeyAs.length > 0) {
            ctx.err.mapOnlyOneAs("key")(loc);
        }
        if (key.type.optionals.length > 0) {
            ctx.err.cannotBeOptional("map key types")(key.loc);
        }
        if (key.type.type.$ !== "TypeRegular") {
            ctx.err.onlyTypeId("key")(loc);
            return ctx.ast.TypeId("ERROR", loc);
        }
        const [valueAs, ...restValueAs] = value.as;
        if (restValueAs.length > 0) {
            ctx.err.mapOnlyOneAs("value")(loc);
        }
        if (value.type.optionals.length > 0) {
            ctx.err.cannotBeOptional("map value types")(value.loc);
        }
        if (value.type.type.$ !== "TypeRegular") {
            ctx.err.onlyTypeId("value")(loc);
            return ctx.ast.TypeId("ERROR", loc);
        }
        const keyType = key.type.type.child;
        const valueType = value.type.type.child;
        return ctx.ast.MapType(
            ctx.ast.TypeId(keyType.name, keyType.loc),
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
            keyAs ? ctx.ast.Id(keyAs.name, keyAs.loc) : undefined,
            ctx.ast.TypeId(valueType.name, valueType.loc),
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
            valueAs ? ctx.ast.Id(valueAs.name, valueAs.loc) : undefined,
            loc,
        );
    };

const parseTypeOptional =
    ({ type, loc }: $ast.$type): Handler<Ast.Type> =>
    (ctx) => {
        const {
            type: innerType,
            optionals: [firstOption, ...restOption],
            loc: optionalLoc,
        } = type;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
        if (firstOption) {
            if (restOption.length !== 0) {
                ctx.err.multipleOptionals()(optionalLoc);
            }
            if (innerType.$ !== "TypeRegular") {
                ctx.err.onlyOptionalOfNamed()(optionalLoc);
                return ctx.ast.OptionalType(
                    ctx.ast.TypeId("ERROR", innerType.loc),
                    optionalLoc,
                );
            }
            const { child } = innerType;
            return ctx.ast.OptionalType(
                ctx.ast.TypeId(child.name, child.loc),
                optionalLoc,
            );
        }
        if (innerType.$ === "TypeRegular") {
            const { name, loc } = innerType.child;
            return ctx.ast.TypeId(name, loc);
        }
        const { name, args, loc: genericLoc } = innerType;
        if (name.$ === "MapKeyword") {
            return parseMapType(args, genericLoc)(ctx);
        }
        if (name.$ === "Bounced") {
            const parsedArgs = parseList(args);
            const [arg, ...rest] = parsedArgs;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
            if (!arg || rest.length > 0) {
                ctx.err.genericArgCount(
                    "bounced",
                    1,
                    parsedArgs.length,
                )(genericLoc);
                return ctx.ast.TypeId("ERROR", genericLoc);
            }
            if (
                arg.as.length > 0 ||
                arg.type.optionals.length > 0 ||
                arg.type.type.$ !== "TypeRegular"
            ) {
                ctx.err.onlyBouncedOfNamed()(genericLoc);
                return ctx.ast.TypeId("ERROR", genericLoc);
            }
            const type = arg.type.type.child;
            return ctx.ast.BouncedMessageType(
                ctx.ast.TypeId(type.name, type.loc),
                loc,
            );
        }
        ctx.err.unknownGeneric()(genericLoc);
        return ctx.ast.TypeId("ERROR", genericLoc);
    };

const parseType =
    (node: $ast.$type): Handler<Ast.Type> =>
    (ctx) => {
        if (node.as.length > 0) {
            ctx.err.asNotAllowed()(node.loc);
        }
        return parseTypeOptional(node)(ctx);
    };

const parseFieldDecl =
    ({ name, type, expression, loc }: $ast.FieldDecl): Handler<Ast.FieldDecl> =>
    (ctx) => {
        const id = parseId(name)(ctx);
        const expr = expression ? parseExpression(expression)(ctx) : undefined;
        const [as, ...restAs] = type.as;
        if (restAs.length > 0) {
            ctx.err.fieldOnlyOneAs()(loc);
        }
        const ty = parseTypeOptional(type)(ctx);
        return ctx.ast.FieldDecl(
            id,
            ty,
            expr,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- eslint bug
            as ? ctx.ast.Id(as.name, as.loc) : undefined,
            loc,
        );
    };

const parseReceiverParam =
    (param: $ast.receiverParam): Handler<Ast.ReceiverSubKind> =>
    (ctx) => {
        return !param
            ? ctx.ast.ReceiverFallback()
            : param.$ === "Parameter"
              ? ctx.ast.ReceiverSimple(parseParameter(param)(ctx))
              : ctx.ast.ReceiverComment(parseStringLiteral(param)(ctx));
    };

const parseReceiverReceive =
    ({ type, param, body, loc }: $ast.Receiver): Handler<Ast.Receiver> =>
    (ctx) => {
        return ctx.ast.Receiver(
            ctx.ast.ReceiverInternal(parseReceiverParam(param)(ctx), type.loc),
            map(body, parseStatement)(ctx),
            loc,
        );
    };

const parseReceiverExternal =
    ({ type, param, body, loc }: $ast.Receiver): Handler<Ast.Receiver> =>
    (ctx) => {
        return ctx.ast.Receiver(
            ctx.ast.ReceiverExternal(parseReceiverParam(param)(ctx), type.loc),
            map(body, parseStatement)(ctx),
            loc,
        );
    };

const emptyLoc = { $: "range", start: 0, end: 0 } as const;
const repairParam: $ast.receiverParam = {
    $: "Parameter",
    name: {
        $: "Id",
        name: "__invalid__",
        loc: emptyLoc,
    },
    type: {
        $: "TypeAs",
        as: [],
        type: {
            $: "TypeOptional",
            optionals: [],
            type: {
                $: "TypeRegular",
                child: {
                    $: "TypeId",
                    name: "__Invalid__",
                    loc: emptyLoc,
                },
                loc: emptyLoc,
            },
            loc: emptyLoc,
        },
        loc: emptyLoc,
    },
    loc: emptyLoc,
};

const parseReceiverBounced =
    ({ type, param, body, loc }: $ast.Receiver): Handler<Ast.Receiver> =>
    (ctx) => {
        if (typeof param === "undefined") {
            ctx.err.noBouncedWithoutArg()(loc);
            param = repairParam;
        }

        if (param.$ === "StringLiteral") {
            ctx.err.noBouncedWithString()(loc);
            param = repairParam;
        }

        return ctx.ast.Receiver(
            ctx.ast.ReceiverBounce(parseParameter(param)(ctx), type.loc),
            map(body, parseStatement)(ctx),
            loc,
        );
    };

const parserByReceiverType: Record<
    $ast.ReceiverType["name"],
    (node: $ast.Receiver) => Handler<Ast.Receiver>
> = {
    bounced: parseReceiverBounced,
    receive: parseReceiverReceive,
    external: parseReceiverExternal,
};

const parseReceiver = (node: $ast.Receiver): Handler<Ast.Receiver> => {
    return parserByReceiverType[node.type.name](node);
};

const defaultShuffle = {
    args: [],
    ret: [],
};

const parseAsmShuffle =
    (node: $ast.shuffle | undefined): Handler<Ast.AsmShuffle> =>
    (ctx) => {
        if (!node) {
            return defaultShuffle;
        }

        return {
            args: map(node.ids, parseId)(ctx),
            ret: node.to ? map(node.to, parseIntegerLiteralValue)(ctx) : [],
        };
    };

const parseUnsupportedAsmFunction =
    (node: $ast.AsmFunction): Handler<Ast.AsmFunctionDef> =>
    (ctx) => {
        ctx.err.unsupportedAsmFunctionInContracts()(node.loc);
        return parseAsmFunction(node)(ctx);
    };

const parseAsmFunction =
    (node: $ast.AsmFunction): Handler<Ast.AsmFunctionDef> =>
    (ctx) => {
        return ctx.ast.AsmFunctionDef(
            parseAsmShuffle(node.shuffle)(ctx),
            parseFunctionAttributes(node.attributes, false, node.loc)(ctx),
            parseId(node.name)(ctx),
            node.returnType ? parseType(node.returnType)(ctx) : undefined,
            map(parseList(node.parameters.values), parseParameter)(ctx),
            [node.instructions.trim()],
            node.loc,
        );
    };

const parseContractInit =
    ({ parameters, body, loc }: $ast.ContractInit): Handler<Ast.ContractInit> =>
    (ctx) => {
        return ctx.ast.ContractInit(
            map(parseList(parameters.values), parseInitParameter)(ctx),
            map(body, parseStatement)(ctx),
            loc,
        );
    };

const parseConstantDefInModule =
    (node: $ast.Constant): Handler<Ast.ConstantDef> =>
    (ctx) => {
        return parseConstantDef(node, true)(ctx);
    };

const parseConstantDef =
    (node: $ast.Constant, noAttributes: boolean): Handler<Ast.ConstantDef> =>
    (ctx) => {
        const result = parseConstant(node, noAttributes)(ctx);

        if (result.kind !== "constant_def") {
            ctx.err.noConstantDecl()(node.loc);
            return {
                ...result,
                kind: "constant_def",
                initializer: ctx.ast.Number(10, 0n, node.loc),
            };
        }

        return result;
    };

const parseConstantDefLocal = (node: $ast.Constant) =>
    parseConstantDef(node, false);

const parseConstant =
    (
        node: $ast.Constant,
        noAttributes: boolean,
    ): Handler<Ast.ConstantDecl | Ast.ConstantDef> =>
    (ctx) => {
        const name = parseId(node.name)(ctx);
        const type = parseType(node.type)(ctx);

        if (node.body.$ === "ConstantDeclaration") {
            const attributes = parseConstantAttributes(
                node.attributes,
                true,
                node.loc,
                noAttributes,
            )(ctx);
            return ctx.ast.ConstantDecl(attributes, name, type, node.loc);
        } else {
            const attributes = parseConstantAttributes(
                node.attributes,
                false,
                node.loc,
                noAttributes,
            )(ctx);
            const initializer = parseExpression(node.body.expression)(ctx);
            return ctx.ast.ConstantDef(
                attributes,
                name,
                type,
                initializer,
                node.loc,
            );
        }
    };

const parseConstantLocal = (node: $ast.Constant) => parseConstant(node, false);

const parseContract =
    ({
        name,
        attributes,
        parameters,
        traits,
        declarations,
        loc,
    }: $ast.Contract): Handler<Ast.Contract> =>
    (ctx) => {
        const params = parseList<$ast.Parameter>(parameters?.values).map(
            (param) => {
                return parseFieldDecl({
                    $: "FieldDecl",
                    name: param.name,
                    type: param.type,
                    expression: undefined,
                    loc: param.loc,
                })(ctx);
            },
        );

        return ctx.ast.Contract(
            parseId(name)(ctx),
            map(parseList(traits), parseId)(ctx),
            map(attributes, parseContractAttribute)(ctx),
            typeof parameters !== "undefined" ? params : undefined,
            map(declarations, parseContractItem)(ctx),
            loc,
        );
    };

const parseFunctionDef =
    (node: $ast.$Function): Handler<Ast.FunctionDef> =>
    (ctx) => {
        const result = parseFunction(node)(ctx);

        if (result.kind !== "function_def") {
            ctx.err.noFunctionDecl()(node.loc);
            return {
                ...parseFunction(node)(ctx),
                kind: "function_def",
                statements: [],
            };
        }

        return result;
    };

const parseFunction =
    (node: $ast.$Function): Handler<Ast.FunctionDef | Ast.FunctionDecl> =>
    (ctx) => {
        const name = parseId(node.name)(ctx);
        const returnType = node.returnType
            ? parseType(node.returnType)(ctx)
            : undefined;
        const parameters = map(
            parseList(node.parameters.values),
            parseParameter,
        )(ctx);

        if (node.body.$ === "FunctionDeclaration") {
            const attributes = parseFunctionAttributes(
                node.attributes,
                true,
                node.loc,
            )(ctx);
            return ctx.ast.FunctionDecl(
                attributes,
                name,
                returnType,
                parameters,
                node.loc,
            );
        } else {
            const attributes = parseFunctionAttributes(
                node.attributes,
                false,
                node.loc,
            )(ctx);
            const statements = map(node.body.body, parseStatement)(ctx);
            return ctx.ast.FunctionDef(
                attributes,
                name,
                returnType,
                parameters,
                statements,
                node.loc,
            );
        }
    };

const parseMessageDecl =
    ({
        name,
        opcode,
        fields,
        loc,
    }: $ast.MessageDecl): Handler<Ast.MessageDecl> =>
    (ctx) => {
        return ctx.ast.MessageDecl(
            parseId(name)(ctx),
            opcode ? parseExpression(opcode)(ctx) : undefined,
            map(parseList(fields), parseFieldDecl)(ctx),
            loc,
        );
    };

const parseNativeFunctionDecl =
    ({
        name,
        attributes,
        nativeName,
        parameters,
        returnType,
        loc,
    }: $ast.NativeFunctionDecl): Handler<Ast.NativeFunctionDecl> =>
    (ctx) => {
        return ctx.ast.NativeFunctionDecl(
            map(attributes, parseFunctionAttribute)(ctx),
            parseId(name)(ctx),
            parseFuncId(nativeName)(ctx),
            map(parseList(parameters.values), parseParameter)(ctx),
            returnType ? parseType(returnType)(ctx) : undefined,
            loc,
        );
    };

const parsePrimitiveTypeDecl =
    ({ name, loc }: $ast.PrimitiveTypeDecl): Handler<Ast.PrimitiveTypeDecl> =>
    (ctx) => {
        return ctx.ast.PrimitiveTypeDecl(parseId(name)(ctx), loc);
    };

const parseStructDecl =
    ({ name, fields, loc }: $ast.StructDecl): Handler<Ast.StructDecl> =>
    (ctx) => {
        return ctx.ast.StructDecl(
            parseId(name)(ctx),
            map(parseList(fields), parseFieldDecl)(ctx),
            loc,
        );
    };

const parseContractAttribute =
    ({ name, loc }: $ast.ContractAttribute): Handler<Ast.ContractAttribute> =>
    (ctx) => {
        return ctx.ast.ContractAttribute(parseStringLiteral(name)(ctx), loc);
    };

const parseTrait =
    ({
        name,
        traits,
        attributes,
        declarations,
        loc,
    }: $ast.Trait): Handler<Ast.Trait> =>
    (ctx) => {
        return ctx.ast.Trait(
            parseId(name)(ctx),
            traits ? map(parseList(traits), parseId)(ctx) : [],
            map(attributes, parseContractAttribute)(ctx),
            map(declarations, parseTraitItem)(ctx),
            loc,
        );
    };

const parseContractItem: (
    input: $ast.contractItemDecl,
) => Handler<Ast.ContractDeclaration> = makeVisitor<$ast.contractItemDecl>()({
    ContractInit: parseContractInit,
    FieldDecl: parseFieldDecl,
    Receiver: parseReceiver,
    Function: parseFunctionDef,
    AsmFunction: parseUnsupportedAsmFunction,
    Constant: parseConstantDefLocal,
});

const parseTraitItem: (
    input: $ast.traitItemDecl,
) => Handler<Ast.TraitDeclaration> = makeVisitor<$ast.traitItemDecl>()({
    FieldDecl: parseFieldDecl,
    Receiver: parseReceiver,
    Function: parseFunction,
    AsmFunction: parseUnsupportedAsmFunction,
    Constant: parseConstantLocal,
});

const parseModuleItem: (input: $ast.moduleItem) => Handler<Ast.ModuleItem> =
    makeVisitor<$ast.moduleItem>()({
        PrimitiveTypeDecl: parsePrimitiveTypeDecl,
        Function: parseFunctionDef,
        AsmFunction: parseAsmFunction,
        NativeFunctionDecl: parseNativeFunctionDecl,
        Constant: parseConstantDefInModule,
        StructDecl: parseStructDecl,
        MessageDecl: parseMessageDecl,
        Contract: parseContract,
        Trait: parseTrait,
    });

const detectLanguage = (path: string): Language | undefined => {
    if (path.endsWith(".fc") || path.endsWith(".func")) {
        return "func";
    }

    if (path.endsWith(".tact")) {
        return "tact";
    }

    return undefined;
};

const guessExtension = (
    importText: string,
): { language: Language; guessedPath: string } => {
    const language = detectLanguage(importText);
    if (language) {
        return { guessedPath: importText, language };
    } else {
        return { guessedPath: `${importText}.tact`, language: "tact" };
    }
};

const stdlibPrefix = "@stdlib/";

const parseImportString =
    (importText: string, loc: $.Loc): Handler<Ast.ImportPath> =>
    (ctx) => {
        if (importText.endsWith("/")) {
            ctx.err.noFolderImports()(loc);
            importText = importText.slice(0, -1);
        }

        if (importText.includes("\\")) {
            ctx.err.importWithBackslash()(loc);
            importText = importText.replace(/\\/g, "/");
        }

        const { guessedPath, language } = guessExtension(importText);

        if (guessedPath.startsWith(stdlibPrefix)) {
            const path = fromString(guessedPath.substring(stdlibPrefix.length));

            if (path.stepsUp !== 0) {
                ctx.err.importWithBackslash()(loc);
            }

            return {
                path,
                type: "stdlib",
                language,
            };
        } else if (
            guessedPath.startsWith("./") ||
            guessedPath.startsWith("../")
        ) {
            return {
                path: fromString(guessedPath),
                type: "relative",
                language,
            };
        } else {
            ctx.err.invalidImport()(loc);
            return {
                path: emptyPath,
                type: "relative",
                language: "tact",
            };
        }
    };

const parseImport =
    ({ path, loc }: $ast.Import): Handler<Ast.Import> =>
    (ctx) => {
        const stringLiteral = parseStringLiteral(path)(ctx);
        const parsedString: string = JSON.parse(`"${stringLiteral.value}"`);
        return ctx.ast.Import(parseImportString(parsedString, loc)(ctx), loc);
    };

const parseModule =
    ({ imports, items }: $ast.Module): Handler<Ast.Module> =>
    (ctx) => {
        return ctx.ast.Module(
            map(imports, parseImport)(ctx),
            map(items, parseModuleItem)(ctx),
        );
    };

const parseJustImports =
    ({ imports }: $ast.JustImports): Handler<Ast.Import[]> =>
    (ctx) => {
        return map(imports, parseImport)(ctx);
    };

export const getParser = (ast: FactoryAst) => {
    const display = displayToString;

    const doParse = <T, U>(
        grammar: $.Parser<T>,
        handler: (t: T) => Handler<U>,
        { code, path, origin }: Source,
    ) => {
        const locationToSrcInfo = (loc: $.Loc) => {
            if (loc.$ === "range") {
                return getSrcInfo(code, loc.start, loc.end, path, origin);
            } else {
                console.error("Invalid range");
                return getSrcInfo(code, loc.at, loc.at, path, origin);
            }
        };

        const err = syntaxErrorSchema(
            display,
            (message: string) => (source: $.Loc) => {
                const srcInfo = locationToSrcInfo(source);
                throw new TactCompilationError(
                    display.at(srcInfo, message),
                    srcInfo,
                );
            },
        );

        const result = $.parse({
            grammar,
            space: G.space,
            text: code,
        });
        if (result.$ === "error") {
            const { expected, position } = result.error;
            return err.expected(expected)({
                $: "range",
                start: position,
                end: position,
            });
        }
        const ctx = {
            ast: getAstSchema(ast, locationToSrcInfo),
            err,
        };
        return handler(result.value)(ctx);
    };

    return {
        parse: (source: Source): Ast.Module => {
            return doParse(G.Module, parseModule, source);
        },
        parseExpression: (code: string): Ast.Expression => {
            return doParse(G.expression, parseExpression, {
                code,
                path: "<repl>",
                origin: "user",
            });
        },
        parseImports: (source: Source): Ast.Import[] => {
            return doParse(G.JustImports, parseJustImports, source);
        },
        parseStatement: (code: string): Ast.Statement => {
            return doParse(G.statement, parseStatement, {
                code,
                path: "<repl>",
                origin: "user",
            });
        },
    };
};

export type Parser = {
    parse: (source: Source) => Ast.Module;
    parseExpression: (sourceCode: string) => Ast.Expression;
    parseImports: (source: Source) => Ast.Import[];
    parseStatement: (sourceCode: string) => Ast.Statement;
};

export { dummySrcInfo, SrcInfo } from "@/grammar/src-info";
