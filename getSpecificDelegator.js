const { PublicKey, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, StakeProgram, Authorized, sendAndConfirmTransaction, Lockup} = require("@solana/web3.js");

//check out delegators for a specific validotor 


const main = async () => {

    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    //interact manually with stake program
    //first set id
    //https://docs.solana.com/developing/runtime-facilities/programs#stake-program
    const Stake_Program_ID = new PublicKey(
        "Stake11111111111111111111111111111111111111"
    );
    //key from delegate.js
    const VOTE_PUB_KEY = "5ZWgXcyqrrNpQHCme5SdC5hCeYb2o3fEJhF7Gok3bTVN";
    //get the validators owned by Stake_Program_ID
    //filters {}
    const accounts = await connection.getParsedProgramAccounts(
        Stake_Program_ID, {
        filters: [
            { dataSize: 200 },
            {
                memcmp: {
                    offset: 124,
                    bytes: VOTE_PUB_KEY,
                },
            },
        ],
    }
 );

    console.log("total number of delegators found from: ",  `${VOTE_PUB_KEY}`);

    console.log("IS: ",  `${accounts.length}`);

    if(accounts.length){
        console.log(
            `${JSON.stringify(accounts[0])}`
        );
    }
    
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