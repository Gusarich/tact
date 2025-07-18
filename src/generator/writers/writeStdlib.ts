import { contractErrors } from "@/abi/errors";
import { maxTupleSize } from "@/bindings/typescript/writeStruct";
import { match } from "@/utils/tricks";
import type { WriterContext } from "@/generator/Writer";
import { ops } from "@/generator/writers/ops";

export function writeStdlib(ctx: WriterContext): void {
    //
    // stdlib extension functions
    //

    ctx.fun("__tact_sha256", () => {
        ctx.signature(`int __tact_sha256(slice data)`);
        ctx.context("stdlib");
        ctx.asm(
            "",
            `
            <{
                <{ DUP SREFS }> PUSHCONT
                <{ LDREFRTOS }> PUSHCONT
                WHILE
                DEPTH
                HASHEXT_SHA256
            }> PUSHCONT
            1 1 CALLXARGS
        `,
        );
    });

    //
    // Addresses
    //

    ctx.fun("__tact_load_address_opt", () => {
        ctx.signature(`(slice, slice) __tact_load_address_opt(slice cs)`);
        ctx.context("stdlib");
        ctx.asm(
            "",
            `
            b{00} SDBEGINSQ
            IF:<{
              PUSHNULL
            }>ELSE<{
              LDMSGADDR
              SWAP
            }>
        `,
        );
    });

    ctx.fun("__tact_store_addr_none", () => {
        ctx.signature(`builder __tact_store_addr_none(builder b)`);
        ctx.context("stdlib");
        ctx.asm("", "b{00} STSLICECONST", true);
    });

    ctx.fun("__tact_store_address_opt", () => {
        ctx.signature(
            `builder __tact_store_address_opt(slice address, builder b)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(address)) {
                    return ${ctx.used("__tact_store_addr_none")}(b);
                } else {
                    return b.store_slice(address);
                }
            `);
        });
    });

    ctx.fun("__tact_not_null", () => {
        ctx.signature(`forall X -> X __tact_not_null(X x)`);
        ctx.flag("impure");
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(
                `throw_if(${contractErrors.null.id}, null?(x)); return x;`,
            );
        });
    });

    ctx.fun("__tact_dict_delete", () => {
        ctx.signature(
            `(cell, int) __tact_dict_delete(cell dict, int key_len, slice index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTDEL");
    });

    ctx.fun("__tact_dict_delete_int", () => {
        ctx.signature(
            `(cell, int) __tact_dict_delete_int(cell dict, int key_len, int index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTIDEL");
    });

    ctx.fun("__tact_dict_delete_uint", () => {
        ctx.signature(
            `(cell, int) __tact_dict_delete_uint(cell dict, int key_len, int index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTUDEL");
    });

    ctx.fun("__tact_dict_set_ref", () => {
        ctx.signature(
            `((cell), ()) __tact_dict_set_ref(cell dict, int key_len, slice index, cell value)`,
        );
        ctx.context("stdlib");
        ctx.asm("(value index dict key_len)", "DICTSETREF");
    });

    ctx.fun("__tact_dict_replace_ref", () => {
        ctx.signature(
            `((cell), (int)) __tact_dict_replace_ref(cell dict, int key_len, slice index, cell value)`,
        );
        ctx.context("stdlib");
        ctx.asm("(value index dict key_len)", "DICTREPLACEREF");
    });

    ctx.fun("__tact_dict_replaceget_ref", () => {
        ctx.signature(
            `((cell), (cell, int)) __tact_dict_replaceget_ref(cell dict, int key_len, slice index, cell value)`,
        );
        ctx.context("stdlib");
        ctx.asm(
            "(value index dict key_len)",
            "DICTREPLACEGETREF NULLSWAPIFNOT",
        );
    });

    ctx.fun("__tact_dict_get", () => {
        ctx.signature(
            `(slice, int) __tact_dict_get(cell dict, int key_len, slice index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTGET NULLSWAPIFNOT");
    });

    ctx.fun("__tact_dict_delete_get", () => {
        ctx.signature(
            `(cell, (slice, int)) __tact_dict_delete_get(cell dict, int key_len, slice index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTDELGET NULLSWAPIFNOT");
    });

    ctx.fun("__tact_dict_delete_get_ref", () => {
        ctx.signature(
            `(cell, (cell, int)) __tact_dict_delete_get_ref(cell dict, int key_len, slice index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTDELGETREF NULLSWAPIFNOT");
    });

    ctx.fun("__tact_dict_get_ref", () => {
        ctx.signature(
            `(cell, int) __tact_dict_get_ref(cell dict, int key_len, slice index)`,
        );
        ctx.context("stdlib");
        ctx.asm("(index dict key_len)", "DICTGETREF NULLSWAPIFNOT");
    });

    ctx.fun("__tact_dict_min", () => {
        ctx.signature(
            `(slice, slice, int) __tact_dict_min(cell dict, int key_len)`,
        );
        ctx.context("stdlib");
        ctx.asm("(dict key_len -> 1 0 2)", "DICTMIN  NULLSWAPIFNOT2");
    });

    ctx.fun("__tact_dict_min_ref", () => {
        ctx.signature(
            `(slice, cell, int) __tact_dict_min_ref(cell dict, int key_len)`,
        );
        ctx.context("stdlib");
        ctx.asm("(dict key_len -> 1 0 2)", "DICTMINREF NULLSWAPIFNOT2");
    });

    ctx.fun("__tact_dict_next", () => {
        ctx.signature(
            `(slice, slice, int) __tact_dict_next(cell dict, int key_len, slice pivot)`,
        );
        ctx.context("stdlib");
        ctx.asm("(pivot dict key_len -> 1 0 2)", "DICTGETNEXT NULLSWAPIFNOT2");
    });

    ctx.fun("__tact_dict_next_ref", () => {
        ctx.signature(
            `(slice, cell, int) __tact_dict_next_ref(cell dict, int key_len, slice pivot)`,
        );
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (key, value, flag) = ${ctx.used(
                    "__tact_dict_next",
                )}(dict, key_len, pivot);
                if (flag) {
                    return (key, value~load_ref(), flag);
                } else {
                    return (null(), null(), flag);
                }
            `);
        });
    });

    ctx.fun("__tact_dump", () => {
        ctx.signature(
            `forall X -> () __tact_dump(X value, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.asm("", "STRDUMP DROP STRDUMP DROP s0 DUMP DROP");
    });

    ctx.fun("__tact_dump_str", () => {
        ctx.signature(
            `() __tact_dump_str(slice value, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.asm("", "STRDUMP DROP STRDUMP DROP STRDUMP DROP");
    });

    ctx.fun("__tact_dump_bool", () => {
        ctx.signature(
            `() __tact_dump_bool(int value, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(value)) {
                    ${ctx.used(
                        "__tact_dump_str",
                    )}("null", debug_print_1, debug_print_2);
                } elseif (value) {
                    ${ctx.used(
                        "__tact_dump_str",
                    )}("true", debug_print_1, debug_print_2);
                } else {
                    ${ctx.used(
                        "__tact_dump_str",
                    )}("false", debug_print_1, debug_print_2);
                }
            `);
        });
    });

    ctx.fun("__tact_dump_string", () => {
        ctx.signature(
            `() __tact_dump_string(slice str, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(str)) {
                    ${ctx.used("__tact_dump_str")}("null", debug_print_1, debug_print_2);
                } else {
                    ${ctx.used("__tact_dump_str")}(str, debug_print_1, debug_print_2);
                }
            `);
        });
    });

    ctx.fun("__tact_dump_int", () => {
        ctx.signature(
            `() __tact_dump_int(int number, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(number)) {
                    ${ctx.used("__tact_dump_str")}("null", debug_print_1, debug_print_2);
                } else {
                    ${ctx.used("__tact_dump_str")}(${ctx.used(ops.extension("Int", "toString"))}(number), debug_print_1, debug_print_2);
                }
            `);
        });
    });

    ctx.fun("__tact_preload_offset", () => {
        ctx.signature(
            `(slice) __tact_preload_offset(slice s, int offset, int bits)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.asm("", "SDSUBSTR");
    });

    ctx.fun("__tact_crc16", () => {
        ctx.signature(`(slice) __tact_crc16(slice data)`);
        ctx.flag("inline_ref");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                slice new_data = begin_cell()
                    .store_slice(data)
                    .store_slice("0000"s)
                .end_cell().begin_parse();
                int reg = 0;
                while (~ new_data.slice_data_empty?()) {
                    int byte = new_data~load_uint(8);
                    int mask = 0x80;
                    while (mask > 0) {
                        reg <<= 1;
                        if (byte & mask) {
                            reg += 1;
                        }
                        mask >>= 1;
                        if (reg > 0xffff) {
                            reg &= 0xffff;
                            reg ^= 0x1021;
                        }
                    }
                }
                (int q, int r) = divmod(reg, 256);
                return begin_cell()
                    .store_uint(q, 8)
                    .store_uint(r, 8)
                .end_cell().begin_parse();
            `);
        });
    });

    ctx.fun("__tact_base64_encode", () => {
        ctx.signature(`(slice) __tact_base64_encode(slice data)`);
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                slice chars = "4142434445464748494A4B4C4D4E4F505152535455565758595A6162636465666768696A6B6C6D6E6F707172737475767778797A303132333435363738392D5F"s;
                builder res = begin_cell();

                while (data.slice_bits() >= 24) {
                    (int bs1, int bs2, int bs3) = (data~load_uint(8), data~load_uint(8), data~load_uint(8));

                    int n = (bs1 << 16) | (bs2 << 8) | bs3;

                    res = res
                        .store_slice(${ctx.used(
                            "__tact_preload_offset",
                        )}(chars, ((n >> 18) & 63) * 8, 8))
                        .store_slice(${ctx.used(
                            "__tact_preload_offset",
                        )}(chars, ((n >> 12) & 63) * 8, 8))
                        .store_slice(${ctx.used(
                            "__tact_preload_offset",
                        )}(chars, ((n >>  6) & 63) * 8, 8))
                        .store_slice(${ctx.used(
                            "__tact_preload_offset",
                        )}(chars, ((n      ) & 63) * 8, 8));
                }

                return res.end_cell().begin_parse();
            `);
        });
    });

    ctx.fun("__tact_address_to_user_friendly", () => {
        ctx.signature(`(slice) __tact_address_to_user_friendly(slice address)`);
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                (int wc, int hash) = address.parse_std_addr();

                slice user_friendly_address = begin_cell()
                    .store_slice("11"s)
                    .store_uint((wc + 0x100) % 0x100, 8)
                    .store_uint(hash, 256)
                .end_cell().begin_parse();

                slice checksum = ${ctx.used(
                    "__tact_crc16",
                )}(user_friendly_address);
                slice user_friendly_address_with_checksum = begin_cell()
                    .store_slice(user_friendly_address)
                    .store_slice(checksum)
                .end_cell().begin_parse();

                return ${ctx.used(
                    "__tact_base64_encode",
                )}(user_friendly_address_with_checksum);
            `);
        });
    });

    ctx.fun("__tact_dump_address", () => {
        ctx.signature(
            `() __tact_dump_address(slice address, slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(address)) {
                    ${ctx.used("__tact_dump_str")}("null", debug_print_1, debug_print_2);
                } else {
                    ${ctx.used("__tact_dump_str")}(${ctx.used(
                        "__tact_address_to_user_friendly",
                    )}(address), debug_print_1, debug_print_2);
                }
            `);
        });
    });

    ctx.fun("__tact_dump_stack", () => {
        ctx.signature(
            `() __tact_dump_stack(slice debug_print_1, slice debug_print_2)`,
        );
        ctx.flag("impure");
        ctx.context("stdlib");
        ctx.asm("", "STRDUMP DROP STRDUMP DROP DUMPSTK");
    });

    ctx.fun("__tact_context_get", () => {
        ctx.signature(`(int, slice, int, slice) __tact_context_get()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`return __tact_context;`);
        });
    });

    ctx.fun("__tact_in_msg_get", () => {
        ctx.signature(`slice __tact_in_msg_get()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`return __tact_in_msg;`);
        });
    });

    ctx.fun("__tact_context_get_sender", () => {
        ctx.signature(`slice __tact_context_get_sender()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`return __tact_context_sender;`);
        });
    });

    ctx.fun("__tact_prepare_random", () => {
        ctx.signature(`() __tact_prepare_random()`);
        ctx.flag("impure");
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(__tact_randomized)) {
                    randomize_lt();
                    __tact_randomized = true;
                }
            `);
        });
    });

    //
    // Address
    //

    ctx.fun(`__tact_slice_eq_bits_nullable_right`, () => {
        ctx.signature(
            `int __tact_slice_eq_bits_nullable_right(slice a, slice b)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (false) : (equal_slices_bits(a, b));
            `);
        });
    });

    ctx.fun(`__tact_slice_eq_bits_nullable_left`, () => {
        ctx.signature(
            `int __tact_slice_eq_bits_nullable_left(slice a, slice b)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (false) : (equal_slices_bits(a, b));
            `);
        });
    });

    ctx.fun(`__tact_slice_eq_bits_nullable`, () => {
        ctx.signature(`int __tact_slice_eq_bits_nullable(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( true ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( equal_slices_bits(a, b) ) : ( false ) );
            `);
        });
    });

    //
    // Dictionary deep equality
    //

    ctx.fun(`__tact_dict_eq`, () => {
        ctx.signature(`int __tact_dict_eq(cell a, cell b, int kl)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                (slice key, slice value, int flag) = ${ctx.used(
                    "__tact_dict_min",
                )}(a, kl);
                while (flag) {
                    (slice value_b, int flag_b) = b~${ctx.used(
                        "__tact_dict_delete_get",
                    )}(kl, key);
                    ifnot (flag_b) {
                        return 0;
                    }
                    ifnot (value.slice_hash() == value_b.slice_hash()) {
                        return 0;
                    }
                    (key, value, flag) = ${ctx.used(
                        "__tact_dict_next",
                    )}(a, kl, key);
                }
                return null?(b);
            `);
        });
    });

    //
    // Int Eq
    //

    ctx.fun(`__tact_int_eq_nullable_right`, () => {
        ctx.signature(`int __tact_int_eq_nullable_right(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (false) : (a == b);
            `);
        });
    });

    ctx.fun(`__tact_int_neq_nullable_right`, () => {
        ctx.signature(`int __tact_int_neq_nullable_right(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (true) : (a != b);
            `);
        });
    });

    ctx.fun(`__tact_int_eq_nullable_left`, () => {
        ctx.signature(`int __tact_int_eq_nullable_left(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (false) : (a == b);
            `);
        });
    });

    ctx.fun(`__tact_int_neq_nullable_left`, () => {
        ctx.signature(`int __tact_int_neq_nullable_left(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (true) : (a != b);
            `);
        });
    });

    ctx.fun(`__tact_int_eq_nullable`, () => {
        ctx.signature(`int __tact_int_eq_nullable(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( true ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a == b ) : ( false ) );
            `);
        });
    });

    ctx.fun(`__tact_int_neq_nullable`, () => {
        ctx.signature(`int __tact_int_neq_nullable(int a, int b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( false ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a != b ) : ( true ) );
            `);
        });
    });

    //
    // Cell Eq
    //

    ctx.fun(`__tact_cell_eq`, () => {
        ctx.signature(`int __tact_cell_eq(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (a.cell_hash() ==  b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_neq`, () => {
        ctx.signature(`int __tact_cell_neq(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (a.cell_hash() !=  b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_eq_nullable_right`, () => {
        ctx.signature(`int __tact_cell_eq_nullable_right(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (false) : (a.cell_hash() == b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_neq_nullable_right`, () => {
        ctx.signature(`int __tact_cell_neq_nullable_right(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (true) : (a.cell_hash() != b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_eq_nullable_left`, () => {
        ctx.signature(`int __tact_cell_eq_nullable_left(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (false) : (a.cell_hash() == b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_neq_nullable_left`, () => {
        ctx.signature(`int __tact_cell_neq_nullable_left(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (true) : (a.cell_hash() != b.cell_hash());
            `);
        });
    });

    ctx.fun(`__tact_cell_eq_nullable`, () => {
        ctx.signature(`int __tact_cell_eq_nullable(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( true ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a.cell_hash() == b.cell_hash() ) : ( false ) );
            `);
        });
    });

    ctx.fun(`__tact_cell_neq_nullable`, () => {
        ctx.signature(`int __tact_cell_neq_nullable(cell a, cell b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( false ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a.cell_hash() != b.cell_hash() ) : ( true ) );
            `);
        });
    });

    //
    // Slice Eq
    //

    ctx.fun(`__tact_slice_eq`, () => {
        ctx.signature(`int __tact_slice_eq(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (a.slice_hash() ==  b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_neq`, () => {
        ctx.signature(`int __tact_slice_neq(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (a.slice_hash() !=  b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_eq_nullable_right`, () => {
        ctx.signature(`int __tact_slice_eq_nullable_right(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (false) : (a.slice_hash() == b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_neq_nullable_right`, () => {
        ctx.signature(`int __tact_slice_neq_nullable_right(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(b)) ? (true) : (a.slice_hash() != b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_eq_nullable_left`, () => {
        ctx.signature(`int __tact_slice_eq_nullable_left(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (false) : (a.slice_hash() == b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_neq_nullable_left`, () => {
        ctx.signature(`int __tact_slice_neq_nullable_left(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return (null?(a)) ? (true) : (a.slice_hash() != b.slice_hash());
            `);
        });
    });

    ctx.fun(`__tact_slice_eq_nullable`, () => {
        ctx.signature(`int __tact_slice_eq_nullable(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( true ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a.slice_hash() == b.slice_hash() ) : ( false ) );
            `);
        });
    });

    ctx.fun(`__tact_slice_neq_nullable`, () => {
        ctx.signature(`int __tact_slice_neq_nullable(slice a, slice b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var a_is_null = null?(a);
                var b_is_null = null?(b);
                return ( a_is_null & b_is_null ) ? ( false ) : ( ( ( ~ a_is_null ) & ( ~ b_is_null ) ) ? ( a.slice_hash() != b.slice_hash() ) : ( true ) );
            `);
        });
    });

    //
    // Sys Dict
    //

    ctx.fun(`__tact_dict_set_code`, () => {
        ctx.signature(
            `cell __tact_dict_set_code(cell dict, int id, cell code)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return udict_set_ref(dict, 16, id, code);
            `);
        });
    });

    ctx.fun(`__tact_dict_get_code`, () => {
        ctx.signature(`cell __tact_dict_get_code(cell dict, int id)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (data, ok) = udict_get_ref?(dict, 16, id);
                throw_unless(${contractErrors.codeNotFound.id}, ok);
                return data;
            `);
        });
    });

    //
    // Tuples
    //

    ctx.fun(`__tact_tuple_create_0`, () => {
        ctx.signature(`tuple __tact_tuple_create_0()`);
        ctx.context("stdlib");
        ctx.asm("", "NIL");
    });
    ctx.fun(`__tact_tuple_destroy_0`, () => {
        ctx.signature(`() __tact_tuple_destroy_0()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.append(`return ();`);
        });
    });

    for (let i = 1; i <= maxTupleSize; i++) {
        ctx.fun(`__tact_tuple_create_${i}`, () => {
            const args: string[] = [];
            for (let j = 0; j < i; j++) {
                args.push(`X${j}`);
            }
            ctx.signature(
                `forall ${args.join(
                    ", ",
                )} -> tuple __tact_tuple_create_${i}((${args.join(", ")}) v)`,
            );
            ctx.context("stdlib");
            ctx.asm("", `${i} TUPLE`);
        });
        ctx.fun(`__tact_tuple_destroy_${i}`, () => {
            const args: string[] = [];
            for (let j = 0; j < i; j++) {
                args.push(`X${j}`);
            }
            ctx.signature(
                `forall ${args.join(", ")} -> (${args.join(
                    ", ",
                )}) __tact_tuple_destroy_${i}(tuple v)`,
            );
            ctx.context("stdlib");
            ctx.asm("", `${i} UNTUPLE`);
        });
    }

    //
    // Strings
    //

    ctx.fun(`__tact_string_builder_start_comment`, () => {
        ctx.signature(`tuple __tact_string_builder_start_comment()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return ${ctx.used(
                    "__tact_string_builder_start",
                )}(begin_cell().store_uint(0, 32));
            `);
        });
    });

    ctx.fun(`__tact_string_builder_start_tail_string`, () => {
        ctx.signature(`tuple __tact_string_builder_start_tail_string()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return ${ctx.used(
                    "__tact_string_builder_start",
                )}(begin_cell().store_uint(0, 8));
            `);
        });
    });

    ctx.fun(`__tact_string_builder_start_string`, () => {
        ctx.signature(`tuple __tact_string_builder_start_string()`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return ${ctx.used("__tact_string_builder_start")}(begin_cell());
            `);
        });
    });

    ctx.fun(`__tact_string_builder_start`, () => {
        ctx.signature(`tuple __tact_string_builder_start(builder b)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return tpush(tpush(empty_tuple(), b), null());
            `);
        });
    });

    ctx.fun(`__tact_string_builder_end`, () => {
        ctx.signature(`cell __tact_string_builder_end(tuple builders)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                (builder b, tuple tail) = uncons(builders);
                cell c = b.end_cell();
                while(~ null?(tail)) {
                    (b, tail) = uncons(tail);
                    c = b.store_ref(c).end_cell();
                }
                return c;
            `);
        });
    });

    ctx.fun(`__tact_string_builder_end_slice`, () => {
        ctx.signature(`slice __tact_string_builder_end_slice(tuple builders)`);
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                return ${ctx.used(
                    "__tact_string_builder_end",
                )}(builders).begin_parse();
            `);
        });
    });

    ctx.fun(`__tact_string_builder_append`, () => {
        ctx.signature(
            `((tuple), ()) __tact_string_builder_append(tuple builders, slice sc)`,
        );
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                int sliceRefs = slice_refs(sc);
                int sliceBits = slice_bits(sc);

                while((sliceBits > 0) | (sliceRefs > 0)) {

                    ;; Load the current builder
                    (builder b, tuple tail) = uncons(builders);
                    int remBytes = 127 - (builder_bits(b) / 8);
                    int exBytes = sliceBits / 8;

                    ;; Append bits
                    int amount = min(remBytes, exBytes);
                    if (amount > 0) {
                        slice read = sc~load_bits(amount * 8);
                        b = b.store_slice(read);
                    }

                    ;; Update builders
                    builders = cons(b, tail);

                    ;; Check if we need to add a new cell and continue
                    if (exBytes - amount > 0) {
                        var bb = begin_cell();
                        builders = cons(bb, builders);
                        sliceBits = (exBytes - amount) * 8;
                    } elseif (sliceRefs > 0) {
                        sc = sc~load_ref().begin_parse();
                        sliceRefs = slice_refs(sc);
                        sliceBits = slice_bits(sc);
                    } else {
                        sliceBits = 0;
                        sliceRefs = 0;
                    }
                }

                return ((builders), ());
            `);
        });
    });

    ctx.fun(`__tact_string_builder_append_not_mut`, () => {
        ctx.signature(
            `(tuple) __tact_string_builder_append_not_mut(tuple builders, slice sc)`,
        );
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                builders~${ctx.used("__tact_string_builder_append")}(sc);
                return builders;
            `);
        });
    });

    // generate dict operations for all combinations of key/value types
    for (const key of keyTypes) {
        for (const val of valTypes) {
            genTactDictGet(ctx, key, val);
            genTactDictGetMin(ctx, key, val);
            genTactDictGetNext(ctx, key, val);
            genTactDictSet(ctx, key, val);
            genTactDictReplace(ctx, key, val);
            genTactDictReplaceGet(ctx, key, val);
        }
    }
    for (const key of keyTypes) {
        genTactDictExists(ctx, key);
    }
}

const keyTypes = ["slice", "uint", "int"] as const;
type KeyType = (typeof keyTypes)[number];

const valTypes = [
    "slice",
    "int",
    "uint",
    "cell",
    "coins",
    "varint16",
    "varint32",
    "varuint16",
    "varuint32",
] as const;
type ValType = (typeof valTypes)[number];

function getSignatureKeyType(key: KeyType): KeyType {
    return key === "uint" ? "int" : key;
}

function getSignatureValueType(value: ValType): ValType {
    return value === "slice" || value === "cell" ? value : "int";
}

function genTactDictGet(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const dictGet = () => {
        const cellSuffix = value === "cell" ? "_ref" : "";
        switch (key) {
            case "slice":
                return ctx.used(`__tact_dict_get${cellSuffix}`);
            case "uint":
                return `udict_get${cellSuffix}?`;
            case "int":
                return `idict_get${cellSuffix}?`;
        }
    };
    const returnExpr = () => {
        switch (value) {
            case "slice":
            case "cell":
                return "r";
            case "uint":
                return "r~load_uint(vl)";
            case "int":
                return "r~load_int(vl)";
            case "coins":
                return "r~load_coins()";
            case "varint16":
                return "r~load_varint16()";
            case "varint32":
                return "r~load_varint32()";
            case "varuint16":
                return "r~load_varuint16()";
            case "varuint32":
                return "r~load_varuint32()";
        }
    };
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    ctx.fun(`__tact_dict_get_${key}_${value}`, () => {
        ctx.signature(
            `${signatureValueType} __tact_dict_get_${key}_${value}(cell d, int kl, ${signatureKeyType} k${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (r, ok) = ${dictGet()}(d, kl, k);
                if (ok) {
                    return ${returnExpr()};
                } else {
                    return null();
                }
            `);
        });
    });
}

function genTactDictExists(ctx: WriterContext, key: KeyType): void {
    const signatureKeyType = getSignatureKeyType(key);
    const dictGet = () => {
        switch (key) {
            case "slice":
                return ctx.used("__tact_dict_get");
            case "uint":
                return "udict_get?";
            case "int":
                return "idict_get?";
        }
    };
    ctx.fun(`__tact_dict_exists_${key}`, () => {
        ctx.signature(
            `int __tact_dict_exists_${key}(cell d, int kl, ${signatureKeyType} k)`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (r, ok) = ${dictGet()}(d, kl, k);
                return ok;
            `);
        });
    });
}

function genTactDictSet(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    const dictDel = () => {
        switch (key) {
            case "slice":
                return ctx.used("__tact_dict_delete");
            case "uint":
                return "udict_delete?";
            case "int":
                return "idict_delete?";
        }
    };
    // prettier-ignore
    const returnExpr = () => match(key, value)
        .on("int", "int")(() => "(idict_set_builder(d, kl, k, begin_cell().store_int(v, vl)), ())")
        .on("int", "uint")(() => "(idict_set_builder(d, kl, k, begin_cell().store_uint(v, vl)), ())")
        .on("int", "coins")(() => "(idict_set_builder(d, kl, k, begin_cell().store_coins(v)), ())")
        .on("int", "varint16")(() => "(idict_set_builder(d, kl, k, begin_cell().store_varint16(v)), ())")
        .on("int", "varint32")(() => "(idict_set_builder(d, kl, k, begin_cell().store_varint32(v)), ())")
        .on("int", "varuint16")(() => "(idict_set_builder(d, kl, k, begin_cell().store_varuint16(v)), ())")
        .on("int", "varuint32")(() => "(idict_set_builder(d, kl, k, begin_cell().store_varuint32(v)), ())")
        .on("uint", "int")(() => "(udict_set_builder(d, kl, k, begin_cell().store_int(v, vl)), ())")
        .on("uint", "uint")(() => "(udict_set_builder(d, kl, k, begin_cell().store_uint(v, vl)), ())")
        .on("uint", "coins")(() => "(udict_set_builder(d, kl, k, begin_cell().store_coins(v)), ())")
        .on("uint", "varint16")(() => "(udict_set_builder(d, kl, k, begin_cell().store_varint16(v)), ())")
        .on("uint", "varint32")(() => "(udict_set_builder(d, kl, k, begin_cell().store_varint32(v)), ())")
        .on("uint", "varuint16")(() => "(udict_set_builder(d, kl, k, begin_cell().store_varuint16(v)), ())")
        .on("uint", "varuint32")(() => "(udict_set_builder(d, kl, k, begin_cell().store_varuint32(v)), ())")
        .on("slice", "int")(() => "(dict_set_builder(d, kl, k, begin_cell().store_int(v, vl)), ())")
        .on("slice", "uint")(() => "(dict_set_builder(d, kl, k, begin_cell().store_uint(v, vl)), ())")
        .on("slice", "coins")(() => "(dict_set_builder(d, kl, k, begin_cell().store_coins(v)), ())")
        .on("slice", "varint16")(() => "(dict_set_builder(d, kl, k, begin_cell().store_varint16(v)), ())")
        .on("slice", "varint32")(() => "(dict_set_builder(d, kl, k, begin_cell().store_varint32(v)), ())")
        .on("slice", "varuint16")(() => "(dict_set_builder(d, kl, k, begin_cell().store_varuint16(v)), ())")
        .on("slice", "varuint32")(() => "(dict_set_builder(d, kl, k, begin_cell().store_varuint32(v)), ())")
        .on("int", "cell")(() => "(idict_set_ref(d, kl, k, v), ())")
        .on("uint", "cell")(() => "(udict_set_ref(d, kl, k, v), ())")
        .on("int", "slice")(() => "(idict_set(d, kl, k, v), ())")
        .on("uint", "slice")(() => "(udict_set(d, kl, k, v), ())")
        .on("slice", "cell")(() => `${ctx.used("__tact_dict_set_ref")}(d, kl, k, v)`)
        .on("slice", "slice")(() => "(dict_set_builder(d, kl, k, begin_cell().store_slice(v)), ())")
        .end();
    ctx.fun(`__tact_dict_set_${key}_${value}`, () => {
        ctx.signature(
            `(cell, ()) __tact_dict_set_${key}_${value}(cell d, int kl, ${signatureKeyType} k, ${signatureValueType} v${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(v)) {
                    var (r, ok) = ${dictDel()}(d, kl, k);
                    return (r, ());
                } else {
                    return ${returnExpr()};
                }
            `);
        });
    });
}

function genTactDictGetMin(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    // prettier-ignore
    const dictGetMin = () => match(key, value)
        .on("int", "int")(() => "idict_get_min?")
        .on("int", "uint")(() => "idict_get_min?")
        .on("int", "coins")(() => "idict_get_min?")
        .on("int", "varint16")(() => "idict_get_min?")
        .on("int", "varint32")(() => "idict_get_min?")
        .on("int", "varuint16")(() => "idict_get_min?")
        .on("int", "varuint32")(() => "idict_get_min?")
        .on("int", "slice")(() => "idict_get_min?")
        .on("uint", "int")(() => "udict_get_min?")
        .on("uint", "uint")(() => "udict_get_min?")
        .on("uint", "coins")(() => "udict_get_min?")
        .on("uint", "varint16")(() => "udict_get_min?")
        .on("uint", "varint32")(() => "udict_get_min?")
        .on("uint", "varuint16")(() => "udict_get_min?")
        .on("uint", "varuint32")(() => "udict_get_min?")
        .on("uint", "slice")(() => "udict_get_min?")
        .on("slice", "int")(() => ctx.used("__tact_dict_min"))
        .on("slice", "uint")(() => ctx.used("__tact_dict_min"))
        .on("slice", "coins")(() => ctx.used("__tact_dict_min"))
        .on("slice", "varint16")(() => ctx.used("__tact_dict_min"))
        .on("slice", "varint32")(() => ctx.used("__tact_dict_min"))
        .on("slice", "varuint16")(() => ctx.used("__tact_dict_min"))
        .on("slice", "varuint32")(() => ctx.used("__tact_dict_min"))
        .on("slice", "slice")(() => ctx.used("__tact_dict_min"))
        .on("int", "cell")(() => "idict_get_min_ref?")
        .on("uint", "cell")(() => "udict_get_min_ref?")
        .on("slice", "cell")(() => ctx.used("__tact_dict_min_ref"))
        .end();
    const returnValExpr = () => {
        switch (value) {
            case "int":
                return "value~load_int(vl)";
            case "uint":
                return "value~load_uint(vl)";
            case "coins":
                return "value~load_coins()";
            case "varint16":
                return "value~load_varint16()";
            case "varint32":
                return "value~load_varint32()";
            case "varuint16":
                return "value~load_varuint16()";
            case "varuint32":
                return "value~load_varuint32()";
            case "slice":
            case "cell":
                return "value";
        }
    };
    ctx.fun(`__tact_dict_min_${key}_${value}`, () => {
        ctx.signature(
            `(${signatureKeyType}, ${signatureValueType}, int) __tact_dict_min_${key}_${value}(cell d, int kl${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (key, value, flag) = ${dictGetMin()}(d, kl);
                if (flag) {
                    return (key, ${returnValExpr()}, flag);
                } else {
                    return (null(), null(), flag);
                }
            `);
        });
    });
}

function genTactDictGetNext(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    const dictGetNext = () => {
        switch (key) {
            case "int":
                return "idict_get_next?";
            case "uint":
                return "udict_get_next?";
            case "slice":
                return ctx.used("__tact_dict_next");
        }
    };
    const returnValExpr = () => {
        switch (value) {
            case "int":
                return "value~load_int(vl)";
            case "uint":
                return "value~load_uint(vl)";
            case "coins":
                return "value~load_coins()";
            case "varint16":
                return "value~load_varint16()";
            case "varint32":
                return "value~load_varint32()";
            case "varuint16":
                return "value~load_varuint16()";
            case "varuint32":
                return "value~load_varuint32()";
            case "slice":
                return "value";
            case "cell":
                return "value~load_ref()";
        }
    };
    ctx.fun(`__tact_dict_next_${key}_${value}`, () => {
        ctx.signature(
            `(${signatureKeyType}, ${signatureValueType}, int) __tact_dict_next_${key}_${value}(cell d, int kl, ${signatureKeyType} pivot${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            if (key === "slice" && value === "slice") {
                ctx.write(`
                    return ${ctx.used(`__tact_dict_next`)}(d, kl, pivot);
                `);
            } else {
                ctx.write(`
                    var (key, value, flag) = ${dictGetNext()}(d, kl, pivot);
                    if (flag) {
                        return (key, ${returnValExpr()}, flag);
                    } else {
                        return (null(), null(), flag);
                    }
                `);
            }
        });
    });
}

function genTactDictReplace(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    const dictDel = () => {
        switch (key) {
            case "slice":
                return ctx.used("__tact_dict_delete");
            case "uint":
                return "udict_delete?";
            case "int":
                return "idict_delete?";
        }
    };
    // prettier-ignore
    const returnExpr = () => match(key, value)
        .on("int", "int")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_int(v, vl))")
        .on("int", "uint")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_uint(v, vl))")
        .on("int", "coins")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_coins(v))")
        .on("int", "varint16")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_varint16(v))")
        .on("int", "varint32")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_varint32(v))")
        .on("int", "varuint16")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_varuint16(v))")
        .on("int", "varuint32")(() => "idict_replace_builder?(d, kl, k, begin_cell().store_varuint32(v))")
        .on("uint", "int")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_int(v, vl))")
        .on("uint", "uint")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_uint(v, vl))")
        .on("uint", "coins")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_coins(v))")
        .on("uint", "varint16")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_varint16(v))")
        .on("uint", "varint32")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_varint32(v))")
        .on("uint", "varuint16")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_varuint16(v))")
        .on("uint", "varuint32")(() => "udict_replace_builder?(d, kl, k, begin_cell().store_varuint32(v))")
        .on("slice", "int")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_int(v, vl))")
        .on("slice", "uint")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_uint(v, vl))")
        .on("slice", "coins")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_coins(v))")
        .on("slice", "varint16")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_varint16(v))")
        .on("slice", "varint32")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_varint32(v))")
        .on("slice", "varuint16")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_varuint16(v))")
        .on("slice", "varuint32")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_varuint32(v))")
        .on("int", "cell")(() => "idict_replace_ref?(d, kl, k, v)")
        .on("uint", "cell")(() => "udict_replace_ref?(d, kl, k, v)")
        .on("int", "slice")(() => "idict_replace?(d, kl, k, v)")
        .on("uint", "slice")(() => "udict_replace?(d, kl, k, v)")
        .on("slice", "cell")(() => `${ctx.used("__tact_dict_replace_ref")}(d, kl, k, v)`)
        .on("slice", "slice")(() => "dict_replace_builder?(d, kl, k, begin_cell().store_slice(v))")
        .end();
    ctx.fun(`__tact_dict_replace_${key}_${value}`, () => {
        ctx.signature(
            `(cell, (int)) __tact_dict_replace_${key}_${value}(cell d, int kl, ${signatureKeyType} k, ${signatureValueType} v${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                if (null?(v)) {
                    var (r, ok) = ${dictDel()}(d, kl, k);
                    return (r, (ok));
                } else {
                    return ${returnExpr()};
                }
            `);
        });
    });
}

