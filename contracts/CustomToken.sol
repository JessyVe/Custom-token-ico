pragma solidity ^0.5.16;

import "./IERC20.sol";

contract CustomToken is IERC20 {
    // OPTINAL properties
    string public name = "CustomToken";
    string public symbol = "CT";

    // MANDEDORY properties
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events the contract emits
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

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

    // Delegated Transfer

    /// Allow an account to spend tokens on the behave of another account.
    /// e.g. approve an exchange to spend from an account
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        address _from = msg.sender;
        allowance[_from][_spender] = _value;

        emit Approval(_from, _spender, _value);

        return true;
    }

    /// Handles the delegate transfer of the approved amount.
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        address _spender = msg.sender;
        require(allowance[_from][_spender] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][_spender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
