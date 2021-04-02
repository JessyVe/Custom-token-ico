# Custom Token ICO

**EDUCATION Repository**

This Repository is part of an educational course of University of Applied Science - [FH JOANNEUM GmbH](https://www.fh-joanneum.at/).

Bachelor program: Mobile Software Development (FH JOANNEUM)

<br>

## Introduction
This repository holds an implementation of an [ICO](https://de.wikipedia.org/wiki/Initial_Coin_Offering) (= Initial Coin Offering). It contains a backend consiting of two smart contracts written in Solidity as well as a javascript frontend. The project was developed and tested with [Truffel](https://www.trufflesuite.com/) on Windows 10.

<br>

## Building the project
In order to build and run the project locally the following steps need to be taken.

<br>

### Preconditions

1. Truffle is installed (see [Truffle installation](https://www.trufflesuite.com/docs/truffle/getting-started/installation))
   ```
   npm install -g truffle
   ```

2. In order to run and test the project a (local) blockchain needs to be accessible. During the development [Ganache](https://www.trufflesuite.com/docs/ganache/overview) was used. If a different connection information schould be established the `truffle-config.js` needs to be adjusted (currently set to Ganache defaults).

3. For the purpose of sending tokens on the blockchain [MetaMask](https://metamask.io/) is used (see [MetaMask Chrome extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)). 
   
   **Setup Metamask (Ganache must be running)**
      1. Change Network
         1. Select "Custom RPC" from the available networks 
         2. Enter network data for local Ganache instance
         3. Save Changes
      2. Import account from Ganache
         1. Open the accounts panel and select "Import account"
         2. Enter the private key from a Ganache account
         3. Save Changes
      3. The first time the site is called MetaMask will ask to connect to the configured network. Accept and continued.


         **Note:** [Setup Ganache with Metamask. What and where is a Chain ID?](https://ethereum.stackexchange.com/a/91074)

<br>


### Backend  
Make sure that Ganache is running on your local machine.

**Execute tests**
```
npx truffle test
```
**Deploy**
```
npx truffle migrate 
```
**Update**
```
npx truffle migrate --reset
```

<br>

### Frontend


**Provision tokens from the token contract to the ICO contract**

Execute the following commands in the console:
```
npx truffle console
CustomTokenIco.deployed().then(function(instance) { icoInstance = instance; } )
CustomToken.deployed().then(function(instance) { tokenInstance = instance; } )
```
**Note:** The calls are supposed to return `undefined`. The instances can be accessed be typing in their name and hitting enter.

```
tokenSupply = 100
adminAccount = (await web3.eth.getAccounts())[0]
tokenInstance.transfer(icoInstance.address, tokenSupply, { from: adminAccount })
```

**Install frontend dependencies**

```
npm install
```

**Single Dependencies**
```
npm install lite-server --save-dev
npm install bootstrap@3 
npm i web3 
npm i truffle-contract
```
Documentations:
- Development only node server: [lite-server](https://www.npmjs.com/package/lite-server)
- Responsive and modern web frontend: [bootstrap@3](https://getbootstrap.com/docs/3.4/getting-started/)
- Communication to a blockchain: [web3](https://www.npmjs.com/package/web3)
- Interpreting [ABIs](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html): [truffle-contract](https://www.npmjs.com/package/@truffle/contract?activeTab=versions)


<br>

## Resources

**Solidity Development**
- [Solidity v0.5.16](https://docs.soliditylang.org/en/v0.5.16/index.html)
- [Dapp University](https://www.youtube.com/channel/UCY0xL8V6NzzFcwzHCgB8orQ)
- [Invalid type for argument in function call. Invalid implicit conversion from address to address payable requested](https://ethereum.stackexchange.com/a/65873)

    **Alternatives to selfdestruct-call**
    - [Selfdestruct is a Bug.](https://blog.b9lab.com/selfdestruct-is-a-bug-9c312d1bb2a5)
    - [how to disable a contract by changing some internal state which causes all functions to revert?](https://ethereum.stackexchange.com/a/82204)

**Frontend**
- [Bootstrap getting started](https://getbootstrap.com/docs/3.4/getting-started/)
- [Not accessing metamask address through web3.eth.getCoinbase](https://ethereum.stackexchange.com/a/84530)
- [jQuery show() not a function - used in adding DOM elements](https://stackoverflow.com/a/31358977/11389980)
- [Error Truffle Console: web3.fromWei is not a function](https://ethereum.stackexchange.com/a/90667)


**Interesting facts along the way**
- [What's the difference between tilde(~) and caret(^) in package.json?](https://stackoverflow.com/a/39789894/11389980)
- [npm vs npx — What’s the Difference?](https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/)