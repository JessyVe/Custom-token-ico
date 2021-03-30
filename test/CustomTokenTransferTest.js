/**
 * This test class verifies the transfer logic of the custom token. 
 * 
 * accounts are provide by the locally running Ganache instance (configured in truffle-config.js)
 * accounts[0] => contains the initial coin supply
 */

const CUSTOM_TOKEN = artifacts.require("CustomToken");

const INITIAL_COIN_SUPPLY = 100;
const SMALLEST_TRANSFER_QUANTITY = 1;

contract('CustomToken', function(accounts){ 

    const _fromAccount = accounts[0];
    const _toAccount = accounts[1];

    it('transfers the defined amount of tokens between the given accounts', function() {
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;            
            return tokenInstance.transfer(_toAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount });        
        }).then(function(receipt){   
            assert.equal(receipt.logs.length, 1, 'triggers one event'); 
            assert.equal(receipt.logs[0].event, 'Transfer', 'event is a "Transfer"-event');
            assert.equal(receipt.logs[0].args._from, _fromAccount, 'the from account is set correctly');
            assert.equal(receipt.logs[0].args._to, _toAccount, 'the to account is set correctly');
            assert.equal(receipt.logs[0].args._value, SMALLEST_TRANSFER_QUANTITY, 'the amount transfered is set correctly');
            return tokenInstance.balanceOf(_toAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), SMALLEST_TRANSFER_QUANTITY, 'transfers the defined amount of tokens between the given accounts');
        });
    });

    it('throws an exception if more tokens are requested to be transferd then present on a given account', function() {
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;
            // .call does not create any transactions
            return tokenInstance.transfer.call(_toAccount, INITIAL_COIN_SUPPLY + SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount });        
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to transfer amount larger than balance');
        });
    });

    it('returns true if transfer was successful', function() {
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;
            // .call does not create any transactions
            return tokenInstance.transfer.call(_toAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount });        
        }).then(function(success){
            assert.equal(success, true, 'it returns true if transfer was successful');
        });
    });
});
