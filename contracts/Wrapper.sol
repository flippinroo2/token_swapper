//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Custom Tokens
import './Swap.sol'; // Swap Utility Contract
import './Template.sol'; // Template Conract
import './Token.sol'; // Token Contract

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;
    address public contractAddress;
    address private _address1;
    address private _address2;

    Swap private _fujiTateSwapper;
    Swap private _hakuTateSwapper;

    // Was testing a different method for instantiating the Swap contract.
    string[] fujiArgs = ['Fuji', 'FUJI'];
    string[] hakuArgs = ['Haku', 'HAKU'];
    string[] tateArgs = ['Tate', 'TATE'];

    Template private _fuji = new Token(fujiArgs[0], fujiArgs[1], 1100);
    Template private _haku = new Token(hakuArgs[0], hakuArgs[1], 1050);
    Template private _tate = new Token(tateArgs[0], tateArgs[1], 1000);

    constructor(address address1_, address address2_) {
        _admin = msg.sender;
        contractAddress = address(this);
        _address1 = address1_;
        _address2 = address2_;
        _fujiTateSwapper = new Swap(_address1, _fuji, _address2, _tate);
        _hakuTateSwapper = new Swap(_address1, _haku, _address2, _tate);
    }

    function swap(uint256 amount) public view {
        console.log('swap(uint256 amount %s)', amount);
        _fujiTateSwapper._swap(amount);
    }

    function unswap(uint256 amount) public view {
        console.log('unswap(uint amount %s)', amount);
        _hakuTateSwapper._swap(amount);
    }
}
