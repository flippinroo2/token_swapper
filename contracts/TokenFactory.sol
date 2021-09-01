//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Token.sol';

contract TokenFactory {
    using Address for address;
    using Arrays for string[];
    using SafeMath for uint256;
    using Strings for string;

    string[] private tokenSymbols_;

    address private _admin;
    mapping(string => address) private _tokenAddresses;
    mapping(address => string) private _tokenSymbols;

    event TokenCreated(address indexed tokenAddress, string indexed name, string indexed symbol, uint256 decimals, uint256 totalSupply);

    // struct TokenMapping {
    //     string name;
    //     string symbol;
    //     address tokenAddress;
    // }

    constructor() {
        address admin = msg.sender;
        _admin = admin;
    }

    function getNumberOfTokens() external view returns (uint) {
        return tokenSymbols_.length;
    }

    function getTokenSymbols() external view returns (string[] memory){
        return tokenSymbols_;
    }

    function getTokenAddressFromSymbol(string memory symbol_) external view returns (address tokenAddress){
        return _tokenAddresses[symbol_];
    }

    function getTokenNameFromSymbol(address address_) external view returns (string memory name) {
        return _tokenSymbols[address_];
    }

    function createToken(string memory name, string memory symbol, uint256 decimals, uint256 totalSupply) public returns (Token) {
        Token token = new Token(name, symbol, decimals, totalSupply);
        address tokenAddress = address(token);
        tokenSymbols_.push(symbol);
        _tokenAddresses[symbol] = tokenAddress;
        _tokenSymbols[tokenAddress] = symbol;
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }
}
