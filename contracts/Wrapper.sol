//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
// import '@openzeppelin/contracts/token/ERC20/IERC20.sol'
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Math
// import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Custom Tokens
import './Swap.sol'; // Swap Utility Token
import './Template.sol'; // Template
import './Token.sol'; // Token

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address public _admin;
    address public contractAddress;
    address public _address1;
    address public _address2;

    Swap public _fujiTateSwapper;
    Swap public _hakuTateSwapper;

    string[] fujiArgs = ['Fuji', 'FUJI'];
    string[] hakuArgs = ['Haku', 'HAKU'];
    string[] tateArgs = ['Tate', 'TATE'];

    Template public _fuji = new Token(fujiArgs[0], fujiArgs[1], 1100);
    Template public _haku = new Token(hakuArgs[0], hakuArgs[1], 1050);
    Template public _tate = new Token(tateArgs[0], tateArgs[1], 1000);

    constructor(address address1_, address address2_) {
        _admin = msg.sender;
        contractAddress = address(this);
        _address1 = address1_;
        _address2 = address2_;
        _fujiTateSwapper = new Swap(_address1, _fuji, _address2, _tate);
        _hakuTateSwapper = new Swap(_address1, _haku, _address2, _tate);
    }

    function swap(uint256 amount) external {
        console.log('swap(uint256 amount %s)', amount);
        _fujiTateSwapper._swap(amount);
    }

    function unswap(uint256 amount) external {
        console.log('unswap(uint amount %s)', amount);
        _hakuTateSwapper._swap(amount);
    }
}
