const VeriffKyc = artifacts.require("VeriffKyc");

module.exports = function (deployer) {
    deployer.deploy(VeriffKyc);
};
