import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { TeaVsCoffee } from "../target/types/tea_vs_coffee";

describe("tea-vs-coffee", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TeaVsCoffee as Program<TeaVsCoffee>;

  const voteAccount = anchor.web3.Keypair.generate();

  it("Initializes with 0 votes for both tea and coffee", async () => {
    console.log("Testing Initialize...");
    /* The last element passed to RPC methods is always the transaction options. Because voteAccount is being created here, we are required to pass it as a signers array */

    const tx = await program.methods.initialize()
      .accounts({
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }).
      signers([voteAccount]).rpc();

    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);
    console.log("Tea: ", account.tea.toString());
    console.log("Coffee: ", account.coffee.toString());

    assert.ok(account.tea.toString() == 0 && account.coffee.toString() == 0);
  });

  it("Votes correctly for tea", async () => {
    console.log("Voting tea...");
    const tx = await program.methods.voteTea().accounts({
      voteAccount: voteAccount.publicKey
    }).rpc();
    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);
    console.log("Tea: ", account.tea.toString());
    console.log("Coffee: ", account.coffee.toString());

    assert.ok(account.tea.toString() == 1 && account.coffee.toString() == 0);
  })

  it("Votes correctly for coffee", async () => {
    console.log("Voting coffee...");
    const tx = await program.methods.voteCoffee().accounts({
      voteAccount: voteAccount.publicKey
    }).rpc();
    const account = await program.account.voteAccount.fetch(voteAccount.publicKey);
    console.log("Tea: ", account.tea.toString());
    console.log("Coffee: ", account.coffee.toString());

    assert.ok(account.tea.toString() == 1 && account.coffee.toString() == 1);
  })
});
