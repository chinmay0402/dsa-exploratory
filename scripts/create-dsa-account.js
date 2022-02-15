const Web3 = require('web3');
const DSA = require('dsa-connect');
require('dotenv').config();
const ETH_NODE_URL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL)); // to enable web3 calls via SDK

const dsa = new DSA({
    web3: web3,
    mode: "node",
    privateKey: process.env.PRIVATE_KEY
});

const buildAccount = async () => {
    const account = await dsa.build({
        gasPrice: web3.utils.toWei('0', 'ether') // estimated gas price
        // origin: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        // authority: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    });
}
buildAccount();
