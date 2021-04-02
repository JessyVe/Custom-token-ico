/**
 * This test class verifies the delegate transfer logic of the custom token. 
 * 
 * accounts are provide by the locally running Ganache instance (configured in truffle-config.js)
 * accounts[0] => contains the initial coin supply
 */

 const CUSTOM_TOKEN = artifacts.require("CustomToken");

 const INITIAL_COIN_SUPPLY = 100;
 const SMALLEST_TRANSFER_QUANTITY = 1;
 
 contract('CustomToken', function(accounts){ 
 
    const _fromAccount = accounts[0];
    const _approvedAccount = accounts[1];
    const _spendingAccount = accounts[2];

    it('approves tokens for delegated transfers', function(){
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;
            // .call does not create any transactions
            return tokenInstance.approve.call(_approvedAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount });
        }).then(function(success){
            assert.equal(success, true, 'it returns true if transfer was successfully approved');
        })
    });

    it('emits the approve event and creates allowance for a delegated transfer', function() {
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;            
            return tokenInstance.approve(_approvedAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount });        
        }).then(function(receipt){   
            assert.equal(receipt.logs.length, 1, 'triggers one event'); 
            assert.equal(receipt.logs[0].event, 'Approval', 'event is a "Approval"-event');
            assert.equal(receipt.logs[0].args._owner, _fromAccount, 'the owner account is set correctly');
            assert.equal(receipt.logs[0].args._spender, _approvedAccount, 'the spender account is set correctly');
            assert.equal(receipt.logs[0].args._value, SMALLEST_TRANSFER_QUANTITY, 'the amount transfered is set correctly');
            
            return tokenInstance.allowance(_fromAccount, _approvedAccount);       
        }).then(function(allowance){   
            assert.equal(allowance.toNumber(), SMALLEST_TRANSFER_QUANTITY, 'created an allowance to spend tokens'); 
        });
    });

    it('throws an exception if more tokens are requested be transferd then present on a given account', function(){
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;            
            return tokenInstance.transferFrom.call(_fromAccount, _approvedAccount, INITIAL_COIN_SUPPLY + SMALLEST_TRANSFER_QUANTITY, { from: _spendingAccount });        
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to transfer amount larger than balance');
        });
    });

    it('throws an exception if more tokens are requested to be transferd then approved', function(){
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;                  
            return tokenInstance.approve(_spendingAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount})
        }).then(function(receipt){
            return tokenInstance.transferFrom.call(_fromAccount, _approvedAccount, SMALLEST_TRANSFER_QUANTITY * 2, { from: _spendingAccount });        
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to transfer amount larger than approved');
        });
    });

    it('transfer the approved amount of tokens between two accounts', function(){
        return CUSTOM_TOKEN.deployed().then(function(instance){
            tokenInstance = instance;                  
            return tokenInstance.approve(_spendingAccount, SMALLEST_TRANSFER_QUANTITY, { from: _fromAccount})
        }).then(function(receipt){
            return tokenInstance.transferFrom.call(_fromAccount, _approvedAccount, SMALLEST_TRANSFER_QUANTITY, { from: _spendingAccount });
        }).then(function(success){
           assert.equal(success, true);
           return tokenInstance.transferFrom(_fromAccount, _approvedAccount, SMALLEST_TRANSFER_QUANTITY, { from: _spendingAccount });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event'); 
            assert.equal(receipt.logs[0].event, 'Transfer', 'event is a "Transfer"-event');
            assert.equal(receipt.logs[0].args._from, _fromAccount, 'the from account is set correctly');
            assert.equal(receipt.logs[0].args._to, _approvedAccount, 'the approved account is set correctly');
            assert.equal(receipt.logs[0].args._value, SMALLEST_TRANSFER_QUANTITY, 'the amount transfered is set correctly');
            return tokenInstance.balanceOf(_approvedAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), SMALLEST_TRANSFER_QUANTITY, 'transfers the defined amount of tokens between the given accounts');
            return tokenInstance.balanceOf(_fromAccount)
        }).then(function(balance){
            assert.equal(balance.toNumber(), INITIAL_COIN_SUPPLY - SMALLEST_TRANSFER_QUANTITY, 'transfers the defined amount of tokens between the given accounts');
            return tokenInstance.allowance(_fromAccount, _spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'the allowance has been reset')
        });
    });
});