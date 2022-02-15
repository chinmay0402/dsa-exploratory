const DSA = require('dsa-connect');
require("@nomiclabs/hardhat-web3");
require("hardhat")
require('dotenv').config();

const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const setBalance = async () => {
    await network.provider.send("hardhat_setBalance", [
        address,
        "0xD3C21BCECCEDA1000000"
    ]);
}

setBalance();

const castSpells = async () => {
    const dsa = new DSA({
        web3: web3,
        mode: "node",
        privateKey: process.env.PRIVATE_KEY
    });
    await dsa.build({
        gasPrice: web3.utils.toWei('0.000000100000000000', 'ether'),// estimated gas price
        origin: address,
        authority: address
    });

    const accounts = await dsa.getAccounts(address);
    // console.log(accounts[0].id);
    const dsaId = accounts[0].id;
    await dsa.setInstance(dsaId);
    let spells = dsa.Spell({
        gasPrice: web3.utils.toWei('0.000000100000000000', 'ether'),// estimated gas price
    });

    await spells.add({
        connector: "compound",
        method: "deposit",
        args: [
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          "1000000000000000000", // 1 ETH (10^18 wei)
          0,
          0
        ]
      })
    console.log(spells.data[0].args);
    // let transactionHash = await spells.cast({
    //     gasPrice: web3.utils.toWei('0.000000100000000000', 'ether'),// estimated gas price
    // });
    // console.log(transactionHash);

    spells.cast({
        gasPrice: web3.utils.toWei('1000000', 'gwei'), // in gwei, used in node implementation.
        value: "10000000000000000000" // sending 1 Eth along the transaction.
      }).then(console.log);
}

castSpells();