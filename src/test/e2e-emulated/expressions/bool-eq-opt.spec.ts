import { toNano } from "@ton/core";
import { Blockchain } from "@ton/sandbox";
import { BoolEqOpt } from "./output/bool-eq-opt_BoolEqOpt";
import "@ton/test-utils";
import { cached } from "@/test/utils/cache-state";

const deployValue = toNano("1");

const setup = async () => {
    const blockchain = await Blockchain.create();
    blockchain.verbosity.print = false;
    const treasury = await blockchain.treasury("treasury");

    const contract = blockchain.openContract(await BoolEqOpt.fromInit());

    const deployResult = await contract.send(
        treasury.getSender(),
        { value: deployValue },
        null,
    );
    expect(deployResult.transactions).toHaveTransaction({
        from: treasury.address,
        to: contract.address,
        success: true,
        deploy: true,
    });

    return {
        blockchain,
        treasury,
        contract,
    };
};

describe("bool-eq-opt", () => {
    const state = cached(setup);

    it("should optimize boolean comparisons", async () => {
        const { contract } = await state.get();
        expect(await contract.getEqTrue(true)).toEqual(1n);
        expect(await contract.getEqTrue(false)).toEqual(0n);
        expect(await contract.getEqFalse(false)).toEqual(1n);
        expect(await contract.getEqFalse(true)).toEqual(0n);
        expect(await contract.getNeqTrue(false)).toEqual(1n);
        expect(await contract.getNeqTrue(true)).toEqual(0n);
        expect(await contract.getNeqFalse(true)).toEqual(1n);
        expect(await contract.getNeqFalse(false)).toEqual(0n);
    });

    it("should optimize boolean comparisons with constants on the left", async () => {
        const { contract } = await state.get();
        expect(await contract.getTrueEq(true)).toEqual(1n);
        expect(await contract.getTrueEq(false)).toEqual(0n);
        expect(await contract.getFalseEq(false)).toEqual(1n);
        expect(await contract.getFalseEq(true)).toEqual(0n);
        expect(await contract.getTrueNeq(false)).toEqual(1n);
        expect(await contract.getTrueNeq(true)).toEqual(0n);
        expect(await contract.getFalseNeq(true)).toEqual(1n);
        expect(await contract.getFalseNeq(false)).toEqual(0n);
    });

    it("should optimize boolean comparisons returning bool", async () => {
        const { contract } = await state.get();
        expect(await contract.getEqTrueBool(true)).toEqual(true);
        expect(await contract.getEqTrueBool(false)).toEqual(false);
        expect(await contract.getEqFalseBool(false)).toEqual(true);
        expect(await contract.getEqFalseBool(true)).toEqual(false);
        expect(await contract.getNeqTrueBool(false)).toEqual(true);
        expect(await contract.getNeqTrueBool(true)).toEqual(false);
        expect(await contract.getNeqFalseBool(true)).toEqual(true);
        expect(await contract.getNeqFalseBool(false)).toEqual(false);
    });

    it("should optimize boolean comparisons with constants on the left returning bool", async () => {
        const { contract } = await state.get();
        expect(await contract.getTrueEqBool(true)).toEqual(true);
        expect(await contract.getTrueEqBool(false)).toEqual(false);
        expect(await contract.getFalseEqBool(false)).toEqual(true);
        expect(await contract.getFalseEqBool(true)).toEqual(false);
        expect(await contract.getTrueNeqBool(false)).toEqual(true);
        expect(await contract.getTrueNeqBool(true)).toEqual(false);
        expect(await contract.getFalseNeqBool(true)).toEqual(true);
        expect(await contract.getFalseNeqBool(false)).toEqual(false);
    });
});
