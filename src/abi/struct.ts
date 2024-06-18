import { ops } from "../generator/writers/ops";
import { writeExpression } from "../generator/writers/writeExpression";
import { throwSyntaxError } from "../errors";
import { getType } from "../types/resolveDescriptors";
import { AbiFunction } from "./AbiFunction";

export const StructFunctions: Map<string, AbiFunction> = new Map([
    [
        "toCell",
        {
            name: "toCell",
            resolve: (ctx, args, ref) => {
                if (args.length !== 1) {
                    throwSyntaxError("toCell() expects no arguments", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "toCell() is implemented only a struct type",
                        ref,
                    );
                }
                const tp = getType(ctx, args[0].name);
                if (tp.kind !== "struct") {
                    throwSyntaxError(
                        "toCell() is implemented only a struct type",
                        ref,
                    );
                }
                return { kind: "ref", name: "Cell", optional: false };
            },
            generate: (ctx, args, resolved, ref) => {
                if (resolved.length !== 1) {
                    throwSyntaxError("toCell() expects no arguments", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "toCell() is implemented only a struct type",
                        ref,
                    );
                }
                return `${ops.writerCell(args[0].name, ctx)}(${resolved.map((v) => writeExpression(v, ctx)).join(", ")})`;
            },
        },
    ],
    [
        "fromCell",
        {
            name: "fromCell",
            resolve: (ctx, args, ref) => {
                if (args.length !== 2) {
                    throwSyntaxError("fromCell() expects one argument", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "fromCell() is implemented only for struct types",
                        ref,
                    );
                }
                const tp = getType(ctx, args[0].name);
                if (tp.kind !== "struct") {
                    throwSyntaxError(
                        "fromCell() is implemented only for struct types",
                        ref,
                    );
                }
                if (args[1].kind !== "ref" || args[1].name !== "Cell") {
                    throwSyntaxError(
                        "fromCell() expects a Cell as an argument",
                        ref,
                    );
                }
                return { kind: "ref", name: args[0].name, optional: false };
            },
            generate: (ctx, args, resolved, ref) => {
                if (resolved.length !== 2) {
                    throwSyntaxError("fromCell() expects one argument", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "fromCell() is implemented only for struct types",
                        ref,
                    );
                }
                if (args[1].kind !== "ref" || args[1].name !== "Cell") {
                    throwSyntaxError(
                        "fromCell() expects a Cell as an argument",
                        ref,
                    );
                }
                return `${ops.readerNonModifying(args[0].name, ctx)}(${writeExpression(resolved[1], ctx)}.begin_parse())`;
            },
        },
    ],
    [
        "fromSlice",
        {
            name: "fromSlice",
            resolve: (ctx, args, ref) => {
                if (args.length !== 2) {
                    throwSyntaxError("fromSlice() expects one argument", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "fromSlice() is implemented only for struct types",
                        ref,
                    );
                }
                const tp = getType(ctx, args[0].name);
                if (tp.kind !== "struct") {
                    throwSyntaxError(
                        "fromSlice() is implemented only for struct types",
                        ref,
                    );
                }
                if (args[1].kind !== "ref" || args[1].name !== "Slice") {
                    throwSyntaxError(
                        "fromSlice() expects a Slice as an argument",
                        ref,
                    );
                }
                return { kind: "ref", name: args[0].name, optional: false };
            },
            generate: (ctx, args, resolved, ref) => {
                if (resolved.length !== 2) {
                    throwSyntaxError("fromSlice() expects one argument", ref);
                }
                if (args[0].kind !== "ref") {
                    throwSyntaxError(
                        "fromSlice() is implemented only for struct types",
                        ref,
                    );
                }
                if (args[1].kind !== "ref" || args[1].name !== "Slice") {
                    throwSyntaxError(
                        "fromSlice() expects a Slice as an argument",
                        ref,
                    );
                }
                return `${ops.readerNonModifying(args[0].name, ctx)}(${writeExpression(resolved[1], ctx)})`;
            },
        },
    ],
]);
