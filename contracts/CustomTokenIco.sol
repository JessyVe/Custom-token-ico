pragma solidity ^0.5.16;

import "./IERC20.sol";

contract CustomTokenIco {
    address ownerAddress;

    IERC20 public erc20TokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address indexed _buyer, uint256 _amount);

    constructor(IERC20 _erc20TokenContract, uint256 _tokenPrice) public {
        ownerAddress = msg.sender; // deployer of the contract

        erc20TokenContract = _erc20TokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _amount) public payable {
        require(msg.value == _amount * tokenPrice);
        require(erc20TokenContract.balanceOf(address(this)) >= _amount);

        require(erc20TokenContract.transfer(msg.sender, _amount));

        tokensSold += _amount;
        emit Sell(msg.sender, _amount);
    }

    function endSale() public {
        require(msg.sender == ownerAddress);
        require(
            erc20TokenContract.transfer(
                ownerAddress,
                erc20TokenContract.balanceOf(address(this))
            )
        );
        selfdestruct(msg.sender);
    }
}
