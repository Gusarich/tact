# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The documentation changelog is kept separately: [CHANGELOG-DOCS](./CHANGELOG-DOCS.md).

## [Unreleased]

### Code generation

- Reordered arguments of the `__tact_store_address_opt` function to optimize gas consumption: PR [#3333](https://github.com/tact-lang/tact/pull/3333)

### Standard Library

- Added `setData()` function: PR [#3402](https://github.com/tact-lang/tact/pull/3402)

### Release contributors

- [skywardboundd](https://github.com/skywardboundd)
- [Novus Nota](https://github.com/novusnota)

## [1.6.13] - 2025-05-29

### Language features

- Support `fromCell()` and `fromSlice()` methods on contract types: PR [#3305](https://github.com/tact-lang/tact/pull/3305)

### Release contributors

- [Anton Trunov](https://github.com/anton-trunov)
- [Novus Nota](https://github.com/novusnota)

## [1.6.12] - 2025-05-27

### Language features

- Support `toCell()` and `toSlice()` methods on contract types: PR [#3274](https://github.com/tact-lang/tact/pull/3274)
- No explicit re-declarations for abstract methods and constants in traits: PR [#3272](https://github.com/tact-lang/tact/pull/3272)
- A more informative error message if two `require()` calls have the same generated error code: PR [#3286](https://github.com/tact-lang/tact/pull/3286)

### Code generation

- Inline message deserialization for better gas consumption: PR [#2993](https://github.com/tact-lang/tact/pull/2993)

### Docs

- Completely reworked the functions page: PR [#3076](https://github.com/tact-lang/tact/pull/3076), PR [#3277](https://github.com/tact-lang/tact/pull/3277)

### Release contributors

- [Petr Makhnev](https://github.com/i582)
- [Novus Nota](https://github.com/novusnota)
- [Anton Trunov](https://github.com/anton-trunov)

## [1.6.11] - 2025-05-26

### Language features

- [fix] Better error message when an integer key or value in a map literal is out of its serialization range: PR [#3285](https://github.com/tact-lang/tact/pull/3285)
- [fix] Balanced quotation in error messages for out-of-project-root imports: PR [#3242](https://github.com/tact-lang/tact/pull/3242)
- [fix] Disallow self-inheritance for contracts and traits: PR [#3094](https://github.com/tact-lang/tact/pull/3094)
- [fix] Added fixed-bytes support to bounced message size calculations: PR [#3129](https://github.com/tact-lang/tact/pull/3129)
- [fix] Fixed compiler errors for trait return types: PR [#3197](https://github.com/tact-lang/tact/pull/3197)
- [fix] Added checks for trait returns in non-shuffle asm functions: PR [#3197](https://github.com/tact-lang/tact/pull/3197)
- [fix] Allow equivalent `as`-annotations for maps types: PR [#3172](https://github.com/tact-lang/tact/pull/3172)
- [fix] Added static/instance checks for core static methods: PR [#3119](https://github.com/tact-lang/tact/pull/3119)
- [fix] Compiler now correctly counts the size of fields for maps in bounced messages: PR [#3255](https://github.com/tact-lang/tact/pull/3255)
- [fix] Compiler now allows `bounced<T>` as a return type of assembly functions: PR [#3259](https://github.com/tact-lang/tact/pull/3259)

### Code generation

- Compiler now generates more efficient code for slice serialization: PR [#3213](https://github.com/tact-lang/tact/pull/3213)
- Improve gas consumption for equality comparisons of optionals: PR [#3233](https://github.com/tact-lang/tact/pull/3233)
- Improve gas consumption for deserialization of optional addresses: PR [#3225](https://github.com/tact-lang/tact/pull/3225)
- [fix] Detect out-of-range exit codes for the special case of a fallback receiver with `throw`: PR [#3244](https://github.com/tact-lang/tact/pull/3244)
- [fix] Correct transformation of binary and octal message opcodes to hexadecimal format: PR [#3239](https://github.com/tact-lang/tact/pull/3239)
- [fix] Added escaping of special-chars in receiver comments break FunC compilation: PR [#3234](https://github.com/tact-lang/tact/pull/3234)
- [fix] Disable optimization of optional integer comparisons that leads to runtime exceptions: PR [#3210](https://github.com/tact-lang/tact/pull/3210)
- [fix] Compiler now doesn't generate `__tact_nop()` for `dump()` and `dumpStack()` in default mode: PR [#3218](https://github.com/tact-lang/tact/pull/3218)
- [fix] Correct long struct tuple destruction: PR [#3105](https://github.com/tact-lang/tact/pull/3105)
- Compiler now generates more efficient code for `if-throw` pattern with `throw_if/throw_unless` call: PR [#3216](https://github.com/tact-lang/tact/pull/3216)
- [fix] Arguments of the `==` and `!=` operators get evaluated in the left-to-right order: PR [#3252](https://github.com/tact-lang/tact/pull/3252)

### Docs

- Changed the title of the "Gas-expensive" badge to "500+ gas" to avoid confusion when discussing relative gas-efficiency: PR [#3120](https://github.com/tact-lang/tact/pull/3120)
- Added description of `safety`-related `tact.config.json` options to gas and security best practice pages: PR [#3206](https://github.com/tact-lang/tact/pull/3206)

### Release contributors

- [hazyone](https://github.com/hazyone)
- [lordivash](https://github.com/lordivash)
- [Novus Nota](https://github.com/novusnota)
- [Daniil Sedov](https://github.com/Gusarich)
- [Petr Makhnev](https://github.com/i582)
- [Andrew Gutarev](https://github.com/pyAndr3w)
- [Anton Trunov](https://github.com/anton-trunov)

## [1.6.10] - 2025-05-16

### Infrastructure

- [fix] Explicit dependencies to fix Blueprint integration: PR [#3088](https://github.com/tact-lang/tact/pull/3088)

### Release contributors

- [Petr Makhnev](https://github.com/i582)
- [verytactical](https://github.com/verytactical)

## [1.6.9] - 2025-05-16

### TypeScript third-party API

- [fix] Move logs-related TS files to separate folder: PR [#3082](https://github.com/tact-lang/tact/pull/3082)

### Release contributors

- [Petr Makhnev](https://github.com/i582)

## [1.6.8] - 2025-05-16

### Breaking changes

- [stdlib] Compiler now reports an error if `VarAddress` or `parseVarAddress()` is used, since starting
  from [TVM 10](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md#version-10) they are mostly not supported: PR [#3067](https://github.com/tact-lang/tact/pull/3067).

### Language features

- [fix] Compiler now correctly handles optional slices, builders, and strings when generating serialization logic: PR [#3053](https://github.com/tact-lang/tact/pull/3053)
- [fix] Compiler now disallows type usages as value (e.g. `let x = Int` or `let x = MyStruct`): PR [#3065](https://github.com/tact-lang/tact/pull/3065)

### Code generation

- Use FunC and Fift WASM build [v2025.04](https://github.com/ton-blockchain/ton/releases/tag/v2025.04): PR [#3077](https://github.com/tact-lang/tact/pull/3077)

### Tooling

- [fix] Formatter now correctly handles floating comments: PR [#2995](https://github.com/tact-lang/tact/pull/2995)
- [fix] Formatter now correctly handles inline comments after the last declaration: PR [#3064](https://github.com/tact-lang/tact/pull/3064)
- [fix] Formatter now correctly handles floating comments after import: PR [#3071](https://github.com/tact-lang/tact/pull/3071)
- [fix] Formatter now better supports comments inside chained method calls: PR [#3070](https://github.com/tact-lang/tact/pull/3070)

### Docs

- Enabled format checking across the Cookbook: PR [#2980](https://github.com/tact-lang/tact/pull/2980)
- Added references to https://github.com/tact-lang/defi-cookbook: PR [#2985](https://github.com/tact-lang/tact/pull/2985)
- Added description of the "unreachable code" errors and enhanced the descriptions of the `return` statement: PR [#2750](https://github.com/tact-lang/tact/pull/2750)
- Fixed description of the unary plus `+` operator: PR [#3016](https://github.com/tact-lang/tact/pull/3016)
- Documented that map key-value types and the inner message type of the `bounced<M>` type constructor cannot be nullable: PR [#3017](https://github.com/tact-lang/tact/pull/3017)
- Lowercased "Struct" everywhere except at the beginning of sentences: PR [#3021](https://github.com/tact-lang/tact/pull/3021)
- Reworked the optionals page: PR [#3002](https://github.com/tact-lang/tact/pull/3002)
- Made the low-level representation of maps more apparent: PR [#3080](https://github.com/tact-lang/tact/pull/3080)

### Release contributors

- [Novus Nota](https://github.com/novusnota)
- [Petr Makhnev](https://github.com/i582)
- [Daniil Sedov](https://github.com/Gusarich)
- [skywardboundd](https://github.com/skywardboundd)
- [xpyctumo](https://github.com/xpyctumo)

## [1.6.7] - 2025-04-24

### Language features

- Fixed incorrect error message for bounced messages: PR [#2932](https://github.com/tact-lang/tact/pull/2932)
- Added compile-time map literals: PR [#2881](https://github.com/tact-lang/tact/pull/2881)
- Added the `inMsg()` built-in function as an optimized version of `msg.toSlice()`: PR [#2850](https://github.com/tact-lang/tact/pull/2850)
- Compiler now generates more efficient code for structure fields serialization: PR [#2836](https://github.com/tact-lang/tact/pull/2836)
- Compiler now generates more efficient code for `Address?` fields deserialization: PR [#2834](https://github.com/tact-lang/tact/pull/2834)
- Optimized `self.notify`, `self.reply`, and `self.forward` in `BaseTrait` by using the `message` function directly where possible and avoiding unnecessary use of alias: PR [#2515](https://github.com/tact-lang/tact/pull/2515)
- Compiler now generates more efficient code for `if` statements: PR [#2844](https://github.com/tact-lang/tact/pull/2844)
- Any message now has an `opcode()` method to obtain its opcode: PR [#2886](https://github.com/tact-lang/tact/pull/2886)
- Contract `init` function now can have parameters with `as` annotations: PR [#2890](https://github.com/tact-lang/tact/pull/2890)
- [fix] Compiler now correctly handles get functions with an empty message parameter: PR [#2892](https://github.com/tact-lang/tact/pull/2892)

### Standard Library

- Improved gas consumption of the `cashback` function: PR [#2882](https://github.com/tact-lang/tact/pull/2882)
- Improved gas efficiency for the `BaseTrait` functions: PR [#2913](https://github.com/tact-lang/tact/pull/2913)

### Tooling

- Formatter now shortens `Foo { value: value }` to `Foo { value }`: PR [#2884](https://github.com/tact-lang/tact/pull/2884)
- Formatter now supports formatting several files and directories: PR [#2906](https://github.com/tact-lang/tact/pull/2906)
- [fix] Formatter now correctly formats trailing comments after the last field: PR [#2912](https://github.com/tact-lang/tact/pull/2912)

### Docs

- Added `inMsg()` function to the gas best practices page: PR [#2850](https://github.com/tact-lang/tact/pull/2850)
- Fixed the description of `StateInit.hasSameBasechainAddress()` function: PR [#2848](https://github.com/tact-lang/tact/pull/2848)

### Release contributors

- [Petr Makhnev](https://github.com/i582)
- [Novus Nota](https://github.com/novusnota)
- [skywardboundd](https://github.com/skywardboundd)
- [verytactical](https://github.com/verytactical)
- [Anton Trunov](https://github.com/anton-trunov)

## [1.6.6] - 2025-04-16

### Language features

- Optimized message deserialization with native loading of `Maybe Cell` fields: PR [#2661](https://github.com/tact-lang/tact/pull/2661)
- Optimized message serialization with native stores of `Maybe Cell` fields: PR [#2647](https://github.com/tact-lang/tact/pull/2647)
- Zero inequality comparison optimization: PR [#2655](https://github.com/tact-lang/tact/pull/2655)
- Compiler now generates more readable code for augmented assignment operators: PR [#2710](https://github.com/tact-lang/tact/pull/2710)
- [fix] Compiler now disallows `ton()` with empty or blank string: PR [#2681](https://github.com/tact-lang/tact/pull/2681)
- [fix] Compiler now disallows `ton()` with invalid number value or negative numbers: PR [#2684](https://github.com/tact-lang/tact/pull/2684)
- [fix] Compiler now shows a more informative error message for abstract functions and constants without a body: PR [#2688](https://github.com/tact-lang/tact/pull/2688)
- [fix] Compiler now correctly processes nested structs with default values in the interpreter: PR [#2687](https://github.com/tact-lang/tact/pull/2687)
- [fix] Compiler now correctly compiles contracts with optional struct fields with default values: PR [#2683](https://github.com/tact-lang/tact/pull/2683)
- [fix] Compiler now shows a more informative error message for unsupported assembly functions inside traits and contracts: PR [#2689](https://github.com/tact-lang/tact/pull/2689)
- [fix] Compiler now shows a more informative error message for `Slice? as remaining` fields: PR [#2694](https://github.com/tact-lang/tact/pull/2694)
- [fix] Compiler now shows a more informative error message for fields with unsupported trait types: PR [#2695](https://github.com/tact-lang/tact/pull/2695)
- [fix] Compiler now correctly generates code for functions with several wildcard parameters: PR [#2703](https://github.com/tact-lang/tact/pull/2703)
- [fix] Compiler now checks that "override" functions and constants have a virtual or abstract modifier in the parent trait: PR [#2700](https://github.com/tact-lang/tact/pull/2700)
- [fix] Compiler now throws an error if a non-optional method is called on an optional type: PR [#2770](https://github.com/tact-lang/tact/pull/2770)
- [fix] Compiler now throws an error when inheriting from two traits that have methods with the same name: PR [#2773](https://github.com/tact-lang/tact/pull/2773)
- [fix] Compiler now correctly generates code for the unary plus operator: PR [#2807](https://github.com/tact-lang/tact/pull/2807)
- [fix] Compiler now shows a full error message for maps with optional value: PR [#2810](https://github.com/tact-lang/tact/pull/2810)
- [fix] Compiler now correctly detects mutually recursive types: PR [#2814](https://github.com/tact-lang/tact/pull/2814)
- [fix] Generated TypeScript wrappers now export all functions for serialization/deserialization: PR [#2706](https://github.com/tact-lang/tact/pull/2706)
- [fix] Processing of `null` values of optional types in the `dump` builtin: PR [#2730](https://github.com/tact-lang/tact/pull/2730)
- [fix] Support constants as the second parameter of the `require()` function: PR [#2808](https://github.com/tact-lang/tact/pull/2808)

### Standard Library

- Added compute phase exit code constants reserved by the Tact compiler: `TactExitCodeNullReferenceException`, `TactExitCodeInvalidSerializationPrefix`, `TactExitCodeInvalidIncomingMessage`, `TactExitCodeConstraintsError`, `TactExitCodeAccessDenied`, `TactExitCodeContractStopped`, `TactExitCodeInvalidArgument`, `TactExitCodeContractCodeNotFound`, `TactExitCodeInvalidStandardAddress`, `TactExitCodeNotBasechainAddress`: PR [#2527](https://github.com/tact-lang/tact/pull/2527)
- Added the `SignedBundle` struct and the corresponding `verifySignature` method: PR [#2627](https://github.com/tact-lang/tact/pull/2627)
- Added the `sendRawMessage` and `sendRawMessageReturnForwardFee` functions instead of the deprecated `nativeSendMessage` and `nativeSendMessageReturnForwardFee` functions correspondingly: PR [#2755](https://github.com/tact-lang/tact/pull/2755)
- Optimized the `sha256()` function to about ~270 less gas used per call and added the `keccak256()` function: PR [#2775](https://github.com/tact-lang/tact/pull/2775)

### Tooling

- Added source code formatter: PR [#2768](https://github.com/tact-lang/tact/pull/2768)
  - Show a better error if a file cannot be parsed by the formatter: PR [#2796](https://github.com/tact-lang/tact/pull/2796)
  - Added `--check` flag to formatter: PR [#2788](https://github.com/tact-lang/tact/pull/2788)
  - Support directory formatting: PR [#2787](https://github.com/tact-lang/tact/pull/2787)

### TypeScript third-party API

- Support contract parameters in the AST printer: PR [#2658](https://github.com/tact-lang/tact/pull/2658)

### Docs

- Fixed code example of the `initOf` expression to highlight support for contract parameters: PR [#2550](https://github.com/tact-lang/tact/pull/2550)
- Fixed the description of the Tact-reserved exit code 129 and expanded descriptions of functions that can throw it, such as `Message.fromCell()` and `Message.fromSlice()`: PR [#2604](https://github.com/tact-lang/tact/pull/2604)
- Added "Learn Tact in Y minutes" page to the Book: PR [#2375](https://github.com/tact-lang/tact/pull/2375)
- Ensured that variables are always shown declared with immediate initialization, and made it clear in the descriptions of the `let` statement: PR [#2742](https://github.com/tact-lang/tact/pull/2742)
- Fixed the description of the Unicode escape upper bound (U+10FFFF): PR [#2752](https://github.com/tact-lang/tact/pull/2752)
- Added generation of `llms.txt`, `llms-full.txt` (full version), and `llms-small.txt` (compact version, with non-essential content removed): PR [#2763](https://github.com/tact-lang/tact/pull/2763)
- Added description of the specialized math functions, such as `pow2()` and `log2()`, to the gas best practices page: PR [#2771](https://github.com/tact-lang/tact/pull/2771)
- Added `BasechainAddress` to the gas best practices page: PR [#2802](https://github.com/tact-lang/tact/pull/2802)
- Applied suggestions from the gas best practices page to the security best practices page: PR [#2811](https://github.com/tact-lang/tact/pull/2811)

### Release contributors

- [Novus Nota](https://github.com/novusnota)
- [skywardboundd](https://github.com/skywardboundd)
- [Petr Makhnev](https://github.com/i582)
- [Anton Trunov](https://github.com/anton-trunov)
- [verytactical](https://github.com/verytactical)

## [1.6.5] - 2025-03-28

### Language features

- Optimized `Context().sender` to use `sender()` function for better gas efficiency: PR [#2427](https://github.com/tact-lang/tact/pull/2427)
- [fix] Ternary operator with struct and null: PR [#2432](https://github.com/tact-lang/tact/pull/2432)
- [fix] Show an error message for assembly functions with the `get` attribute: PR [#2484](https://github.com/tact-lang/tact/pull/2484)
- [fix] The parser does not throw an internal compiler error if the error is reported after the end of the file: PR [#2485](https://github.com/tact-lang/tact/pull/2485)
- [fix] Always show an error when calling the `dump()` function with an argument of the unsupported `StringBuilder` type: PR [#2491](https://github.com/tact-lang/tact/pull/2491)
- [fix] The grammar now disallows the augmented assignment operators with whitespace between the operator and the equals sign: PR [#2492](https://github.com/tact-lang/tact/pull/2492)
- [fix] Generated code now short-circuits `&&=` and `||=` operators: PR [#2494](https://github.com/tact-lang/tact/pull/2494)
- [fix] Get methods that return optional contract state now work correctly: PR [#2512](https://github.com/tact-lang/tact/pull/2512)
- [fix] Get methods that return contract state for empty contracts now work correctly: PR [#2517](https://github.com/tact-lang/tact/pull/2517)
- [fix] Skip checking if the slice has been parsed completely when parsing a message (`Message.fromSlice()`) with the last field of the type `Slice as remaining`: PR [#2524](https://github.com/tact-lang/tact/pull/2524)
- [fix] The wildcard symbol (`_`) cannot be used as an identifier in any context, including struct/message fields or contract names: PR [#2519](https://github.com/tact-lang/tact/pull/2519)

### Standard Library

- Deprecated the `SendPayGasSeparately` constant in favor of `SendPayFwdFeesSeparately`: PR [#2483](https://github.com/tact-lang/tact/pull/2483)
- Time-related functions are now located in the `std/internal/time.tact` file: PR [#2507](https://github.com/tact-lang/tact/pull/2507)
- [fix] The `Stoppable` trait now uses `throwUnless` with exit code 133 instead of `require` with "Contract stopped" message: PR [#2503](https://github.com/tact-lang/tact/pull/2503)

### Code generation

- [fix] Save the contract state on early `return` from receivers: PR [#2482](https://github.com/tact-lang/tact/pull/2482)

### Internal infrastructure

- `internalExternalReceiversOutsideMethodsMap` has been reworked to ensure compatibility with explorers: PR [#2398](https://github.com/tact-lang/tact/pull/2398)

### Docs

- Fixed description of the `dump()` function, which does not support values of `StringBuilder` type: PR [#2463](https://github.com/tact-lang/tact/pull/2463)
- Explicitly stated that structs cannot be empty, while message structs can: PR [#2464](https://github.com/tact-lang/tact/pull/2464)
- Fixed description of the `contractAddressExt()` function, which currently does not resolve constant values at compile-time and allows specifying arbitrary `chain` IDs: PR [#2497](https://github.com/tact-lang/tact/pull/2497)
- Fixed description of `getOriginalFwdFee()` and `Context.readForwardFee()` functions, where the latter calls the former at the end of its execution: PR [#2521](https://github.com/tact-lang/tact/pull/2521)

### Release contributors

- [Shvetc Andrei](https://github.com/Shvandre)
- [Daniil Sedov](https://github.com/Gusarich)
- [Novus Nota](https://github.com/novusnota)
- [Petr Makhnev](https://github.com/i582)
- [skywardboundd](https://github.com/skywardboundd)
- [Anton Trunov](https://github.com/anton-trunov)

### Special thanks

- [Ilya Aksakov](https://github.com/ilyaAksakov) and the [RSquad](https://github.com/rsquad) team

## [1.6.4] - 2025-03-18

### Language features

- Applied parameters rearrangement only for ASM methods with a single parameter to avoid confusion: PR [#2410](https://github.com/tact-lang/tact/pull/2410)
- Reduced gas usage for contracts with some special cases of binary and fallback receivers: PR [#2396](https://github.com/tact-lang/tact/pull/2396)

### Standard Library

- Added `forceWorkchain()` function: PR [#2387](https://github.com/tact-lang/tact/pull/2387)

#### Compilation report

- [fix] TL-B for `Address?` is not `Maybe Address`, but plain `Address`: PR [#2386](https://github.com/tact-lang/tact/pull/2386)

### Internal infrastructure

- Removed `postinstall` from `package.json` to not run scripts with dev dependencies on the user side: PR [#2382](https://github.com/tact-lang/tact/pull/2382)

### Docs

- Removed the "gas-expensive" badge from `checkSignature()` and `checkDataSignature()` functions and added a caution note when they do become expensive (from 11th call): PR [#2380](https://github.com/tact-lang/tact/pull/2380)
- Fixed descriptions of `Slice.asString()` and `String.asSlice()` functions: PR [#2391](https://github.com/tact-lang/tact/pull/2391)
- Split Core libraries in the reference: `core-common` and `core-advanced` were removed, and their contents were distributed across other libraries; `core-crypto`, `core-contextstate`, `core-send`, `core-gas`, and `core-addresses` were introduced: PR [#2391](https://github.com/tact-lang/tact/pull/2391)
- Added documentation for `BasechainAddress`, `emptyBasechainAddress`, `newBasechainAddress`, `contractBasechainAddress`, `Builder.storeBasechainAddress`: PR [#2411](https://github.com/tact-lang/tact/pull/2411)

### Release contributors

- [Novus Nota](https://github.com/novusnota)
- [Anton Trunov](https://github.com/anton-trunov)
- [Maksim Lagus](https://github.com/Kaladin13)
- [Petr Makhnev](https://github.com/i582)
- [verytactical](https://github.com/verytactical)

## [1.6.3] - 2025-03-12

### Compiler configuration

- Added `internalExternalReceiversOutsideMethodsMap` config option as part of optimization options to protect potentially unwanted optimization: PR [#2370](https://github.com/tact-lang/tact/pull/2370)

### Standard Library

- Added `forceBasechain()` function: PR [#2330](https://github.com/tact-lang/tact/pull/2330)

### Internal infrastructure

- Removed old parser: PR [#2365](https://github.com/tact-lang/tact/pull/2365)

### Docs

- Added descriptions for `&&=`, `||=`, `>>=` and `<<=` augmented assignment operators: PR [#2328](https://github.com/tact-lang/tact/pull/2328)
- Added gas best practices page: PR [#2342](https://github.com/tact-lang/tact/pull/2342)
- Documented semantics of empty contract parameters: PR [#2346](https://github.com/tact-lang/tact/pull/2346)
- Deprecated `Deployable` and `FactoryDeployable` traits in favor of `null` message body `receive()` and a `cashback()` function: PR [#2354](https://github.com/tact-lang/tact/pull/2354)
- Documented new exit code and opcode records in TypeScript wrappers: PR [#2348](https://github.com/tact-lang/tact/pull/2348)

### Release contributors

- [Novus Nota](https://github.com/novusnota)
- [Maksim Lagus](https://github.com/Kaladin13)
- [verytactical](https://github.com/verytactical)
- [Shvetc Andrei](https://github.com/Shvandre)
- [Petr Makhnev](https://github.com/i582)

## [1.6.2] - 2025-03-06

### Language features

- [fix] Empty `init()` is not implicitly inserted when empty contract parameters are present: PR [#2314](https://github.com/tact-lang/tact/pull/2314)

### Standard Library

- Add doc comments for the functions and structs in `/libs`: PR [#2308](https://github.com/tact-lang/tact/pull/2308)
- Add the `Slice.skipRef`, `Slice.skipMaybeRef`, `Slice.skipBool`, `Slice.skipCoins`, `Slice.skipVarUint16`, `Slice.skipVarInt16`, `Slice.skipVarUint32`, `Slice.skipVarInt32`, `Slice.skipAddress` functions: PR [#2305](https://github.com/tact-lang/tact/pull/2305)

### Error reporting

- [fix] Don't give an error for a small enough type for bounce receiver: PR [#2300](https://github.com/tact-lang/tact/pull/2300)

### TypeScript wrappers

- [fix] Getters are called by their named and not method_id if it is not explicitly set: PR [#2299](https://github.com/tact-lang/tact/issues/2299)
- Contract constructors are public now: PR [#2290](https://github.com/tact-lang/tact/issues/2290)

### Release contributors

- [Petr Makhnev](https://github.com/i582)
- [verytactical](https://github.com/verytactical)
- [Maksim Lagus](https://github.com/Kaladin13)
- [Shvetc Andrei](https://github.com/Shvandre)
- [Daniil Sedov](https://github.com/Gusarich)
- [Novus Nota](https://github.com/novusnota)

## [1.6.1] - 2025-03-04

### Language features

- [fix] The `toCell()` method called in a receiver on a contract field that is a struct is now handled correctly: PR [#2186](https://github.com/tact-lang/tact/pull/2186)
- [fix] Support for multiple wildcard function parameters: PR [#2188](https://github.com/tact-lang/tact/pull/2188)

### Standard Library

- Add the `StateInit.hasSameBasechainAddress` function: PR [#2187](https://github.com/tact-lang/tact/pull/2187)
- Add doc comments for most functions and structs: PR [#2267](https://github.com/tact-lang/tact/pull/2267)
- Add the `cashback` function: PR [#2241](https://github.com/tact-lang/tact/pull/2241)

### TypeScript wrappers

- Export message opcodes and exit codes: PR [#2081](https://github.com/tact-lang/tact/issues/2081)

### Code generation

- Contract load function is inlined: PR [#2101](https://github.com/tact-lang/tact/pull/2101)

### TypeScript third-party API

- Export more API from `index.ts`, including AST, context, parser, build pipeline, and typechecker functions: PR [#2196](https://github.com/tact-lang/tact/pull/2196)

### Internal infrastructure

- Do not add `.code` to the file names of the generated FunC, Fift, and disassembled Fift: PR [#2103](https://github.com/tact-lang/tact/pull/2103)
- Moved `benchmarks` to separate folder from tests, added CLI utilities for them: PR [#2234](https://github.com/tact-lang/tact/pull/2234)

### Release contributors

- [Anton Trunov](https://github.com/anton-trunov)
- [Daniil Sedov](https://github.com/Gusarich)
- [Petr Makhnev](https://github.com/i582)
- [Jesús Héctor Domínguez Sánchez](https://github.com/jeshecdom)
- [verytactical](https://github.com/verytactical)
- [Shvetc Andrei](https://github.com/Shvandre)
- [Maksim Lagus](https://github.com/Kaladin13)
- [Novus Nota](https://github.com/novusnota)

## [1.6.0] - 2025-02-28

### Language features

- Added `&&=`, `||=`, `>>=` and `<<=` augmented assignment operators: PR [#853](https://github.com/tact-lang/tact/pull/853)
- Added non-nested `let`-destructuring of structs and messages: PR [#856](https://github.com/tact-lang/tact/pull/856), PR [#964](https://github.com/tact-lang/tact/pull/964), PR [#969](https://github.com/tact-lang/tact/pull/969)
- Introduced the ability to specify a compile-time _method ID_ expression for getters: PR [#922](https://github.com/tact-lang/tact/pull/922) and PR [#932](https://github.com/tact-lang/tact/pull/932)
- Ability to specify a compile-time message opcode _expression_: PR [#1188](https://github.com/tact-lang/tact/pull/1188)
- The maps methods have been extended with the new `replace` and `replaceGet`: PR [#941](https://github.com/tact-lang/tact/pull/941)
- Added support for block statements: PR [#1334](https://github.com/tact-lang/tact/pull/1334)
- Added the new `codeOf` expression to get the code of child contracts: PR [#1948](https://github.com/tact-lang/tact/pull/1948)
- Optional types for `self` argument in `extends mutates` functions are now allowed: PR [#854](https://github.com/tact-lang/tact/pull/854)
- Stop automatically validates all addresses when receiving/sending messages or using address manipulating functions: PR [#1207](https://github.com/tact-lang/tact/pull/1207)
- Removed `org.ton.chain.any.v0` interface: PR [#1207](https://github.com/tact-lang/tact/pull/1207)
- Don't generate the `lazy_deployment_completed` getter by default: PR [#1717](https://github.com/tact-lang/tact/pull/1717)
- To reduce gas usage, Tact no longer stores the parent contract code in the system cell that holds all the child contract codes used in `initOf`. Instead, the `MYCODE` instruction is used: PR [#1213](https://github.com/tact-lang/tact/pull/1213)
- Trait fields can now have serialization specifiers: PR [#1303](https://github.com/tact-lang/tact/pull/1303)
- Calling methods on `null` when `self` is of an optional type is now allowed: PR [#1567](https://github.com/tact-lang/tact/pull/1567)
- Constants and trait constants can now depend on each other: PR [#1622](https://github.com/tact-lang/tact/pull/1622)
- Support overriding constants and methods of the `BaseTrait` trait: PR [#1591](https://github.com/tact-lang/tact/pull/1591)
- Introduced contract parameters as a replacement for the lazy initialization via the `init()` function: PR [#1985](https://github.com/tact-lang/tact/pull/1985), PR [#2071](https://github.com/tact-lang/tact/pull/2071)
- [fix] Collisions in getter method IDs are now handled and reported correctly: PR [#875](https://github.com/tact-lang/tact/pull/875), PR [#1052](https://github.com/tact-lang/tact/pull/1052)
- [fix] The `as coins` map value serialization type is now handled correctly: PR [#987](https://github.com/tact-lang/tact/pull/987)
- [fix] Fixed type checking of `foreach` loops in trait methods: PR [#1017](https://github.com/tact-lang/tact/pull/1017)
- [fix] The `sha256()` function no longer throws on statically known strings of any length: PR [#907](https://github.com/tact-lang/tact/pull/907)
- [fix] The `foreach` loop now correctly handles the `as coins` map value serialization type: PR [#1186](https://github.com/tact-lang/tact/pull/1186)
- [fix] The typechecker now rejects integer map key types with variable width (`coins`, `varint16`, `varint32`, `varuint16`, `varuint32`): PR [#1276](https://github.com/tact-lang/tact/pull/1276)
- [fix] The typechecker now rejects `as remaining` fields in the middle of contract storage: PR [#1301](https://github.com/tact-lang/tact/pull/1301)
- [fix] The `override` modifier for functions without the corresponding super-function is not allowed: PR [#1302](https://github.com/tact-lang/tact/pull/1302)
- [fix] The `override` modifier for constants without the corresponding super-constant is not allowed: PR [#1591](https://github.com/tact-lang/tact/pull/1591)
- [fix] Allowed importing FunC files with `.func` extension: PR [#1451](https://github.com/tact-lang/tact/pull/1451)
- [fix] Bit shift FunC compilation errors for incorrect bit widths: PR [#1453](https://github.com/tact-lang/tact/pull/1453)
- [fix] Process `else if` statements during constant evaluation: PR [#1500](https://github.com/tact-lang/tact/pull/1500)
- [fix] Incorrect arithmetic bit shift operations optimizations: PR [#1501](https://github.com/tact-lang/tact/pull/1501)
- [fix] Throwing from functions with non-trivial branching in the `try` statement: PR [#1501](https://github.com/tact-lang/tact/pull/1501)
- [fix] Forbid reading and writing to self in contract init function: PR [#1482](https://github.com/tact-lang/tact/pull/1482)
- [fix] Support for using a constant within another constant and for the default value of a struct field before constant declaration: PR [#1478](https://github.com/tact-lang/tact/pull/1478)
- [fix] Incorrect call generation to a mutation function: PR [#1608](https://github.com/tact-lang/tact/pull/1608)
- [fix] Runtime calls to `sha256()` now work for arbitrary _strings_ with length >= 128: PR [#1626](https://github.com/tact-lang/tact/pull/1626)
- [fix] Runtime calls to `sha256()` now work for arbitrary _slices_ with length >= 128: PR [#1936](https://github.com/tact-lang/tact/pull/1936)
- [fix] Forbid traits inherit implicitly from `BaseTrait`: PR [#1591](https://github.com/tact-lang/tact/pull/1591)
- [fix] Check map types for the `deepEquals` method: PR [#1718](https://github.com/tact-lang/tact/pull/1718)
- [fix] Generate the fallback receiver for external messages: PR [#1926](https://github.com/tact-lang/tact/pull/1926)
- [fix] Destruct statement for struct with nested struct fields: PR [#2084](https://github.com/tact-lang/tact/pull/2084)

### Standard Library

- **BREAKING CHANGE:** `Context.bounced` field was replaced with the `Context.bounceable` field: PR [#1934](https://github.com/tact-lang/tact/pull/1934)
- Added the `message()` function to optimize message sending without deploying a contract: PR [#1999](https://github.com/tact-lang/tact/pull/1999)
- Added the `deploy()` function to optimize the deployment of a child contract: PR [#1832](https://github.com/tact-lang/tact/pull/1832)
- Introduced the new `SendDefaultMode` send mode constant: PR [#1010](https://github.com/tact-lang/tact/pull/1010)
- Added the `VarInt16`, `VarInt32`, `VarUint16`, `VarUint32` integer serialization types and the corresponding `storeVarInt16`, `storeVarUint16`, `storeVarInt32`, `storeVarUint32` methods for the `Builder` type: PR [#1186](https://github.com/tact-lang/tact/pull/1186), PR [#1274](https://github.com/tact-lang/tact/pull/1274)
- Added `loadVarInt16`, `loadVarUint16`, `loadVarInt32`, and `loadVarUint32` methods for the `Slice` type: PR [#1667](https://github.com/tact-lang/tact/pull/1667)
- Added new functions in stdlib: `Builder.depth`, `Slice.skipLastBits`, `Slice.firstBits`, `Slice.lastBits`, `Slice.depth`, `Cell.computeDataSize`, `Slice.computeDataSize`, `Cell.depth`, `curLt`, `blockLt`, `setGasLimit`, `getSeed`, `setSeed`, `myCode`, `sign`, `divc`, `muldivc`, `mulShiftRight`, `mulShiftRightRound`, `mulShiftRightCeil`, `sqrt`, `Slice.loadMaybeRef`, `Slice.preloadMaybeRef`: PR [#986](https://github.com/tact-lang/tact/pull/986), PR [#2040](https://github.com/tact-lang/tact/pull/2040)
- Added new functions `Slice.asAddress`, `Slice.asAddressUnsafe` and `contractHash`: PR [#1766](https://github.com/tact-lang/tact/pull/1766)
- Added new functions `throwIf` and `throwUnless` and deprecated their aliases `nativeThrowIf` and `nativeThrowUnless`: PR [#1974](https://github.com/tact-lang/tact/pull/1974)
- Added the `BasechainAddress` type as a more optimized version of the `Address` type. And also the `emptyBasechainAddress`, `newBasechainAddress`, `contractBasechainAddress`, `Builder.storeBasechainAddress` functions: PR [#2035](https://github.com/tact-lang/tact/pull/2035)
- Added the `Slice.hashData()` and `String.hashData()` functions: PR [#2039](https://github.com/tact-lang/tact/pull/2039)
- Optimized the `emptyCell()` and `emptySlice()` functions: PR [#1696](https://github.com/tact-lang/tact/pull/1696)
- The `Int.toString` function now consumes up to 64% less gas: PR [#1837](https://github.com/tact-lang/tact/pull/1837)
- The `Int.toFloatString` now consumes up to 62% less gas: PR [#1956](https://github.com/tact-lang/tact/pull/1956)

### Error reporting

- Removed duplicate line and column info from error messages: PR [#1362](https://github.com/tact-lang/tact/pull/1362)
- Improved the error message for the missing message field error message for bounced types: PR [#1111](https://github.com/tact-lang/tact/pull/1111)
- Improved the error message for the `unresolved name` error: PR [#1595](https://github.com/tact-lang/tact/pull/1595)
- Improved the error message for the `unresolved global function` error: PR [#1610](https://github.com/tact-lang/tact/pull/1610)
- Improved the error message for the `extend function without parameters` error: PR [#1624](https://github.com/tact-lang/tact/pull/1624)
- The error message for invalid type for function argument now shows the expected type: PR [#1738](https://github.com/tact-lang/tact/pull/1738)
- The error message for the reserved `self` function parameter now suggests using the `extends` function modifier: PR [#1737](https://github.com/tact-lang/tact/pull/1737)
- Improved the error message for the undefined type error: PR [#2005](https://github.com/tact-lang/tact/pull/2005)
- 'The "remainder" field can only be the last field:' inspection now shows location: PR [#1300](https://github.com/tact-lang/tact/pull/1300)
- Remove "remainder" from error messages: PR [#1699](https://github.com/tact-lang/tact/pull/1699)
- Show better error for fields with a contract type: PR [#2011](https://github.com/tact-lang/tact/pull/2011)
- Show stack trace of a compiler error only in verbose mode: PR [#1375](https://github.com/tact-lang/tact/pull/1375)
- Improved error messages for empty `bounced()` and `bounced("string")` receivers which are both not allowed: PR [#1998](https://github.com/tact-lang/tact/pull/1998)
- [fix] Show error on circular trait dependencies: PR [#1452](https://github.com/tact-lang/tact/pull/1452)
- [fix] Error message for comment (text) receivers with 124 bytes or more: PR [#1711](https://github.com/tact-lang/tact/pull/1711)

### TypeScript wrappers

- Module- and contract-level Tact constants get their counter-parts in the generated TS wrappers: PR [#2043](https://github.com/tact-lang/tact/pull/2043)
- TS wrappers now use `const` where possible for variable declarations: PR [#1292](https://github.com/tact-lang/tact/pull/1292)
- [fix] Non-null struct fields after null ones are treated correctly in Sandbox tests after updating `@ton/core` to 0.59.0: PR [#933](https://github.com/tact-lang/tact/pull/933)
- [fix] Messages with single quote are treated correctly: PR [#1106](https://github.com/tact-lang/tact/pull/1106)
- [fix] The name clash for init-functions of the form `init(init: Init)`: PR [#1709](https://github.com/tact-lang/tact/pull/1709)

### Compiler configuration

- **BREAKING CHANGE:** Removed the `enabledMasterchain` compiler config option from `tact.config.json`: PR [#1207](https://github.com/tact-lang/tact/pull/1207)
- Added `nullChecks` config option to disable run-time null checks for the `!!` operator to save gas: PR [#1660](https://github.com/tact-lang/tact/pull/1660)

### Tooling

#### `tact` CLI

- The new `--output` CLI flag for specifying custom output directory in the single-contract compilation: PR [#1793](https://github.com/tact-lang/tact/pull/1793)
- The new `-w` / `--watch` CLI flags to watch for changes in the project and automatically recompile it: PR [#1844](https://github.com/tact-lang/tact/pull/1844)
- [fix] Fix the `--help` output (`--project` to `--projects`): PR [#1419](https://github.com/tact-lang/tact/pull/1419)

#### `unboc` CLI

- Introduced `unboc`: a standalone CLI utility to expose Tact's TVM disassembler: PR [#1259](https://github.com/tact-lang/tact/pull/1259)
- Bump used `@tact-lang/opcode` version to `0.3`, which fixes many issues in CI runs: PR [#1922](https://github.com/tact-lang/tact/pull/1922)

#### Compilation report

- The generated error codes are now formatted as a list: PR [#1051](https://github.com/tact-lang/tact/pull/1051)
- [fix] Contract data types in compilation reports are now generated correctly: PR [#2004](https://github.com/tact-lang/tact/pull/2004)

### TypeScript third-party API

- The `parseImports` function now returns AST import nodes instead of raw strings: PR [#966](https://github.com/tact-lang/tact/pull/966)
- Unified `StatementTry` and `StatementTryCatch` AST nodes: PR [#1418](https://github.com/tact-lang/tact/pull/1418)
- [fix] AST printer: format empty blocks without extra empty line: PR [#1346](https://github.com/tact-lang/tact/pull/1346)
- [fix] AST printer: support `AstTypedParameter` AST node: PR [#1347](https://github.com/tact-lang/tact/pull/1347)

### Internal infrastructure

- Added alternative parser: PR [#1258](https://github.com/tact-lang/tact/pull/1258)
- New CSpell dictionaries: TVM instructions and adjusted list of Fift words: PR [#881](https://github.com/tact-lang/tact/pull/881)
- Utility for logging errors in code that was supposed to be unreachable: PR [#991](https://github.com/tact-lang/tact/pull/991)
- Remove unused typechecker wrapper with the file `check.ts` it is contained in: PR [#1313](https://github.com/tact-lang/tact/pull/1313)
- The internal `crc16` function is now verifiable and covered with tests: PR [#1739](https://github.com/tact-lang/tact/pull/1739)
- All generated FunC code is combined into a single file: PR [#1698](https://github.com/tact-lang/tact/pull/1698)

### Code generation

- Make `msg_bounced` last parameter of `*_contract_router_internal` for better code generation: PR [#1585](https://github.com/tact-lang/tact/pull/1585)
- Inline `*_contract_init` function: PR [#1589](https://github.com/tact-lang/tact/pull/1589)
- Rearrange parameters of some `asm` methods in the order described in `AsmShuffle`: PR [#1702](https://github.com/tact-lang/tact/pull/1702)
- Struct serialization and parsing functions are now inlined more aggressively to save gas: PR [#2016](https://github.com/tact-lang/tact/pull/2016)
- `NOP` instructions and empty asm functions are now optimized: PR [#1959](https://github.com/tact-lang/tact/pull/1959)
- Contracts are now compiled with custom optimized function selector with a shortcut for `recv_internal` and `recv_external`: PR [#2038](https://github.com/tact-lang/tact/pull/2038)
- Contract receivers do not update the contract data cell at the end of execution if the receiver does not modify the contract storage: PR [#2067](https://github.com/tact-lang/tact/pull/2067), PR [#2077](https://github.com/tact-lang/tact/pull/2077)
- [fix] Fixed code generation for `self` argument in optional struct methods: PR [#1284](https://github.com/tact-lang/tact/pull/1284)
- [fix] Fixed `initOf` with dependency in a global function used inside `init()`: PR [#2027](https://github.com/tact-lang/tact/pull/2027)

### Docs

- Prevent inline code snippets from changing their background color: PR [#935](https://github.com/tact-lang/tact/pull/935)
- Added the `description` property to the frontmatter of each page for better SEO: PR [#916](https://github.com/tact-lang/tact/pull/916)
- Added Google Analytics tags per every page: PR [#921](https://github.com/tact-lang/tact/pull/921)
- Added Ston.fi cookbook: PR [#956](https://github.com/tact-lang/tact/pull/956)
- Added NFTs cookbook: PR [#958](https://github.com/tact-lang/tact/pull/958), PR [#1747](https://github.com/tact-lang/tact/pull/1747)
- Added security best practices: PR [#1070](https://github.com/tact-lang/tact/pull/1070)
- Added automatic links to Web IDE from all code blocks: PR [#994](https://github.com/tact-lang/tact/pull/994)
- Added initial semi-automated Chinese translation of the documentation: PR [#942](https://github.com/tact-lang/tact/pull/942)
- Documented `preloadRef` method for the `Slice` type: PR [#1044](https://github.com/tact-lang/tact/pull/1044)
- Added DeDust cookbook: PR [#954](https://github.com/tact-lang/tact/pull/954)
- Described the limit for deeply nested expressions: PR [#1101](https://github.com/tact-lang/tact/pull/1101)
- Completely overhauled the exit codes page: PR [#978](https://github.com/tact-lang/tact/pull/978)
- Enhanced Jettons Cookbook page: PR [#944](https://github.com/tact-lang/tact/pull/944)
- Added a note that `compilables/` can sometimes be used over `wrappers/` in Blueprint projects: PR [#1112](https://github.com/tact-lang/tact/pull/1112)
- Changed the layout of tables, updated syntax highlighting, and added Chinese translations of sidebar separators: PR [#916](https://github.com/tact-lang/tact/pull/916)
- Fixed handling of next and previous page links at the bottom of the pages when there's a separator item in the sidebar: PR [#949](https://github.com/tact-lang/tact/pull/949)
- Enabled compilation of examples in `data-structures.mdx` and across Cookbook: PR [#917](https://github.com/tact-lang/tact/pull/917)
- Removed the Programmatic API page due to frequent changes. To use the API, please refer to the compiler sources: PR [#1184](https://github.com/tact-lang/tact/pull/1184)
- Added a link to the article by CertiK to the Security best practices page: PR [#1185](https://github.com/tact-lang/tact/pull/1185)
- Added a note on `dump()` being computationally expensive: PR [#1189](https://github.com/tact-lang/tact/pull/1189)
- Fixed links in Chinese translation: PR [#1206](https://github.com/tact-lang/tact/pull/1206)
- Added a note on 255 being the maximum number of messages that can be sent during the action phase: PR [#1237](https://github.com/tact-lang/tact/pull/1237)
- Added on-chain metadata creation for NFTs and Jettons to the cookbook: PR [#1236](https://github.com/tact-lang/tact/pull/1236)
- Documented that identifiers cannot start with `__gen` or `__tact`, and cannot contain Unicode characters apart from the small subset `a-zA-Z0-9_`: PR [#1312](https://github.com/tact-lang/tact/pull/1312)
- Added signatures for map methods, such as `.get()`, `.exists()`, `.set()`, `.replace()`, `.replaceGet()`, `.del()`, `.isEmpty()`, `.deepEquals()`, `.asCell()`: PR [#1352](https://github.com/tact-lang/tact/pull/1352)
- Added a compilation-related page with the description of the compilation report: PR [#1309](https://github.com/tact-lang/tact/pull/1309), PR [#1387](https://github.com/tact-lang/tact/pull/1387)
- Documented `BaseTrait` and methods in stdlib code: PR [#1296](https://github.com/tact-lang/tact/pull/1296)
- Documented how storage variables get updated in relation to the `init()` function: PR [#1311](https://github.com/tact-lang/tact/pull/1311)
- Documented compiler upgrades in Blueprint and other Tact projects: PR [#1560](https://github.com/tact-lang/tact/pull/1560)
- Illustrated how nested maps can be created: PR [#1593](https://github.com/tact-lang/tact/pull/1593)
- Improved Chinese localization of the documentation: PR [#1642](https://github.com/tact-lang/tact/pull/1642)
- Removed the notion of the non-standard TL-B syntax `remainder<X>`: PR [#1599](https://github.com/tact-lang/tact/pull/1599)
- Added description of `.boc`, `.ts`, `.abi`, and `.pkg` files and completed Compilation page: PR [#1676](https://github.com/tact-lang/tact/pull/1676)
- Marked gas-expensive functions and expressions: PR [#1703](https://github.com/tact-lang/tact/pull/1703)
- Added a Security audits page, with the first assessment from the Trail of Bits: PR [#1791](https://github.com/tact-lang/tact/pull/1791)
- Listed functions with implicit mode and further clarified the interactions of message-sending functions and their modes: PR [#1634](https://github.com/tact-lang/tact/pull/1634)
- Added `Deployable` trait to all contracts in the Cookbook: PR [#1906](https://github.com/tact-lang/tact/pull/1906)
- Added a note on the Debug page about high gas use of functions enabled with debug mode: PR [#1938](https://github.com/tact-lang/tact/pull/1938)
- Added a note on the Assembly functions page regarding the ordering of fields in stdlib structures: PR [#1976](https://github.com/tact-lang/tact/pull/1976)
- Added a link to Awesome Tact after the Ecosystem section: PR [#2015](https://github.com/tact-lang/tact/pull/2015)
- Updated VSCode page in the Ecosystem with the new extension and language server: PR [#2031](https://github.com/tact-lang/tact/pull/2031)
- Updated contracts in `./examples`: PR [#2008](https://github.com/tact-lang/tact/pull/2008)
- Added `Upgradable` and `DelayedUpgradable` traits to the Cookbook: PR [#1896](https://github.com/tact-lang/tact/pull/1896), PR [#2079](https://github.com/tact-lang/tact/pull/2079)

### Release contributors

- [Aliaksandr Bahdanau](https://github.com/a-bahdanau)
- [Anton Trunov](https://github.com/anton-trunov)
- [Daniil Sedov](https://github.com/Gusarich)
- [Danil Ovchinnikov](https://github.com/Danil42Russia)
- [Esorat](https://github.com/Esorat)
- [Georgiy Komarov](https://github.com/jubnzv)
- [Ikko Eltociear Ashimine](https://github.com/eltociear)
- [Jesús Héctor Domínguez Sánchez](https://github.com/jeshecdom)
- [Maksim Lagus](https://github.com/Kaladin13)
- [Novus Nota](https://github.com/novusnota)
- [Petr Makhnev](https://github.com/i582)
- [Shvetc Andrei](https://github.com/Shvandre)
- [Vodka2134156](https://github.com/Vodka2134156)
- [Vsevolod](https://github.com/sraibaby)
- [sansx](https://github.com/sansx)
- [verytactical](https://github.com/verytactical)
- [xpyctumo](https://github.com/xpyctumo)

## [1.5.4] - 2025-02-04

### Fixed

- Allowed importing FunC files with `.func` extension. Resolves the `TOB-TACT-1` issue
- Issue understandable error on circular trait dependencies. Resolves the `TOB-TACT-2` issue
- Forbade accessing files via symlinks. Resolves the `TOB-TACT-3` issue
- Bit shift FunC compilation errors for incorrect bit widths. Partially resolves the `TOB-TACT-5` issue
- Streamlined `renameModuleItems` function. Resolves the `TOB-TACT-6` issue
- Documented the parser limitations for nested expressions. Alleviates the `TOB-TACT-7` issue
- Bit shift FunC compilation errors for incorrect bit widths
- Throwing from functions with non-trivial branching in the `try` statement

### Notes

Handling the Unicode in the Tact grammar as per the `TOB-TACT-4` issue has been left unchanged and will be addressed in the future Tact releases.

### Release contributors

- [Anton Trunov](https://github.com/anton-trunov): security audit fixes
- [@verytactical](https://github.com/verytactical): internal review of the security audit fixes
- [Trail of Bits](https://www.trailofbits.com): the security audit of the Tact compiler v1.5.0 (commit 0106ea14857bcf3c40dd10135243d0de96012871) and the audit of the fixes

## [1.5.3] - 2024-11-28

### Changed

- Replaced `Set.isSubsetOf()` with `isSubsetOf()` to support Node.js ≥18 and <22: PR [#1009](https://github.com/tact-lang/tact/pull/1009)

### Release contributors

- [Novus Nota](https://github.com/novusnota)

## [1.5.2] - 2024-09-25

### Fixed

- `asm` functions now support full range of Fift-asm syntax: PR [#855](https://github.com/tact-lang/tact/pull/855), PR [#1061](https://github.com/tact-lang/tact/pull/1061)

- Fix `npm` installations of Tact compiler or any of the packages depending on it by hiding unnecessary post-install runs of `husky`: PR [#870](https://github.com/tact-lang/tact/pull/870)

### Release contributors

- [Novus Nota](https://github.com/novusnota)

## [1.5.1] - 2024-09-18

### Added

- The `engines` property in `package.json` and its strict checking to ensure minimal required Node.js version is 22: PR [#847](https://github.com/tact-lang/tact/pull/847)

### Changed

- CI now does matrix tests with [Blueprint](https://github.com/ton-org/blueprint) and `npm`, `yarn`, `pnpm`, and `bun` package managers: PR [#848](https://github.com/tact-lang/tact/pull/848)

### Release contributors

- [Jesús Héctor Domínguez Sánchez](https://github.com/jeshecdom)
- [Novus Nota](https://github.com/novusnota)

## [1.5.0] - 2024-09-15

### Added

- The `exists` method for the `Map` type: PR [#581](https://github.com/tact-lang/tact/pull/581), PR [#938](https://github.com/tact-lang/tact/pull/938)
- The `storeBit` method for `Builder` type and the `loadBit` method for `Slice` type: PR [#699](https://github.com/tact-lang/tact/pull/699), PR [#936](https://github.com/tact-lang/tact/pull/936)
- The `toSlice` method for structs and messages: PR [#630](https://github.com/tact-lang/tact/pull/630), PR [#936](https://github.com/tact-lang/tact/pull/936)
- Wider range of serialization options for integers — `uint1` through `uint256` and `int1` through `int257`: PR [#558](https://github.com/tact-lang/tact/pull/558), PR [#937](https://github.com/tact-lang/tact/pull/937)
- The `deepEquals` method for the `Map` type: PR [#637](https://github.com/tact-lang/tact/pull/637), PR [#939](https://github.com/tact-lang/tact/pull/939)
- `asm` bodies for module-level functions: PR [#769](https://github.com/tact-lang/tact/pull/769), PR [#825](https://github.com/tact-lang/tact/pull/825)
- Corresponding stdlib functions for new TVM instructions from 2023.07 and 2024.04 upgrades: PR [#331](https://github.com/tact-lang/tact/pull/331), PR [#1062](https://github.com/tact-lang/tact/pull/1062). Added the `storeBuilder` extension function and `gasConsumed`, `getComputeFee`, `getStorageFee`, `getForwardFee`, `getSimpleComputeFee`, `getSimpleForwardFee`, `getOriginalFwdFee`, `myStorageDue` functions.
- `slice`, `rawSlice`, `ascii` and `crc32` built-in functions: PR [#787](https://github.com/tact-lang/tact/pull/787), PR [#799](https://github.com/tact-lang/tact/pull/799), PR [#951](https://github.com/tact-lang/tact/pull/951)
- `Builder.storeMaybeRef`, `parseStdAddress` and `parseVarAddress` stdlib functions: PR [#793](https://github.com/tact-lang/tact/pull/793), PR [#950](https://github.com/tact-lang/tact/pull/950)
- The compiler development guide: PR [#833](https://github.com/tact-lang/tact/pull/833)
- Constant evaluator now uses an interpreter: PR [#664](https://github.com/tact-lang/tact/pull/664). This allows calls to user-defined functions and references to declared global constants.

### Changed

- Allow omitting semicolons in contract/trait declarations and definitions: PR [#718](https://github.com/tact-lang/tact/pull/718)
- Compiler Tests are now using `@ton/sandbox` instead of `@tact-lang/emulator`: PR [#651](https://github.com/tact-lang/tact/pull/651)
- The minimal required Node.js version is bumped to 22: PR [#769](https://github.com/tact-lang/tact/pull/769)

### Fixed

- Traits can override inherited abstract functions: PR [#724](https://github.com/tact-lang/tact/pull/724)
- Fix code generation bug for maps from unsigned integers to Boolean values: PR [#725](https://github.com/tact-lang/tact/pull/725)
- Compiler failure when `toString` gets called as a static function and not a method: PR [#745](https://github.com/tact-lang/tact/pull/745)
- Tact AST keeps the original format of integer literals (hex/dec/oct/bin): PR [#771](https://github.com/tact-lang/tact/pull/771)
- Message opcodes are now checked if they fit into 32 bits: PR [#771](https://github.com/tact-lang/tact/pull/771)
- Disallow zero binary message opcodes as those are reserved for text messages: PR [#786](https://github.com/tact-lang/tact/pull/786)
- Return-statements in `init()` function do not cause FunC compilation error anymore: PR [#794](https://github.com/tact-lang/tact/pull/794)
- `emptyMap()` in equality comparison expressions does not cause code generation failures: PR [#814](https://github.com/tact-lang/tact/pull/814)
- Maps with `coins` as value type are now correctly handled in structs: PR [#821](https://github.com/tact-lang/tact/pull/821)
- Contract method calls in return statements: PR [#829](https://github.com/tact-lang/tact/pull/829)
- Disallow initializers for trait storage fields: PR [#831](https://github.com/tact-lang/tact/pull/831)
- Fix `dnsInternalNormalize()` in `@stdlib/dns` to throw on slices with references as expected: PR [#834](https://github.com/tact-lang/tact/pull/834)

### Release contributors

- [Jesús Héctor Domínguez Sánchez](https://github.com/jeshecdom)
- [Novus Nota](https://github.com/novusnota)
- [Daniil Sedov](https://github.com/Gusarich)
- [Anton Trunov](https://github.com/anton-trunov)

### Special thanks

- [Georgiy Komarov](https://github.com/jubnzv)

## [1.4.4] - 2024-08-18

### Added

- Initial version of the API providing AST equivalence check: PR [#689](https://github.com/tact-lang/tact/pull/689)

### Fixed

- Returning `self` from getters is now allowed: PR [#666](https://github.com/tact-lang/tact/pull/666)
- Remainder fields in the middle of a struct are now forbidden: PR [#697](https://github.com/tact-lang/tact/pull/697)
- Defining two native functions from the same FunC function now does not fail compilation: PR [#699](https://github.com/tact-lang/tact/pull/699)
- Map types are checked for well-formedness in all type ascriptions: PR [#704](https://github.com/tact-lang/tact/pull/704)

## [1.4.3] - 2024-08-16

### Fixed

- Parsing of optional nested struct fields does not cause the `Not a tuple` error anymore: PR [#692](https://github.com/tact-lang/tact/pull/692)
- Disallow shadowing of recursive function names: PR [#693](https://github.com/tact-lang/tact/pull/693)
- Better error message for the case when a constant shadows an stdlib identifier: PR [#694](https://github.com/tact-lang/tact/pull/694)

## [1.4.2] - 2024-08-13

### Changed

- Removed unsupported iterators API: PR [#633](https://github.com/tact-lang/tact/pull/633)
- Created a separate API function to enable compiler features: PR [#647](https://github.com/tact-lang/tact/pull/647)
- Use the `ILogger` interface to enable API users implement their own loggers: PR [#668](https://github.com/tact-lang/tact/pull/668)
- Use specific Internal or Compiler errors when throwing exceptions: PR [#669](https://github.com/tact-lang/tact/pull/669)

### Fixed

- FunC function identifiers with characters from hexadecimal set: PR [#636](https://github.com/tact-lang/tact/pull/636)
- Throw syntax error for module-level (top-level) constants with attributes: PR [#644](https://github.com/tact-lang/tact/pull/644)
- Typechecking for optional types when the argument type is not an equality type: PR [#650](https://github.com/tact-lang/tact/pull/650)
- Getters now return flattened types for structs as before: PR [#679](https://github.com/tact-lang/tact/pull/679)
- New bindings cannot shadow global constants: PR [#680](https://github.com/tact-lang/tact/pull/680)
- Disallow using assignment operators on constants: PR [#682](https://github.com/tact-lang/tact/pull/682)
- Fix code generation for some non-Lvalues that weren't turned into Lvalues by wrapping them in a function call: PR [#683](https://github.com/tact-lang/tact/pull/683)

## [1.4.1] - 2024-07-26

### Added

- `-e` / `--eval` CLI flags to evaluate constant Tact expressions: PR [#462](https://github.com/tact-lang/tact/pull/462)
- `-q` / `--quiet` CLI flags to suppress compiler log output: PR [#509](https://github.com/tact-lang/tact/pull/509)
- Markdown report for compiled contracts now includes Mermaid diagrams for trait inheritance and contract dependencies: PR [#560](https://github.com/tact-lang/tact/pull/560)
- Documentation comments to Zod schema of `tact.config.json` for descriptive hover pop-ups in editors: PR [#575](https://github.com/tact-lang/tact/pull/575)

### Changed

- Removed the `LValue` grammatical category and replaced it with `Expression`: PR [#479](https://github.com/tact-lang/tact/pull/479)
- Compilation results are placed into the source file directory when compiling without `tact.config.json` file: PR [#495](https://github.com/tact-lang/tact/pull/495)
- External receivers are enabled for single file compilation: PR [#495](https://github.com/tact-lang/tact/pull/495)
- `[DEBUG]` prefix was removed from debug prints because a similar prefix was already present: PR [#506](https://github.com/tact-lang/tact/pull/506)
- File paths in debug prints always use POSIX file paths (even on Windows): PR [#523](https://github.com/tact-lang/tact/pull/523)
- The IPFS ABI and supported interfaces getters are not generated by default; to generate those, set to `true` the two newly introduced per-project options in `tact.config.json`: `ipfsAbiGetter` and `interfacesGetter`: PR [#534](https://github.com/tact-lang/tact/pull/534)
- Values of `Slice` and `Builder` types are not converted to `Cell` in Typescript bindings anymore: PR [#562](https://github.com/tact-lang/tact/pull/562)
- Debug prints now include line content for better debugging experience: PR [#563](https://github.com/tact-lang/tact/pull/563)
- Error messages now suggest to add the `self` prefix if there is an attempt to access a missing variable when the contract storage has a variable with the same name: PR [#568](https://github.com/tact-lang/tact/pull/568)
- Error messages now suggest to add or remove parentheses if there is an attempt to access a missing field when there is a method with the same name (and vice versa): PR [#622](https://github.com/tact-lang/tact/pull/622)

### Fixed

- Name clashes with FunC keywords in struct constructor function parameters: PR [#467](https://github.com/tact-lang/tact/issues/467)
- Error messages for traversing non-path-expressions in `foreach`-loops : PR [#479](https://github.com/tact-lang/tact/pull/479)
- Shadowing of trait constants by contract storage variables: PR [#480](https://github.com/tact-lang/tact/pull/480)
- Parsing of non-decimal message opcodes: PR [#481](https://github.com/tact-lang/tact/pull/481)
- Detection of multiple receivers of the same message: PR [#491](https://github.com/tact-lang/tact/pull/491)
- Detection of non-unique message opcodes: PR [#493](https://github.com/tact-lang/tact/pull/493)
- Error messages for non-abstract constants in traits: PR [#483](https://github.com/tact-lang/tact/pull/483)
- All immediately inherited traits must be unique: PR [#500](https://github.com/tact-lang/tact/pull/500)
- Do not throw error when overriding abstract and virtual getters: PR [#503](https://github.com/tact-lang/tact/pull/503)
- Error message for non-existent storage variables: PR [#519](https://github.com/tact-lang/tact/issues/519)
- Error message for duplicate receiver definitions inherited from traits: PR [#519](https://github.com/tact-lang/tact/issues/519)
- Usage of `initOf` inside of `init()` does not cause error `135` anymore: PR [#521](https://github.com/tact-lang/tact/issues/521)
- Usage of `newAddress` with hash parts shorter than 64 hexadecimal digits does not cause constant evaluation error `Invalid address hash length` anymore: PR [#525](https://github.com/tact-lang/tact/pull/525)
- Introduced a streamlined error logger for compilation pipeline to support third-party tools: PR [#509](https://github.com/tact-lang/tact/pull/509)
- Collisions of PascalCase getter names in generated wrappers are now checked: PR [#556](https://github.com/tact-lang/tact/pull/556)
- Display a clearer error in case the source code file is missing when using the Tact CLI: PR [#561](https://github.com/tact-lang/tact/pull/561)
- Error messages for unicode code points outside of valid range: PR [#535](https://github.com/tact-lang/tact/pull/535)
- Correct regex for unicode code points and escaping of control codes in generated comments: PR [#535](https://github.com/tact-lang/tact/pull/535)
- Add `impure` specifier to some stdlib functions that are expected to throw errors: PR [#565](https://github.com/tact-lang/tact/pull/565)
- Defining non-existing native FunC functions now throws an understandable compilation error: PR [#585](https://github.com/tact-lang/tact/pull/585)
- Bump used `@tact-lang/opcode` version to `0.0.16` which fixes the issue with `DIV` instructions: PR [#589](https://github.com/tact-lang/tact/pull/589)
- Code generation for `recv_external` now correctly throws exit code `130` when processing an unexpected message: PR [#604](https://github.com/tact-lang/tact/pull/604)
- Allocator bug resulting in cell overflows for some contract data layouts: PR [#615](https://github.com/tact-lang/tact/pull/615)
- Structs with more than 15 fields do not cause a FunC compilation error anymore: PR [#590](https://github.com/tact-lang/tact/pull/590)
- Typechecking for constant and struct field initializers: PR [#621](https://github.com/tact-lang/tact/pull/621)
- Constant evaluation for structures with default and optional fields: PR [#621](https://github.com/tact-lang/tact/pull/621)
- Report error for self-referencing and mutually-recursive types: PR [#624](https://github.com/tact-lang/tact/pull/624)
- Error reporting for bounced receivers with missing parameter types: PR [#626](https://github.com/tact-lang/tact/pull/626)
- Allowed range of FunC function identifiers in `grammar.ohm`: PR [#628](https://github.com/tact-lang/tact/pull/628)

## [1.4.0] - 2024-06-21

### Added

- The bitwise NOT operation (`~`): PR [#337](https://github.com/tact-lang/tact/pull/337)
- Augmented assignment bitwise operators `|=`, `&=`, `^=`: PR [#350](https://github.com/tact-lang/tact/pull/350)
- Traversing maps from contract storage and structs is now allowed: PR [#389](https://github.com/tact-lang/tact/pull/389)
- The `loadBool` method for `Slice` type: PR [#412](https://github.com/tact-lang/tact/pull/412)
- CLI flag `--with-decompilation` to turn on decompilation of BoC files at the end of the compilation pipeline: PR [#417](https://github.com/tact-lang/tact/pull/417)
- Support more Tact expressions in the constant evaluator: conditional expressions, struct instances, struct field accesses, `emptyMap()`: PR [#432](https://github.com/tact-lang/tact/pull/432) and PR [#445](https://github.com/tact-lang/tact/pull/445)
- The `fromCell` and `fromSlice` methods for struct and message parsing: PR [#418](https://github.com/tact-lang/tact/pull/418) and PR [#454](https://github.com/tact-lang/tact/pull/454)
- The `return`-statement reachability analysis now takes into account the `throw` and `nativeThrow` functions: PR [#447](https://github.com/tact-lang/tact/pull/447)

### Changed

- Trailing semicolons in struct and message declarations are optional now: PR [#395](https://github.com/tact-lang/tact/pull/395)
- Tests are refactored and renamed to convey the sense of what is being tested and to reduce the amount of merge conflicts during development: PR [#402](https://github.com/tact-lang/tact/pull/402)
- `let`-statements can now be used without an explicit type declaration and determine the type automatically if it was not specified: PR [#198](https://github.com/tact-lang/tact/pull/198) and PR [#438](https://github.com/tact-lang/tact/pull/438)
- The outdated TextMate-style grammar files for text editors have been removed (the most recent grammar files can be found in the [tact-sublime](https://github.com/tact-lang/tact-sublime) repo): PR [#404](https://github.com/tact-lang/tact/pull/404)
- The JSON schema for `tact.config.json` has been moved to the `schemas` project folder: PR [#404](https://github.com/tact-lang/tact/pull/404)
- Allow underscores as unused variable identifiers: PR [#338](https://github.com/tact-lang/tact/pull/338)
- The default compilation mode does not decompile BoC files anymore, to additionally perform decompilation at the end of the pipeline, set the `fullWithDecompilation` mode in the `mode` project properties of `tact.config.json`: PR [#417](https://github.com/tact-lang/tact/pull/417)
- Trait lists, parameters and arguments in the Tact grammar were assigned their own names in the grammar for better readability and code deduplication: PR [#422](https://github.com/tact-lang/tact/pull/422)
- The semicolon (`;`) terminating a statement is optional if the statement is the last one in the statement block: PR [#434](https://github.com/tact-lang/tact/pull/434)

### Fixed

- Return type of `skipBits` now matches FunC and does not lead to compilation errors: PR [#388](https://github.com/tact-lang/tact/pull/388)
- Typechecking of conditional expressions when one branch's type is a subtype of another, i.e. for optionals and maps/`null`: PR [#394](https://github.com/tact-lang/tact/pull/394)
- Typechecking of conditional expressions when the types of their branches can be generalized, i.e. for non-optionals and `null` can be inferred an optional type: PR [#429](https://github.com/tact-lang/tact/pull/429)
- External fallback receivers now work properly: PR [#408](https://github.com/tact-lang/tact/pull/408)
- `Int as coins` as a value type of a map in persistent storage does not throw compilation error anymore: PR [#413](https://github.com/tact-lang/tact/pull/413)
- The semantics of the Tact arithmetic operations in the constant evaluator to perform rounding towards negative infinity: PR [#432](https://github.com/tact-lang/tact/pull/432)
- Better error messages for the `void` type: PR [#442](https://github.com/tact-lang/tact/pull/442)
- Fixed the native function binding for the stdlib function `nativeThrowWhen` (it needed to be `throw_if` instead of `throw_when`) and also renamed it to `nativeThrowIf` for consistency with FunC: PR [#451](https://github.com/tact-lang/tact/pull/451)

## [1.3.1] - 2024-06-08

### Added

- Tests for recursive functions: PR [#359](https://github.com/tact-lang/tact/pull/359)
- API for AST traversal: PR [#368](https://github.com/tact-lang/tact/pull/368)
- Spell checking for the whole code base: PR [#372](https://github.com/tact-lang/tact/pull/372)

### Changed

- GitHub actions updated to use Node.js 20: PR [#360](https://github.com/tact-lang/tact/pull/360)
- Refactor AST types to simplify access to third-party tools: PR [#325](https://github.com/tact-lang/tact/pull/325)
- Refactor the compiler API used to access AST store: PR [#326](https://github.com/tact-lang/tact/pull/326)
- Update JSON Schema to inform about usage in Blueprint: PR [#330](https://github.com/tact-lang/tact/pull/330)
- All identifiers in error messages are now quoted for consistency: PR [#363](https://github.com/tact-lang/tact/pull/363)
- The Tact grammar has been refactored for better readability: PR [#365](https://github.com/tact-lang/tact/pull/365)
- Error messages now use relative file paths: PR [#456](https://github.com/tact-lang/tact/pull/456)
- Comparison between `null` and non-optionals now throws a compilation error: PR [#571](https://github.com/tact-lang/tact/pull/571)

### Fixed

- The `log2` and `log` math functions were adjusted for consistency in error throwing: PR [#342](https://github.com/tact-lang/tact/pull/342)
- Shadowing built-in static functions is now forbidden: PR [#351](https://github.com/tact-lang/tact/pull/351)
- Augmented assignment now throws compilation error for non-integer types: PR [#356](https://github.com/tact-lang/tact/pull/356)
- Built-in function `address()` now handles parse errors correctly: PR [#357](https://github.com/tact-lang/tact/pull/357)
- The grammar of the unary operators has been fixed, constant and function declarations are prohibited for contracts and at the top level of Tact modules: PR [#365](https://github.com/tact-lang/tact/pull/365)
- Typos in ABI generation: PR [#372](https://github.com/tact-lang/tact/pull/372)
- `__tact_load_address_opt` code generation: PR [#373](https://github.com/tact-lang/tact/pull/373)
- Empty messages are now correctly converted into cells: PR [#380](https://github.com/tact-lang/tact/pull/380)
- All integer and boolean expressions are now being attempted to be evaluated as constants. Additionally, compile-time errors are thrown for errors encountered during the evaluation of actual constants: PR [#352](https://github.com/tact-lang/tact/pull/352)
- Chaining mutable extension functions now does not throw compilation errors: PR [#384](https://github.com/tact-lang/tact/pull/384)
- Removed unused `ton-compiler` dependency: PR [#452](https://github.com/tact-lang/tact/pull/452)

## [1.3.0] - 2024-05-03

### Added

- `log2` and `log` math functions in `@stdlib/math`: PR [#166](https://github.com/tact-lang/tact/pull/166)
- Reserve mode constants in `@stdlib/reserve`, namely `ReserveExact`, `ReserveAllExcept`, `ReserveAtMost`, `ReserveAddOriginalBalance`, `ReserveInvertSign`, `ReserveBounceIfActionFail`: PR [#173](https://github.com/tact-lang/tact/pull/173)
- Support for string escape sequences (`\\`, `\"`, `\n`, `\r`, `\t`, `\v`, `\b`, `\f`, `\u{0}` through `\u{FFFFFF}`, `\u0000` through `\uFFFF`, `\x00` through `\xFF`): PR [#192](https://github.com/tact-lang/tact/pull/192)
- JSON Schema for `tact.config.json`: PR [#194](https://github.com/tact-lang/tact/pull/194)
- Struct fields punning, i.e. `{foo, bar}` is syntactic sugar for `{ foo: foo, bar: bar }`: PR [#272](https://github.com/tact-lang/tact/pull/272)
- The ability to use `dump` function on the values of the `Address` type: PR [#175](https://github.com/tact-lang/tact/pull/175)
- The non-modifying `StringBuilder`'s `concat` extension function for chained string concatenations: PR [#217](https://github.com/tact-lang/tact/pull/217)
- The `toString` extension function for `Address` type: PR [#224](https://github.com/tact-lang/tact/pull/224)
- The bitwise XOR operation (`^`): PR [#238](https://github.com/tact-lang/tact/pull/238)
- The `isEmpty` extension function for the `Map` type: PR [#266](https://github.com/tact-lang/tact/pull/266)
- The `pow2` power function with base 2: PR [#267](https://github.com/tact-lang/tact/pull/267)
- The `try` and `try-catch` statements: PR [#212](https://github.com/tact-lang/tact/pull/212)
- The `del` method for the `Map` type: PR [#95](https://github.com/tact-lang/tact/pull/95)
- The `-h`/`--help`, `-v` (short for `--version`), `-p` (short for `--project`), `--func` (for only outputting FunC code) and `--check` (for only doing the syntax and type checking) command-line flags: PR [#287](https://github.com/tact-lang/tact/pull/287)
- The `mode` enum in project properties of `tact.config.json` for specifying compilation mode: `full` (default), `funcOnly` (only outputs FunC code and exits), or `checkOnly` (only does the syntax and type checking, then exits): PR [#287](https://github.com/tact-lang/tact/pull/287)
- The `foreach` loop for the `Map` type: PR [#106](https://github.com/tact-lang/tact/pull/106)

### Changed

- The implicit empty `init` function is now present by default in the contract if not declared: PR [#167](https://github.com/tact-lang/tact/pull/167)
- Support trailing commas in all comma-separated lists (struct instantiations, `initOf` arguments, `init()` parameters, inherited traits via `with`, function arguments and parameters): PR [#179](https://github.com/tact-lang/tact/pull/179) and PR [#246](https://github.com/tact-lang/tact/pull/246)
- `@stdlib/stoppable` now imports `@stdlib/ownable` so the programmer does not have to do it separately: PR [#193](https://github.com/tact-lang/tact/pull/193)
- The `newAddress` function now evaluates to a constant value if possible: PR [#237](https://github.com/tact-lang/tact/pull/237)
- The `pow` power function could only be used at compile-time, but now it is available in the standard library and can be called both at runtime and compile-time: PR [#267](https://github.com/tact-lang/tact/pull/267)
- The `dump()` and `dumpStack()` functions now print the file path, line number, and column number in addition to the data: PR [#271](https://github.com/tact-lang/tact/pull/271)
- Use `|` instead of `+` for send mode flags because the bitwise OR operation is idempotent and hence safer: PR [#274](https://github.com/tact-lang/tact/pull/274)
- Bumped the versions of `@ton/core` and `ohm-js` to the most recent ones: PR [#276](https://github.com/tact-lang/tact/pull/276)
- Generated `.pkg`-files always use POSIX file paths (even on Windows): PR [# 300](https://github.com/tact-lang/tact/pull/300)
- The `-p`/`--project` flags now allow specifying more than one project name. Additionally, they also require a `--config` flag to be specified: PR [#287](https://github.com/tact-lang/tact/pull/287)
- Command-line interface now allows compiling a single Tact file directly, without specifying a config: PR [#287](https://github.com/tact-lang/tact/pull/287)

### Fixed

- Escape backticks in error messages for generated TypeScript code: PR [#192](https://github.com/tact-lang/tact/pull/192)
- Integer overflows during compile-time constant evaluation are properly propagated as a compilation error: PR [#200](https://github.com/tact-lang/tact/pull/200)
- Incorrect "already exists" errors when using the `toString` and `valueOf` identifiers: PR [#208](https://github.com/tact-lang/tact/pull/208)
- Empty inherited trait lists after `with` keyword are now disallowed: PR [#246](https://github.com/tact-lang/tact/pull/246)
- Allow chaining method calls with `!!`, for instance, `map.asCell()!!.hash()` is grammatically correct now: PR [#257](https://github.com/tact-lang/tact/pull/257)
- Precedence levels for bitwise operators, equality and comparisons now matches common languages, like JavaScript: PR [#265](https://github.com/tact-lang/tact/pull/265)
- Incorrect variable scoping in the `repeat`, `while` and `until` loops: PR [#269](https://github.com/tact-lang/tact/pull/269)
- FunC compilation errors when trying to `dump()` values of the `Cell`, `Slice`, `Builder` and `StringBuilder` types: PR [#271](https://github.com/tact-lang/tact/pull/271)
- Tact's CLI returns a non-zero exit code if compilation fails: PR [#278](https://github.com/tact-lang/tact/pull/278)
- Use the most recent version of the FunC standard library [`stdlib.fc`](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/crypto/smartcont/stdlib.fc): PR [#283](https://github.com/tact-lang/tact/pull/283)
- The WASM version of the FunC compiler has been updated to 0.4.4 and patched to work on larger contracts: PR [#297](https://github.com/tact-lang/tact/pull/297)
- The `return`-statement reachability analysis: PR [#302](https://github.com/tact-lang/tact/pull/302)

## [1.2.0] - 2024-02-29

### Added

- Augmented assignment operators (`+=`, `-=`, `*=`, `/=` and `%=`): PR [#87](https://github.com/tact-lang/tact/pull/87)
- Binary and octal literals with underscores as numerical separators: PR [#99](https://github.com/tact-lang/tact/pull/99)
- Ternary conditional operator (`condition ? then : else`): PR [#97](https://github.com/tact-lang/tact/pull/97)
- The `--version` command-line flag for the Tact executable: PR [#137](https://github.com/tact-lang/tact/pull/137)
- The `SendBounceIfActionFail` send mode constant to the standard library: PR [#122](https://github.com/tact-lang/tact/pull/122)

### Changed

- Decimal and hexadecimal literals now allow underscores as numerical separators: PR [#99](https://github.com/tact-lang/tact/pull/99)
- The equality and non-equality operators (`==` and `!=`) now support slices and strings by comparing the hashes of the left-hand and right-hand sides : PR [#105](https://github.com/tact-lang/tact/pull/105)
- Continuous integration now tests the dev [tact-template](https://github.com/tact-lang/tact-template)'s version with the dev version of Tact: PR [#111](https://github.com/tact-lang/tact/pull/111)
- Continuous integration now tests the latest [Blueprint](https://github.com/ton-org/blueprint)'s version with the dev version of Tact: PR [#152](https://github.com/tact-lang/tact/pull/152)
- Continuous integration now checks there are no ESLint warnings: PR [#157](https://github.com/tact-lang/tact/pull/157)

### Fixed

- Relative imports from parent directories: PR [#125](https://github.com/tact-lang/tact/pull/125)
- The typechecker failed to identify different types when using the `==` and `!=` operators: PR [#127](https://github.com/tact-lang/tact/pull/127)
- ESLint warnings for the whole Tact codebase: PR [#157](https://github.com/tact-lang/tact/pull/157)
- The versions of some vulnerable dependencies were bumped in `package.json` and `yarn.lock`: PR [#158](https://github.com/tact-lang/tact/pull/158) and PR [#160](https://github.com/tact-lang/tact/pull/160)

## [1.1.5] - 2023-12-01

### Added

- Continuous integration to run Tact tests on Linux, macOS and Windows: PR [#96](https://github.com/tact-lang/tact/pull/96)

### Changed

- Migration to `@ton` NPM packages: PR [#89](https://github.com/tact-lang/tact/pull/89)

### Fixed

- Struct and message identifiers need to be capitalized: PRs [#81](https://github.com/tact-lang/tact/pull/81) and [#83](https://github.com/tact-lang/tact/pull/83)
- Fixed the signature of the `checkDataSignature` function in `stdlib/std/crypto.tact`: PR [#50](https://github.com/tact-lang/tact/pull/50)
- Show location info for the internal compiler error 'Invalid types for binary operation': PR [#63](https://github.com/tact-lang/tact/pull/63)

## [1.1.4] - 2023-09-27

### Changed

- Hacked paths to support builds on Windows

## [1.1.3] - 2023-06-27

### Added

- bitwise and and or operations
- statically compile expressions with bitwise operations if possible

## [1.1.2] - 2023-04-27

### Added

- Add full ABI in bindings

## [1.1.1] - 2023-04-20

### Fixed

- Fix typescript bindings generation for custom key and value serialization formats
- Fix missing external messages in bindings

## [1.1.0] - 2023-04-19

### ⚡️ Breaking changes

- `reply` is now a method of `Contract` instead of global context and changed it's behavior if storage reserve is non-zero in contract.
- Logical expressions are now calculated differently: `&&` now does not execute right expression if left is `false` and `||` does not execute right expression if left is `true`. Before it was executed in any case. This change is made in attempt to reduce unexpected behavior.
- `OwnableTransferable` is now sends response to the sender.
- `overwrites` was renamed to `override`
- `Deployable` trait now sends non-bounceable notifications instead of bounceable ones.

### Features

- `Address` to `Address` maps
- Ability to define key and value serializations for maps
- `sha256` hashing
- `forward` and `notify` functions that can be used to send messages to other contracts using remaining value of incoming message
- `virtual` and `abstract` constants that can be shared between traits
- `storageReserve` constant in every contract that can be used to reserve some storage space by any trait
- `abstract` functions that can be implemented in contracts
- `FactoryDeployable` trait for deploying from factory contract
- `@stdlib/dns` for easier DNS resolution
- Opt-in `external` message support
- Typed `bounce` receiver and `bounce<T>` type modifier
- `commit` for committing state changes
- `inline` modifier for functions for inlining them into the caller
- Ability to define empty messages (but not structs)
- Some string-related operations are now computed at compile time if possible

### Fixed

- Signature of `preloadBits` function
- Fixed `readForwardFee` function

## [1.1.0-beta.28] - 2023-04-19

### Fixed

- Fix `func` invocation

## [1.1.0-beta.27] - 2023-04-14

### Fixed

- Remove tact-bindings binary reference

## [1.1.0-beta.26] - 2023-04-14

### Added

- Ability to define empty messages (but not structs)

## [1.1.0-beta.25] - 2023-04-14

### Added

- Support for bounced receivers for message structs

## [1.1.0-beta.24] - 2023-04-13

### Changed

- Bounced messages now skipped first 32 bits before passing it to receivers

### Fixed

- Passing optional structs as arguments

## [1.1.0-beta.23] - 2023-04-13

### Changed

- deploy trait now sends non-bounceable notifications
- changed `forward` and added bounceable and init arguments

### Added

- `Contract.notify()` non-bounceable alternative to reply

## [1.1.0-beta.22] - 2023-04-13

### Added

- `commit` function to commit state changes

## [1.1.0-beta.21] - 2023-04-13

### Fixed

- Work-around func `0.4.3` bug with pragma processing
- Fix external messages with arguments type checking

## [1.1.0-beta.20] - 2023-04-11

### Changed

- Upgrade `func` to `0.4.3`

## [1.1.0-beta.19] - 2023-04-10

### Fixed

- Fix bouncing unknown messages

## [1.1.0-beta.18] - 2023-04-10

### Added

- `FactoryDeployable` trait for deploying from factory contract

## [1.1.0-beta.17] - 2023-04-10

### Added

- Abstract functions
- Abstract and virtual constants in traits

### Changed

- Rename `overrides` to `override`
- Updated ownership transferring methods

### Removed

- Unused `public` modifier

## [1.1.0-beta.16] - 2023-04-09

### Changed

- `reply` now in contract instead of global context

## [1.1.0-beta.15] - 2023-04-09

### Added

- `asCell` to maps

## [1.1.0-beta.14] - 2023-04-09

### Fixed

- Fix `dnsResolveWallet` compilation error

## [1.1.0-beta.13] - 2023-04-09

### Added

- `dns` library
- map key and value serialization formats

## [1.1.0-beta.12] - 2023-04-08

### Fixed

- Upgrade decompiler to a `@tact-lang/opcodes@0.0.13`

## [1.1.0-beta.11] - 2023-04-08

### Fixed

- Signature of `preloadBits` function

## [1.1.0-beta.10] - 2023-04-08

### Added

- `sha256` function to compute sha256 hash of a text or byte string

## [1.1.0-beta.9] - 2023-04-02

### Added

- Opt-in external messages support

## [1.1.0-beta.8] - 2023-04-02

### Fixed

- Missing implementation of `Address` to `Address` maps

## [1.1.0-beta.7] - 2023-03-28

### Added

- `inline` modifier for functions to inline them into the caller

### Fixed

- Fix missing `method_id` in `get_abi_ipfs` and `lazy_deployment_completed`

## [1.1.0-beta.6] - 2023-03-27

### Changed

- Optimization of gas usage of low level primitives

## [1.1.0-beta.5] - 2023-03-25

### Changed

- Optimization of `String.asComment()` that tries to compute it compile time if possible

## [1.1.0-beta.4] - 2023-03-23

### Added

- Ability to compare cells

### Fixed

- Fixed contract crash when equality check involving nullable variables

### Changed

- Change logic of `&&` and `||`. Now second argument is not calculated when first argument is `false` or `true` respectively.

## [1.1.0-beta.3] - 2023-03-22

### Added

- `emit` function to emit events

### Fixed

- Fixed possible inconsistent behavior when calling mutating get methods from inside of the contract
- Fixed regression of order of functions in generated files

## [1.1.0-beta.2] - 2023-03-22

### Changed

- Tact now emits func in multiple files, optimized not only for blockchain, but also for human

## [1.1.0-beta.1] - 2023-03-20

### Fixed

- Some functions for deep structures with optionals not emitted
- Crash in bindings generator on boolean value in dictionary

## [1.1.0-beta.0] - 2023-03-14

### Fixed

- `overwrites` -> `override`
- Invalid `check` function error generation
- Error message for `address(0)`

## [1.0.0] - 2023-03-08

### Added

- `sender()` function to get message sender address

## [1.0.0-rc.13] - 2023-03-08

### Changed

- Upgrade `func` to `0.4.2`

### Fixed

- Windows paths support

## [1.0.0-rc.12] - 2023-03-03

### Fixed

- `pow` is now compile-only function

### Changed

- Use new FunC wasm bundle

## [1.0.0-rc.11] - 2023-03-02

### Added

- exported `check` function for language server support

## [1.0.0-rc.10] - 2023-03-02

### Changed

- Contracts now can be deployed only to the basic workchain unless `masterchain` set `true`
- Checking field initialization in init function

## [1.0.0-rc.9] - 2023-03-01

### Changed

- Contracts now work only with basic workchain. To enable masterchain support set `masterchain: true` in `tact.conf.json`

### Added

- `pow` function for exponentiation
- `address()` compile-time function for creating addresses from strings
- `cell()` compile-time function for creating cells from base64 strings
- `interfaces` field to ABI
- report workchain support in interfaces

## [1.0.0-rc.8] - 2023-02-27

### Added

- `logger` interface to programmatic API

## [1.0.0-rc.7] - 2023-02-27

### Added

- `verify` function to verify compiled package

## [1.0.0-rc.6] - 2023-02-26

### Fixed

- Fixing npm exports

## [1.0.0-rc.5] - 2023-02-26

### Fixed

- Fixing npm exports for typescript

## [1.0.0-rc.4] - 2023-02-26

### Fixed

- Fixing npm exports for typescript

## [1.0.0-rc.3] - 2023-02-26

### Fixed

- Fixed browser/node typings and exports
- Fixed browser environment execution

## [1.0.0-rc.2] - 2023-02-26

### Fixed

- Fixed missing `mkdirp` dependency

## [1.0.0-rc.1] - 2023-02-26

### Fixed

- Fixed cli command

## [1.0.0-rc.0] - 2023-02-26

### Added

- `@ton-lang/compiler/node` to invoke compiler from node similar how cli works
- `@ton-lang/compiler/browser` to invoke compiler from browser

### Removed

- Removed jetton library from stdlib. It would be re-introduced after 1.0 version with more thought put into it.

## [0.10.1] - 2023-02-23

### Added

- Display line and column numbers in error messages to be able to navigate to the error in the editor

### Fixed

- Execution order of struct and message fields
- `initOf` argument type checks

## [0.10.0] - 2023-02-23

### Changed

- Tact contracts are now [Argument-addressable](https://docs.tact-lang.org/ref/evolution/otp-005) meaning that they depend on init arguments and code hash only. Init function is now called when first valid message is received.
- Refactoring of allocator
- Moving contract's load function to the beginning of the execution
- Moving contract's save function to the end of the execution
- moving `debug` flag from `experimental` to `parameters` in `tact.config.json`
- Unknown fields in config are now considered an error
- Allow contracts without fields
- Typescript bindings are now working in browser and doesn't have `ton-emulator` dependency
- `map` syntax now uses `<>` instead of `[]` for future compatibility with generics

### Added

- Allow `Builder` type as a field type similar to `Cell` and `Slice`
- Allow `String` type as a field type

## [0.9.3] - 2023-02-19

### Added

- Error codes in reports
- Client-friendly typescript bindings

### Changed

- Change repository locations

## [0.9.2] - 2023-02-05

### Added

- `emptyMap()` for creating empty maps
- Allowing assigning `null` value to a map variable (same as calling `emptyMap()`)

## [0.9.1] - 2023-02-03

### Changed

- Update `dump` function to handle booleans and strings, better type checking or arguments
- Report `org.ton.debug.v0` interface if debug mode is enabled
- Update bindings generator to support `ton-emulator >= v2.1.0`

## [0.9.0] - 2023-02-02

### Added

- Importing `func` files

### Changed

- Upgrade `func` to `0.4.1`
- Enforce `func` version in generated files
- Enable critical pragmas by default
- Enable inlining in a lot of places thanks to fixed crashes in `func`

## [0.8.11] - 2023-01-28

### Fixed

- Optional `Address` fields in typescript bindings

### Added

- `Address.asSlice` for manual address parsing
- `@stdlib/content` library with `createOffchainContent` functions

### [0.8.10] - 2023-01-27

## Fixed

- `>>` and `<<` operations
- Type checking of struct constructors

## [0.8.9] - 2023-01-25

### Fixed

- Fix missing func compiler in distributive

## [0.8.8] - 2023-01-25

### Added

- TextMate Grammar for syntax highlighting

### Changed

- Embed `func` compiler to package
- Better builder types
- Moved docs to `ton-docs` repository

## [0.8.7] - 2023-01-13

### Added

- `beginTailString` and `beginStringFromBuilder` for starting a `StringBuilder`
- `Slice.asString` for converting slice to a `String` (without checks of contents)

## [0.8.6] - 2023-01-10

### Fixed

- Fixing passing non-nullable type as second argument to map's `set` operation

### Changed

- New `2022.v12` func compiler

## [0.8.5] - 2023-01-09

### Changed

- Improve gas usage in `storeBool`

## [0.8.4] - 2023-01-09

### Added

-`newAddress` function to create a new address from chain and hash -`getConfigParam` to get system configuration

## [0.8.3] - 2023-01-09

### Fixed

- Deep contract dependencies

## [0.8.2] - 2023-01-08

### Added

- `loadAddress` in `Slice`

## [0.8.1] - 2023-01-07

Fixing missing NPM release

## [0.8.0] - 2023-01-07

### Changed

- Changed message id algorithm to the one based on type signatures instead of tlb

### Added

- Dictionaries in typescript bindings
- Introduced packaging compilation step that packages a contract to a single package that can be deployed in predictable way.
- `tact-bindings` to build bindings to non-tact contracts

## [0.7.1] - 2023-01-04

### Fixed

- Assignability type checks

## [0.7.0] - 2023-01-04

### Added

- `toCell` to all structs and messages
- restored disassembler as part of a compilation flow
- `typescript` bindings parser of structs and messages

### Removed

- `abi.pack_cell` and `abi.pack_slice`

### Changed

- Updated codegen to prefix function names with a `$` to avoid clashing with system functions
- `random` and `randomInt` that are correctly initialized on first use unlike native one
- Changed the way get and init methods expect their arguments and return values to match func-like primitives

### Fixed

- non-nullable value could break the nullable variable memory representation

## [0.6.0] - 2023-01-03

### Changed

- Large bindings generator refactoring to match new `ton-core` and `ton-emulator` packages

### Added

- `Deployable` trait in `@stdlib/deploy`

## [0.5.0] - 2022-12-23

### Added

- Constants in contracts
- Global constants
- Added `SendRemainingBalance`, `SendRemainingValue`, `SendIgnoreErrors`, `SendPayGasSeparately`, `SendDestroyIfZero` constants in stdlib
- Added `emptyCell` and `emptySlice` helpers
- Added jettons example

### Changed

- `require` now accepts two arguments, second one must be a string literal that has error message. This error message then will be exported to ABI
- Optional `Address` fields are not encoded using native representation

## [0.4.0] - 2022-12-22

### Changed

- Renamed Map's `get2` to `get` and removing `get` from keywords list.

### Fixed

- Fixed missing call arguments verification

## [0.3.0] - 2022-12-22

### Added

- `String` literals and variables
- `Int.toString()` and `Int.toFloatString()`
- `StringBuilder` for gas-efficient string building
- Global compile-time `ton` function that converts string to Int during compile time.
- `checkDataSignature` similar to func `check_data_signature`
- `String.asComment` for conversion text to a comment payload
- `Resumable` trait, allows to resume contract operations once it was stopped
- Comment receiver that allows to receive arbitrary comment
- `String.asSlice` cast string to a slice for parsing
- Binary shift operators `>>` and `<<`
- `Slice.fromBase64` that converts text slice that has base64 to binary representation (both classic and url)
- `Slice.asCell`, `Builder.asCell`, `Cell.asSlice`, `Builder.asCell` convenience functions
- `Slice.loadCoins` that reads coins from slice
- `myBalance` that returns current balance of a contract before execution phase

### Changed

- `contractAddress` now accepts single argument of type `StateInit` and always produces address for workchain. Old method is renamed to `contractAddressExt`.
- `hashCell` and `hashSlice` are now extension function `hash` on `Slice` and `Cell`
- Removed some keywords such as `message`, `contract`, `init` to allow use this names as variable names
- Renamed `receiveBounced` to `bounced`

### Fixed

- Fixing importing tact with providing extension, now `import "./lib";` and `import "./lib.tact";` are equivalent.
- Fixing extension function generation
- Fixing clashing of variable names with func primitives and global functions
- Fix fallback and bounce argument type resolving
- Fixed `loadUint`/`preloadUint`
- Fixed invalid generation of `>=` and `>` operators

## [0.2.0]

### Added

- `supported_interfaces` TEP support. TACT now automatically builds a list of supported interfaces of a contract
- `IPFS`-based ABI reporting. TACT now automatically calculates and embeds ABI hash into smart contract and prepares a file to upload to IPFS.
