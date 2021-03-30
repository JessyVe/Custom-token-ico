const CustomToken = artifacts.require("CustomToken");

const initialCoinSupply = 100;

module.exports = function (deployer) {
  deployer.deploy(CustomToken, initialCoinSupply);
};
