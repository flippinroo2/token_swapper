//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Token.sol';

contract TokenFactory {
    using Address for address;
    using Arrays for string[];
    using SafeMath for uint256;
    using Strings for string;

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
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }
}