function genTactDictReplaceGet(
    ctx: WriterContext,
    key: KeyType,
    value: ValType,
): void {
    const signatureKeyType = getSignatureKeyType(key);
    const signatureValueType = getSignatureValueType(value);
    const valBitsArg = () => {
        switch (value) {
            case "slice":
            case "cell":
            case "coins":
            case "varint16":
            case "varint32":
            case "varuint16":
            case "varuint32":
                return "";
            case "uint":
            case "int":
                return ", int vl";
        }
    };
    const dictDelGet = () => {
        const cellSuffix = value === "cell" ? "_ref" : "";
        switch (key) {
            case "slice":
                return ctx.used(`__tact_dict_delete_get${cellSuffix}`);
            case "uint":
                return `udict_delete_get${cellSuffix}?`;
            case "int":
                return `idict_delete_get${cellSuffix}?`;
        }
    };
    // prettier-ignore
    const returnExpr = () => match(key, value)
        .on("int", "int")(() => "d~idict_replaceget?(kl, k, begin_cell().store_int(v, vl).end_cell().begin_parse())")
        .on("int", "uint")(() => "d~idict_replaceget?(kl, k, begin_cell().store_uint(v, vl).end_cell().begin_parse())")
        .on("int", "coins")(() => "d~idict_replaceget?(kl, k, begin_cell().store_coins(v).end_cell().begin_parse())")
        .on("int", "varint16")(() => "d~idict_replaceget?(kl, k, begin_cell().store_varint16(v).end_cell().begin_parse())")
        .on("int", "varint32")(() => "d~idict_replaceget?(kl, k, begin_cell().store_varint32(v).end_cell().begin_parse())")
        .on("int", "varuint16")(() => "d~idict_replaceget?(kl, k, begin_cell().store_varuint16(v).end_cell().begin_parse())")
        .on("int", "varuint32")(() => "d~idict_replaceget?(kl, k, begin_cell().store_varuint32(v).end_cell().begin_parse())")
        .on("uint", "int")(() => "d~udict_replaceget?(kl, k, begin_cell().store_int(v, vl).end_cell().begin_parse())")
        .on("uint", "uint")(() => "d~udict_replaceget?(kl, k, begin_cell().store_uint(v, vl).end_cell().begin_parse())")
        .on("uint", "coins")(() => "d~udict_replaceget?(kl, k, begin_cell().store_coins(v).end_cell().begin_parse())")
        .on("uint", "varint16")(() => "d~udict_replaceget?(kl, k, begin_cell().store_varint16(v).end_cell().begin_parse())")
        .on("uint", "varint32")(() => "d~udict_replaceget?(kl, k, begin_cell().store_varint32(v).end_cell().begin_parse())")
        .on("uint", "varuint16")(() => "d~udict_replaceget?(kl, k, begin_cell().store_varuint16(v).end_cell().begin_parse())")
        .on("uint", "varuint32")(() => "d~udict_replaceget?(kl, k, begin_cell().store_varuint32(v).end_cell().begin_parse())")
        .on("slice", "int")(() => "d~dict_replaceget?(kl, k, begin_cell().store_int(v, vl).end_cell().begin_parse())")
        .on("slice", "uint")(() => "d~dict_replaceget?(kl, k, begin_cell().store_uint(v, vl).end_cell().begin_parse())")
        .on("slice", "coins")(() => "d~dict_replaceget?(kl, k, begin_cell().store_coins(v).end_cell().begin_parse())")
        .on("slice", "varint16")(() => "d~dict_replaceget?(kl, k, begin_cell().store_varint16(v).end_cell().begin_parse())")
        .on("slice", "varint32")(() => "d~dict_replaceget?(kl, k, begin_cell().store_varint32(v).end_cell().begin_parse())")
        .on("slice", "varuint16")(() => "d~dict_replaceget?(kl, k, begin_cell().store_varuint16(v).end_cell().begin_parse())")
        .on("slice", "varuint32")(() => "d~dict_replaceget?(kl, k, begin_cell().store_varuint32(v).end_cell().begin_parse())")
        .on("int", "cell")(() => "d~idict_replaceget_ref?(kl, k, v)")
        .on("uint", "cell")(() => "d~udict_replaceget_ref?(kl, k, v)")
        .on("int", "slice")(() => "d~idict_replaceget?(kl, k, v)")
        .on("uint", "slice")(() => "d~udict_replaceget?(kl, k, v)")
        .on("slice", "cell")(() => `d~${ctx.used("__tact_dict_replaceget_ref")}(kl, k, v)`)
        .on("slice", "slice")(() => "d~dict_replaceget?(kl, k, begin_cell().store_slice(v).end_cell().begin_parse())")
        .end();
    const parseExpr = () => {
        switch (value) {
            case "slice":
            case "cell":
                return "old";
            case "uint":
                return "old~load_uint(vl)";
            case "int":
                return "old~load_int(vl)";
            case "coins":
                return "old~load_coins()";
            case "varint16":
                return "old~load_varint16()";
            case "varint32":
                return "old~load_varint32()";
            case "varuint16":
                return "old~load_varuint16()";
            case "varuint32":
                return "old~load_varuint32()";
        }
    };
    ctx.fun(`__tact_dict_replaceget_${key}_${value}`, () => {
        ctx.signature(
            `(cell, (${signatureValueType})) __tact_dict_replaceget_${key}_${value}(cell d, int kl, ${signatureKeyType} k, ${signatureValueType} v${valBitsArg()})`,
        );
        ctx.flag("inline");
        ctx.context("stdlib");
        ctx.body(() => {
            ctx.write(`
                var (old, ok) = null?(v) ? d~${dictDelGet()}(kl, k) : ${returnExpr()};
                if (ok) {
                    return (d, ${parseExpr()});
                } else {
                    return (d, null());
                }
            `);
        });
    });
}
