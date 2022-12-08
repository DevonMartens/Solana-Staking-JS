const { PublicKey, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, StakeProgram, Authorized, sendAndConfirmTransaction, Lockup} = require("@solana/web3.js");


const main = async () => {

    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    //create wallet
    const wallet = Keypair.generate();
    //airdrop sol wallet, amount (1 sol)
    const airdropSig = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);
    //confirm
    await connection.confirmTransaction(airdropSig);
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(balance);
    //time to stake
    //generate stake accoint
    const stakeAcct = Keypair.generate()
    //calc rent balance
    //get size of stake account w/stakeProgram
    const minRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    //confirm amount user wants to stake 0.5
    const amountUserWantsStaked = 0.5 * LAMPORTS_PER_SOL
    const amountToStake = minRent + amountUserWantsStaked
    //authorized is where we set the authority wallet of the stake account
    //set two authorities 1. stake authority for who delegates stake - deactive or split/merge account/
    //2. withdrawl authority who can remove funds
    const createStakeAccountTxn = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        //specifys where sol that is staked comes from
        fromPubkey: wallet.publicKey,
        //amount we want to stake
        lamports: amountToStake,
        //lock up - specific date and time
        //new lockup then expire unix time stamp - epoch and custodian 
         lockup: new Lockup(0, 0, wallet.publicKey),
        //account as stake account
        stakePubkey: stakeAcct.publicKey
        });
        //endAndConfirmTransaction args connect, txn, signers)
        //two here wallet and stake account
        // txn id returned if successful
        const createStakeAccountId = await sendAndConfirmTransaction(connection, createStakeAccountTxn, [wallet, stakeAcct])
        console.log("it worked stake account created   ", `${createStakeAccountId}`);
        //divdes into sol
        let stakingBalance = await connection.getBalance(stakeAcct.publicKey);
        console.log("here's the balance of the stake account ",  `${stakingBalance / LAMPORTS_PER_SOL}`);
        //balance is inactive until delgatation occurs
        let stakeStatus = await connection.getStakeActivation(stakeAcct.publicKey);
        console.log("here's the stake status ",  `${stakeStatus.state}`);



        //get list of validators
        //choose any but we choose first 
        const validators = await connection.getVoteAccounts();
        const selectedValidator = validators.current[0];
        const pKeyOfValidator = new PublicKey(selectedValidator.votePubkey);
        // delegate stake 
        //pass in stake account
        // authority to do txn - you have authority
        // then the validator to delegate to 
        const delegateTransact = StakeProgram.delegate({
            stakePubkey: stakeAcct.publicKey,
            authorizedPubkey: wallet.publicKey,
            votePubkey: pKeyOfValidator,
        });
        //then send/confirm txn
        //args connection, the txn you want to confirm 
        const delegateTxId = await sendAndConfirmTransaction(
            connection, 
            delegateTransact, 
            [wallet]
        );

        const newStakeStatus = await connection.getStakeActivation(stakeAcct.publicKey);
        
        console.log("Stake account chose validator:" + pKeyOfValidator);
        console.log("Transaction Id " + delegateTxId );
        console.log("Stake account status is now " + newStakeStatus.state);
        //deacivate stake txn
        const deacivateStakeTxn = StakeProgram.deactivate({
            stakePubkey: stakeAcct.publicKey,
            authorizedPubkey: wallet.publicKey,
        });
        
        const deacivateStakeTxnID = await sendAndConfirmTransaction(connection, deacivateStakeTxn, [wallet]);
        console.log("stake account deactivated ",  `${deacivateStakeTxnID}`);
        const finalStatus = await connection.getStakeActivation(stakeAcct.publicKey);
        console.log("confirm status as deactivated ",  `${finalStatus.state}`);

    };

//call main function - async w/ try/catch

const runMain = async () => {
    try {
        await main();
    } catch (error) {
        console.log(error);
        
    }
};

// ls
runMain();