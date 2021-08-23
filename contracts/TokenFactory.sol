//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Custom Contracts
import './Token.sol'; // Token

contract TokenFactory {
    using Address for address;
    using Arrays for string[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = true;

    address public _admin;

    address[] public _tokenAddresses;
	string[] public _tokenNames;

    mapping(address => uint256) private _tokens;

    struct tokenData {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    event TokenCreated(address indexed tokenAddress, string indexed name, string indexed symbol, uint8 decimals, uint256 totalSupply);

    constructor() payable {
        address admin = msg.sender;
        _admin = admin;
    }

    function createToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public returns (Token) {
        tokenData memory metadata = tokenData(name, symbol, decimals, totalSupply);
        Token token = new Token(name, symbol, decimals, totalSupply);
        address tokenAddress = address(token);
        _tokenAddresses.push(tokenAddress);
        _tokenNames.push(name);
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }
}
