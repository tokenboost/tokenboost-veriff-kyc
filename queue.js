require("dotenv").config();
const NETWORK = process.env.NETWORK || 'mainnet';
const HDWalletProvider = require("truffle-hdwallet-provider");
const HDWalletAccounts = require("hdwallet-accounts");
const kue = require("kue");
const Web3 = require('web3');
const contract = require('truffle-contract');
const VeriffKyc = contract(require('./build/contracts/VeriffKyc.json'));

let host = NETWORK === 'mainnet' ? "https://infura.io/" : "https://" + NETWORK + ".infura.io/";
let provider = new HDWalletProvider(process.env.MNEMONIC, host + process.env.INFURA_ACCESS_TOKEN);
VeriffKyc.setProvider(provider);

let accounts = HDWalletAccounts(10, process.env.MNEMONIC).accounts;
VeriffKyc.defaults({from: accounts[0].address, gasPrice: 20000000000});

const queue = kue.createQueue({
    redis: process.env.REDIS_URL
});

queue.process("approved", async (job, done) => {
    try {
        let veriffKyc = await VeriffKyc.deployed();

        let web3 = new Web3(provider);
        let countryCodeHex = web3.toHex(job.data.countryCode.toLowerCase());
        let hash = web3.sha3(job.data.address + countryCodeHex.substr(2), {encoding: 'hex'});
        await Promise.all([
            await veriffKyc.registerAddressCountryCodeHash(hash),
            await veriffKyc.updateStatusOf(job.data.address, 1)
        ]);
        done();
    } catch (e) {
        done(e);
    }
});
queue.process("resubmission_requested", async (job, done) => {
    try {
        let veriffKyc = await VeriffKyc.deployed();
        await veriffKyc.updateStatusOf(job.data.address, 2);
        done();
    } catch (e) {
        done(e);
    }
});
queue.process("declined", async (job, done) => {
    try {
        let veriffKyc = await VeriffKyc.deployed();
        await veriffKyc.updateStatusOf(job.data.address, 3);
        done();
    } catch (e) {
        done(e);
    }
});
queue.process("expired", async (job, done) => {
    try {
        let veriffKyc = await VeriffKyc.deployed();
        await veriffKyc.updateStatusOf(job.data.address, 4);
        done();
    } catch (e) {
        done(e);
    }
});
queue.process("abandoned", async (job, done) => {
    try {
        let veriffKyc = await VeriffKyc.deployed();
        await veriffKyc.updateStatusOf(job.data.address, 5);
        done();
    } catch (e) {
        done(e);
    }
});
