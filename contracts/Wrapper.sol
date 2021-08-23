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

    address private _admin;
    address private _address1;
    address private _address2;

    Swap private _swapper;
    Swap private _unswapper;

    constructor(address address1_, address address2_) {
        address admin = msg.sender;
        _admin = admin;
        _address1 = address1_;
        _address2 = address2_;
    }

    function createSwapper(Token _fuji, Token _tate) external {
        _swapper = new Swap(_address1, _fuji, _address2, _tate);
    }

    function createUnswapper(Token _tate, Token _haku) external {
        _unswapper = new Swap(_address1, _tate, _address2, _haku);
    }

    function getSwapperAddress() external view returns (address) {
        return address(_swapper);
    }

    function getUnswapperAddress() external view returns (address) {
        return address(_unswapper);
    }

    function swap(Token token1, Token token2, uint256 amount) public {
        _swapper._swap(amount);
    }

    function unswap(Token token1, Token token2, uint256 amount) public {
        _unswapper._swap(amount);
    }
}
