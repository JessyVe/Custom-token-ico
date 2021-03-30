/**
 *  accounts[0] => contains the initial coin supply
 */

const CustomToken = artifacts.require("CustomToken");

const initialCoinSupply = 100;
const smallestTransferQuantity = 1;

contract('CustomToken', function(accounts){ 

    it('transfers the defined amount of tokens between the given accounts', function() {

        const _fromAccount = accounts[0];
        const _toAccount = accounts[1];
        const _transferAmount = 1;

        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;            
            return tokenInstance.transfer(_toAccount, _transferAmount, { from: _fromAccount });        
      
        }).then(function(receipt){   
            
            assert.equal(receipt.logs.length, 1, 'triggers one event'); 
            assert.equal(receipt.logs[0].event, 'Transfer', 'event is a "Transfer"-event');
            assert.equal(receipt.logs[0].args._from, _fromAccount, 'the from account is set correctly');
            assert.equal(receipt.logs[0].args._to, _toAccount, 'the to account is set correctly');
            assert.equal(receipt.logs[0].args._value, _transferAmount, 'the amount transfered is set correctly');
            
            return tokenInstance.balanceOf(_toAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), _transferAmount, 'transfers the defined amount of tokens between the given accounts');
        });
    });


    it('throws an exception if more tokens are meant to be transferd then present on a given account', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            // .call does not create any transactions
            return tokenInstance.transfer.call(accounts[1], initialCoinSupply + smallestTransferQuantity, { from: accounts[0] });        
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        });
    });

    it('returns true if transfer was successful', function() {
        return CustomToken.deployed().then(function(instance){
            tokenInstance = instance;
            // .call does not create any transactions
            return tokenInstance.transfer.call(accounts[1], smallestTransferQuantity, { from: accounts[0] });        
        }).then(function(success){
            assert.equal(success, true, 'it returns true if transfer was successful');
        });
    });
})
