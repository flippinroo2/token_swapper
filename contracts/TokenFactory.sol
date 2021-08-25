//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Custom Contracts
import './Token.sol'; // Token

contract TokenFactory {
    using Address for address;
    using Arrays for string[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    address private _admin;

    mapping(string => address) private _tokens;

    event TokenCreated(address indexed tokenAddress, string indexed name, string indexed symbol, uint256 decimals, uint256 totalSupply);

    constructor() {
        address admin = msg.sender;
        _admin = admin;
    }

    function createToken(string memory name, string memory symbol, uint256 decimals, uint256 totalSupply) public returns (Token) {
        Token token = new Token(name, symbol, decimals, totalSupply);
        address tokenAddress = address(token);
        _tokens[symbol] = tokenAddress;
        if(DEBUG){
            console.log('\ncreateToken()');
            console.log('string name: %s, string symbol: %s', name, symbol);
            console.log('totalSupply');
            console.log(totalSupply);
        }
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }
}
