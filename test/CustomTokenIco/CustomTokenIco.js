/**
 * This test class verifies the delegate transfer logic of the custom token. 
 * 
 * accounts are provide by the locally running Ganache instance (configured in truffle-config.js)
 * accounts[0] => contains the initial coin supply and is the account with which contracts get deployed
 */
const CUSTOM_TOKEN_ICO = artifacts.require('CustomTokenIco');
const CUSTOM_TOKEN = artifacts.require('CustomToken');

contract('CustomTokenIco', function(accounts){

    var icoInstance;

    const adminAccount = accounts[0];
    const buyer = accounts[5];

    const tokenPrice = 1000000000000000; // in wei (= 0.001 Ether)
    const tokensAvailable = 100; // is equal to the total supply of tokens
    const buyTokenAmount = 1;

    it('initializes the contract with the correct values', function(){
        return CUSTOM_TOKEN_ICO.deployed().then(function(instance){
            icoInstance = instance;
            return icoInstance.adminAddress;
        }).then(function(adminAddress){
            assert.notEqual(adminAddress, 0x0, 'admin has address');
            return icoInstance.erc20Contract;            
        }).then(function(contractAddress){
            assert.notEqual(contractAddress, 0x0, 'token contract has address');
            return icoInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price, tokenPrice, 'token price was set')
        })
    });

    it('rejects underpay', function(){
        return CUSTOM_TOKEN_ICO.deployed().then(function(instance){
            icoInstance = instance;           
            return icoInstance.buyTokens(buyTokenAmount, {from: buyer, value: 0 });
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to underpay for tokens');
        });
    });

    it('rejects overpay', function(){
        return CUSTOM_TOKEN_ICO.deployed().then(function(instance){
            icoInstance = instance;           
            return icoInstance.buyTokens(buyTokenAmount, {from: buyer, value: (buyTokenAmount * tokenPrice) * 2 });
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to overpay for tokens');
        });
    });

    it('rejects buying more tokens than available', function(){

        // -- START SETUP: Provision tokens to ICO -- //
        return CUSTOM_TOKEN.deployed().then(function(instance){
            customTokenInstance = instance;
            return CUSTOM_TOKEN_ICO.deployed();
        }).then(function(instance){
            icoInstance = instance;              
            return customTokenInstance.transfer(icoInstance.address, tokensAvailable, {from: adminAccount});
         // -- END SETUP -- //

        }).then(function(receipt){
            // buy an acceptable amount of tokens
            return icoInstance.buyTokens(buyTokenAmount, {from: buyer, value: (buyTokenAmount * tokenPrice) });
        }).then(function(receipt){   
            assert.equal(receipt.logs.length, 1, 'triggers one event'); 
            assert.equal(receipt.logs[0].event, 'Sell', 'event is a "Sell"-event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'the buyer account is set correctly');
            assert.equal(receipt.logs[0].args._amount, buyTokenAmount, 'the sold amount is set correctly');
            return icoInstance.tokensSold();
        }).then(function(tokensSold){
            assert.equal(tokensSold.toNumber(), buyTokenAmount);
            return customTokenInstance.balanceOf(buyer);
        }).then(function(balance){
            assert.equal(balance.toNumber(), buyTokenAmount);
            return customTokenInstance.balanceOf(icoInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), (tokensAvailable - buyTokenAmount));
            // buy an unacceptable amount of tokens
            return icoInstance.buyTokens((tokensAvailable + 1), {from: buyer, value: (tokensAvailable + 1) * tokenPrice });
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to buy more tokens than available');
        });
    });   

    it('ends the token sale', function(){
         return CUSTOM_TOKEN.deployed().then(function(instance){
            customTokenInstance = instance;
            return CUSTOM_TOKEN_ICO.deployed();
        }).then(function(instance){
            icoInstance = instance;                       
            return icoInstance.endSale( { from: buyer } );
        }).then(assert.fail).catch(function(error){
            // 'revert' is part of the error message returned by 'require' by default 
            assert(error.message.indexOf('revert') >= 0, 'fail to end token sale by unauthorized  account');
            return icoInstance.endSale( { from: adminAccount } );
        }).then(function(receipt){ 
            return customTokenInstance.balanceOf(adminAccount);
        }).then(function(balance){ 
            assert.equal(balance.toNumber(), (tokensAvailable - buyTokenAmount), 'returns all unsold tokens to the admin')
            return icoInstance.tokenPrice();
        }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf('Out of Gas') >= 0, 'fail to call any method after selfdestruct');
        })
    });    
});