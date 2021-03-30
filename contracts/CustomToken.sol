pragma solidity ^0.5.16;

contract CustomToken {
    // OPTINAL properties
    string public name = "CustomToken";
    string public symbol = "CT";

    // MANEDORY properties
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    // Events the contract emits
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(uint256 _initialCoinSupply) public {
        totalSupply = _initialCoinSupply;
        // the tokens have to have a starting point
        // allocate the initial supply
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        address _from = msg.sender;
        require(balanceOf[_from] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
