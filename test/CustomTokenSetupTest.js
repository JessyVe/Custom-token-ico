/**
 * This test class verifies the basic setup of the custom token. 
 * 
 * accounts are provide by the locally running Ganache instance (configured in truffle-config.js)
 * accounts[0] => contains the initial coin supply
 */

const CustomToken = artifacts.require("CustomToken");

const INITIAL_COIN_SUPPLY = 100;
const TOKEN_NAME = 'CustomToken';
const TOKEN_SYMBOL = 'CT';

contract('CustomToken', function(accounts){ 

    it('initializes the contract with the specified name', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();        
        }).then(function(name){
            assert.equal(TOKEN_NAME, name, 'initializes the contract with the specified name')
        });
    });   

    it('initializes the contract with the specified symbol', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.symbol();        
        }).then(function(symbol){
            assert.equal(symbol, TOKEN_SYMBOL, 'initializes the contract with the specified symbol')
        });
    });   

    it('sets the total supply upon deplyoment', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), INITIAL_COIN_SUPPLY, 'sets the total supply upon deplyoment');
        });
    });

    it('allocates the initial coin supply to the first account', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);        
        }).then(function(startingBalance){
            assert.equal(startingBalance.toNumber(), INITIAL_COIN_SUPPLY, 'allocates the initial coin supply to the first account')
        });
    });  
    
    it('transfers a given amount custom tokens from one account to another account', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.balanceOf(accounts[0]);        
        }).then(function(startingBalance){
            assert.equal(startingBalance.toNumber(), INITIAL_COIN_SUPPLY, 'allocates the initial coin supply to the first account')
        });
    });
})
