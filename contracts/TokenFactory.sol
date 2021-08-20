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

    bool private constant DEBUG = false;

    address private _admin;

    address[] public _tokenAddresses;
	string[] public _tokenNames;

    mapping(address => uint256) private _tokens;

    struct tokenData {
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    // Events
    event TokenCreated(address indexed tokenAddress, string indexed name, string indexed symbol, uint8 decimals, uint256 totalSupply);

    constructor() payable {
        address admin = msg.sender;
        if (DEBUG) {
            console.log('Contract creator: %s', admin);
            console.log('constructor()');
        }
    }

    function createToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public returns (Token) {
        if (DEBUG) {
            console.log('name: %s\nsymbol: %s', name, symbol);
            console.log('decimals');
            console.log(decimals);
            console.log('totalSupply');
            console.log(totalSupply);
        }
        tokenData memory metadata = tokenData(name, symbol, decimals, totalSupply); // Check the difference between "storage" and "memory".
        Token token = new Token(name, symbol, decimals, totalSupply);
        // See how to get the address from the call above and then use the other version of the "TokenCreated" event.
        address tokenAddress = address(token);
        _tokenAddresses.push(tokenAddress);
        _tokenNames.push(name);
        // console.log('tokenAddress: %s', tokenAddress);
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }

    function getAddresses() external view returns (address[] memory) {
        return _tokenAddresses;
    }

    function getAddressCount() external view returns (uint256) {
        return _tokenAddresses.length;
    }

    function testFunction() external view {
        // address admin = getAdmin();
        // console.log('admin: %s', admin);
    }

    // receive() external payable {
    //     emit Fallback(msg.sender, msg.value);
    // }
}
