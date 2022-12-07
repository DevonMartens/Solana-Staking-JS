const { Connection, clusterApiUrl } = require("@solana/web3.js");
//solana is proof of stake so it uses validators to confirm txs 
//get a list of validators

const main = async () => {

    //first est connection w solana chain
    //imports needed from solana js
    //pass in two args(https://solana-labs.github.io/solana-web3.js/functions/clusterApiUrl.html)
    //Retrieves the RPC API URL for the specified cluster
    //Type alias Cluster Cluster: "devnet" | "testnet" | "mainnet-beta"
    //optional default commitment level or optional ConnectionConfig configuration object
    //what a commitment level is, is it tells us how certain we want to be of the blockchain data 
    //we are getting 'processed' means get just the latest block of the node we connect to
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    //now we get validators (2 types current delinquent -> no longer active)
    const { current, delinquent } = await connection.getVoteAccounts();
    
    console.log('all validators: ' +  current.concat(delinquent).length);
    console.log('current validators: ' + current.length);
    console.log(current[0]);

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