console.log("App.js loaded");

App = {
    
    loading: false,

    web3Provider: null, 
    contracts: {},

    // user data
    userAccountAddress: '0x0',
    userAccountBalance: -1,

    // ico contract data
    tokenPrice: 1000000000000000,
    tokensSold: -1,
    tokenSupply: -1,

    init: function(){
        
        return App.initWeb3();
    },

    initWeb3: function(){
        if(typeof web3 !== 'undefined') {
            // if a web3 instance is already provided by Mata Mask
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider)
        } else {
            // specify default instance if no web3 instance is provided
            // Ganache configuration
            App.web3Provider = Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider)
        }
        return App.initTruffleContract();
    }, 

    initTruffleContract: function(){
        $.getJSON("CustomTokenIco.json", function(customTokenIco){
            App.contracts.CustomTokenIco = TruffleContract(customTokenIco);
            App.contracts.CustomTokenIco.setProvider(App.web3Provider);
            App.contracts.CustomTokenIco.deployed().then(function(customTokenIco){
                console.log("ICO contract address: ", customTokenIco.address);
            });
        }).done(function(){
            $.getJSON("CustomToken.json", function(customToken){
                App.contracts.CustomToken = TruffleContract(customToken);
                App.contracts.CustomToken.setProvider(App.web3Provider);
                App.contracts.CustomToken.deployed().then(function(customToken){
                    console.log("Token contract address: ", customToken.address);
                });               
        }).done(function(){
            App.listenForSellEvent();
            return App.render();
        });
    });
    }, 

    render: function(){

        if(App.loading){
            return;
        }
        App.loading = true;

        var loadingScreen = $('#loading-screen').eq(0);
        var pageContent = $('#page-content').eq(0);

        loadingScreen.show();   
        pageContent.hide();

        web3.eth.getCoinbase(function(err, account){
        if(err === null){
            App.userAccountAddress = account;
            document.getElementById('user-account-address').textContent = App.userAccountAddress;
            } else {
                console.log(err);
            }
        })
        
        App.contracts.CustomTokenIco.deployed().then(function(instance){
            icoInstance = instance; 
            return icoInstance.tokenPrice();
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice.toNumber();
            document.getElementById('token-price').textContent = web3.utils.fromWei(App.tokenPrice.toString(), 'ether');
            return icoInstance.tokensSold();
        }).then(function(tokensSold){
            App.tokensSold = tokensSold.toNumber();
            document.getElementById('tokens-sold').textContent = App.tokensSold;

            App.contracts.CustomToken.deployed().then(function(instance){
                tokenInstance = instance; 
                return tokenInstance.totalSupply();
            }).then(function(totalSupply){
                App.tokenSupply = totalSupply.toNumber();
                document.getElementById('token-supply').textContent = App.tokenSupply;
            }).then(function(){
                const progressPercent = (App.tokensSold / App.tokenSupply) * 100;    
                $('#progressBar').eq(0).css('width', progressPercent + '%');
                return tokenInstance.balanceOf(App.userAccountAddress);
            }).then(function(balance){
                App.userAccountBalance = balance.toNumber();
                document.getElementById('user-account-balance').textContent = App.userAccountBalance;
            }).then(function(){
                App.loading = false;
                loadingScreen.hide();
                pageContent.show();  
            });
        });
    },

    listenForSellEvent: function(){
        App.contracts.CustomTokenIco.deployed().then(function(instance){
            icoInstance = instance; 

            icoInstance.contract.events.Sell({
                fromBlock: 0, 
                toBlock: 'latest'                
            },
            (error, event) => {
                if(error === null) {
                    console.log('Sell event was triggered in the ico contract.', event);
                    App.render(); // reload the page
                } else {
                    console.log(error);
                }
            })
        })
    },

    buyTokens: function(){
        var loadingScreen = $('#loading-screen').eq(0);
        var pageContent = $('#page-content').eq(0);

        loadingScreen.show();   
        pageContent.hide();

        const tokenAmount = $('#token-amount').eq(0).val();
        console.log(tokenAmount);

        App.contracts.CustomTokenIco.deployed().then(function(instance){
            icoInstance = instance; 
            return icoInstance.buyTokens(tokenAmount, { from: App.userAccountAddress, value: (tokenAmount * App.tokenPrice), gas: 500000 });
        }).then(function(result){
           console.log('tokens bought', result);           
        });
    }    
}

$(function() {
    $(window).load(function() {
        window.ethereum.enable();
        App.init();
    });
});