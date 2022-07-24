use anchor_lang::prelude::*;
declare_id!("FYZUbgD7cSJn4M9aB9eZtvQ6r8yau9R5A7jog4ZSeGri");
/// We'll update our declare_id! later. Once you run `anchor build`, your Program ID can be found in /target/idl/[your_project_name].json
/// Moving on to the #[program] macro below, this is where we define our program.
/// Each method inside here defines an RPC request handler (aka instruction handler) which can be invoked by clients
#[program]
pub mod tea_vs_coffee {
    use super::*;
    /// The first parameter for every RPC handler is the Context struct. We define Initialize and Vote below at #[derive(Accounts)]
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.tea = 0;
        vote_account.coffee = 0;
        Ok(())
    }
    /// All account validation logic is handled below at the #[account(...)] macros, letting us just focus on the business logic
    pub fn vote_tea(ctx: Context<Vote>) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.tea += 1;
        Ok(())
    }
    pub fn vote_coffee(ctx: Context<Vote>) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.coffee += 1;
        Ok(())
    }
}
/// The #[derive(Accounts)] macro specifies all the accounts that are required for a given instruction
/// Here, we define two structs: Initialize and Vote
#[derive(Accounts)]
pub struct Initialize<'info> {
    /// We mark vote_account with the init attribute, which creates a new account owned by the program
    /// When using init, we must also provide:
    /// payer, which funds the account creation
    /// space, which defines how large the account should be
    /// and the system_program which is required by the runtime
    /// This enforces that our vote_account must be owned by the currently executing program, and that it should be deserialized to the VoteAccount struct below at #[account]
    #[account(init, payer = user, space = 16 + 16)]
    pub vote_account: Account<'info, VoteAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
#[derive(Accounts)]
pub struct Vote<'info> {
    /// Marking accounts as mut persists any changes made upon exiting the program, allowing our votes to be recorded
    #[account(mut)]
    pub vote_account: Account<'info, VoteAccount>,
}
/// Here we define what our VoteAccount looks like
/// We define a struct with two public properties: tea and coffee
/// These properties will keep track of their respective votes as unsigned 64-bit integers
/// This VoteAccount will be passed inside each Transaction Instruction to record votes as they occur
#[account]
pub struct VoteAccount {
    pub tea: u64,
    pub coffee: u64,
}