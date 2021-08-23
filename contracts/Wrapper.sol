//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Token
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Custom Tokens
import './Template.sol'; // Template Contract
import './Token.sol'; // Token Contract
import './Swap.sol'; // Swap Contract

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = true;

    address public _admin;
    address public contractAddress;
    address public _address1;
    address public _address2;

    Swap public _fujiTateSwapper;
    Swap public _hakuTateSwapper;

    // Was testing a different method for instantiating the Swap contract.
    // string[] fujiArgs = ['Fuji', 'FUJI'];
    // string[] hakuArgs = ['Haku', 'HAKU'];
    // string[] tateArgs = ['Tate', 'TATE'];

    // Template private _fuji = new Token(fujiArgs[0], fujiArgs[1], 18, 1100);
    // Template private _haku = new Token(hakuArgs[0], hakuArgs[1], 18, 1050);
    // Template private _tate = new Token(tateArgs[0], tateArgs[1], 18, 1000);

    constructor(address address1_, address address2_) {
        address admin = msg.sender;
        _admin = admin;
        contractAddress = address(this);
        _address1 = address1_;
        _address2 = address2_;
    }

    function createFujiSwap(Token _fuji, Token _tate) public returns (Swap) {
        _fujiTateSwapper = new Swap(_address1, _fuji, _address2, _tate);
        return _fujiTateSwapper;
    }

    function createHakuSwap(Token _haku, Token _tate) public returns (Swap) {
        _hakuTateSwapper = new Swap(_address1, _haku, _address2, _tate);
        return _hakuTateSwapper;
    }

    function swap(uint256 amount) public {
        _fujiTateSwapper._swap(amount);
    }

    function unswap(uint256 amount) public {
        _hakuTateSwapper._swap(amount);
    }
}
