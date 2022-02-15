const DSA = require('dsa-connect');
require("@nomiclabs/hardhat-web3");
require("hardhat")
require('dotenv').config();

const main = async () => {
    const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

    // seed ethereum account with ether using hardhat's setBalance feature for mainnet forks
    await network.provider.send("hardhat_setBalance", [
        address,
        "0x21e19e0c9bab2400000"
    ]);

    // instantiate dsa with web3 instance
    const dsa = new DSA({
        web3: web3,
        mode: "node",
        privateKey: process.env.PRIVATE_KEY
    });

    // create a dsa account
    await dsa.build({
        gasPrice: web3.utils.toWei('1000000', 'gwei'), // gas estimate, necessary when using NodeJs for calls
        authority: address, // the address to be added as authority for the account
        version: 2
    });

    // fetch all dsa accounts owned by address 
    const accounts = await dsa.getAccounts(address);

    const dsaId = accounts[0].id;

    // set the (dsa) account which is to be used for subsequent dsa calls
    await dsa.setInstance(dsaId);

    let spells = dsa.Spell();

    // provide ether to the DSA contract to be able to perform further operations
    // ( if we skip this step, we need to provide ether in the "value" field in spells.cast() )
    await network.provider.send("hardhat_setBalance", [
        accounts[0].address,
        ethers.utils.parseEther("10.0").toHexString() 
        // NOTE: be careful while using above method (sometimes pads hex string with 0s which makes input invalid)
    ])

    // add a spell to cast
    spells.add({ 
        connector: "COMPOUND-A", // ID of the protocol which we want to interact with 
        method: "deposit",
        args: [
            "ETH-A", // Id of the token to be used for interaction
            "10000000000000000000", // amount of token (here, 10 ether = 10* (10**18) wei)
            0, // getId
            0 // setId (used along with getId to share data from one spell to another)
        ]
    })

    // "cast" the spells
    const transactionHash = await spells.cast({
        gasPrice: web3.utils.toWei('1000000', 'gwei'), // in gwei, used in node implementation.
    });
    console.log(transactionHash);
}

main();