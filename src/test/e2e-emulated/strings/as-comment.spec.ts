import { toNano } from "@ton/core";
import type { SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Blockchain } from "@ton/sandbox";
import { AsCommentTester } from "./output/as-comment_AsCommentTester";
import "@ton/test-utils";

describe("asComment", () => {
    let blockchain: Blockchain;
    let treasury: SandboxContract<TreasuryContract>;
    let contract: SandboxContract<AsCommentTester>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.verbosity.print = false;
        treasury = await blockchain.treasury("treasury");
        contract = blockchain.openContract(await AsCommentTester.fromInit());

        const result = await contract.send(
            treasury.getSender(),
            {
                value: toNano("10"),
            },
            null,
        );

        expect(result.transactions).toHaveTransaction({
            from: treasury.address,
            to: contract.address,
            success: true,
            deploy: true,
        });
    });

    it("should calculate asComment in compile-time as in runtime", async () => {
        expect(await contract.getConstantCell()).toEqualCell(
            await contract.getAsCommentRuntimeCell("hello world"),
        );
    });
});
