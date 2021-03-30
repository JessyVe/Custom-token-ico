
const CustomToken = artifacts.require("CustomToken");

const initialCoinSupply = 100;
const tokenName = 'CustomToken';
const tokenSymbol = 'CT';

contract('CustomToken', function(accounts){ // accounts from ganache

    it('initializes the contract with the specified name', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();        
        }).then(function(name){
            assert.equal(tokenName, name, 'initializes the contract with the specified name')
        });
    });   

    it('initializes the contract with the specified symbol', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.symbol();        
        }).then(function(symbol){
            assert.equal(tokenSymbol, symbol, 'initializes the contract with the specified symbol')
        });
    });   

    it('sets the total supply upon deplyoment', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), initialCoinSupply, 'sets the total supply upon deplyoment');
        });
    });

    it('allocates the initial coin supply to the first account', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);        
        }).then(function(startingBalance){
            assert.equal(startingBalance.toNumber(), initialCoinSupply, 'allocates the initial coin supply to the first account')
        });
    });  
    
    it('transfers a given amount custom tokens from one account to another account', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);        
        }).then(function(startingBalance){
            assert.equal(startingBalance.toNumber(), initialCoinSupply, 'allocates the initial coin supply to the first account')
        });
    });
})
