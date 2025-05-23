import { toNano } from "@ton/core";
import type { SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Blockchain } from "@ton/sandbox";
import { Test } from "./output/contract-with-init-init-parameter_Test";
import "@ton/test-utils";

describe("contract-with-init-init-parameter", () => {
    let blockchain: Blockchain;
    let treasury: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<Test>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity.print = false;
        treasury = await blockchain.treasury("treasury");

        contract = blockchain.openContract(
            await Test.fromInit({
                $$type: "Init",
                foo: 99n,
            }),
        );

        const deployResult = await contract.send(
            treasury.getSender(),
            { value: toNano("0.5") },
            null,
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
            deploy: true,
        });
    });

    it("should return correct result", async () => {
        expect(await contract.getData()).toBe(99n);
    });
});
