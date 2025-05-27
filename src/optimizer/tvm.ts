/**********************************************************************
 * run-fift.ts
 * -----------
 * 1. Instantiates the wasm module (factory pattern)
 * 2. Copies the TON Fift std-lib into the in-memory FS
 * 3. Calls the real C `main(argc,argv)`
 * 4. Prints whatever the interpreter printed
 *
 *   $ npx ts-node run-fift.ts
 *********************************************************************/

import * as fs from "node:fs";
import * as path from "node:path";

/* ------------------------------------------------------------------ *
 *  0.  Types we actually touch
 * ------------------------------------------------------------------ */

interface EmscriptenModule {
    /** factory-supplied promise hook */
    onRuntimeInitialized: () => void;

    /* --- basic libc helpers we need --------------------------------- */
    _main(argc: number, argvPtr: number): number;
    _malloc(size: number): number;
    lengthBytesUTF8(str: string): number;
    stringToUTF8(str: string, ptr: number, maxBytes: number): void;
    setValue(ptr: number, val: number, ty: "i32"): void;

    /* --- virtual file-system (MEMFS) -------------------------------- */
    FS: {
        mkdir: (p: string) => void;
        writeFile: (p: string, data: Uint8Array | string) => void;
    };
}

/* ------------------------------------------------------------------ *
 *  1.  Bring the wrapper in — it is a **factory function** ----------
 * ------------------------------------------------------------------ */

const createFiftModule: () => Promise<EmscriptenModule> =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../func/fift.js");

/* ------------------------------------------------------------------ *
 *  2.  Helper – C-string allocation ---------------------------------
 * ------------------------------------------------------------------ */
function toCString(mod: EmscriptenModule, text: string): number {
    const n = mod.lengthBytesUTF8(text) + 1;
    const p = mod._malloc(n);
    mod.stringToUTF8(text, p, n);
    return p;
}

/* ------------------------------------------------------------------ *
 *  3.  Main
 * ------------------------------------------------------------------ */
async function main(): Promise<void> {
    /* capture everything the interpreter prints */
    const consoleBuf: string[] = [];

    const Module = await createFiftModule();

    /* pick up stdout/stderr */
    (Module as any).print = (x: string) => {
        consoleBuf.push(x);
    };
    (Module as any).printErr = (x: string) => {
        consoleBuf.push(x);
    };

    Module.onRuntimeInitialized = () => {
        try {
            /**************** 3.1  Populate MEMFS with std-lib *************/
            const hostLibDir = path.resolve(__dirname, "../func/fift/lib");
            const memLibDir = "/fift/lib";

            Module.FS.mkdir("/fift");
            Module.FS.mkdir(memLibDir);

            for (const entry of fs.readdirSync(hostLibDir)) {
                const full = path.join(hostLibDir, entry);
                if (fs.statSync(full).isFile()) {
                    Module.FS.writeFile(
                        path.posix.join(memLibDir, entry),
                        fs.readFileSync(full),
                    );
                }
            }

            /* Fift itself also looks for   Fift.fif   (standard preamble)  */
            Module.FS.writeFile(
                "/Fift.fif",
                fs.readFileSync(path.resolve(__dirname, "../func/Fift.fif")),
            );

            /**************** 3.2  The user script *************************/
            const userScript = "/work/script.fif";
            Module.FS.mkdir("/work");
            Module.FS.writeFile(
                userScript,
                `B{  10 20 + .  }`, // <-- replace with whatever you like
            );

            /**************** 3.3  Build argv & call _main *****************/
            const argv = ["fift", "-I", "/fift/lib", userScript];
            const argc = argv.length;

            const argvPtrs = argv.map((a) => toCString(Module, a));
            const argvMem = Module._malloc((argc + 1) * 4);
            argvPtrs.forEach((p, i) =>
                Module.setValue(argvMem + i * 4, p, "i32"),
            );
            Module.setValue(argvMem + argc * 4, 0, "i32"); // NULL

            const code = Module._main(argc, argvMem);
            consoleBuf.push(`[exit code = ${code}]`);

            /**************** 3.4  Show everything ************************/
            console.log(consoleBuf.join("\n"));
        } catch (e) {
            console.error("[Fift wasm runner] fatal:", e);
        }
    };
}

main().catch((err) => {
    console.error(err);
});
