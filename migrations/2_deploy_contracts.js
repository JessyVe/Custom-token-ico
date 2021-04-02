const CustomToken = artifacts.require('CustomToken');
const CustomTokenIco = artifacts.require('CustomTokenIco');

const initialCoinSupply = 100;
const tokenPrice = 1000000000000000;

module.exports = function (deployer) {
  deployer.deploy(CustomToken, initialCoinSupply).then(function() {    
    return deployer.deploy(CustomTokenIco, CustomToken.address, tokenPrice);
  });
};
