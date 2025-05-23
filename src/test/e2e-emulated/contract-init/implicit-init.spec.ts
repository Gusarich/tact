import { toNano } from "@ton/core";
import type { SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Blockchain } from "@ton/sandbox";
import { MyContract } from "./output/implicit-init_MyContract";
import "@ton/test-utils";

describe("implicit-init", () => {
    let blockchain: Blockchain;
    let treasury: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<MyContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity.print = false;
        treasury = await blockchain.treasury("treasury");

        contract = blockchain.openContract(await MyContract.fromInit());
    });

    it("should deploy", async () => {
        // Deploy the contract
        const deployResult = await contract.send(
            treasury.getSender(),
            { value: toNano("1") },
            { $$type: "Deploy", queryId: 0n },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
            deploy: true,
        });

        // Verify initial state
        expect(await contract.getGetCounter()).toBe(0n);
    });

    it("should increment counter", async () => {
        // Deploy the contract
        const deployResult = await contract.send(
            treasury.getSender(),
            { value: toNano("1") },
            { $$type: "Deploy", queryId: 0n },
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
            deploy: true,
        });

        // Verify initial state
        expect(await contract.getGetCounter()).toBe(0n);

        // Increment counter
        const incrementResult1 = await contract.send(
            treasury.getSender(),
            { value: toNano("1") },
            "increment",
        );
        expect(incrementResult1.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
        });
        expect(await contract.getGetCounter()).toBe(1n);

        const incrementResult2 = await contract.send(
            treasury.getSender(),
            { value: toNano("1") },
            "increment",
        );
        expect(incrementResult2.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
        });
        expect(await contract.getGetCounter()).toBe(2n);
    });
});
