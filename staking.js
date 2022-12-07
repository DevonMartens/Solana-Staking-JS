const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL} = require("@solana/web3.js");


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