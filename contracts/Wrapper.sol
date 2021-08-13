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

contract Swap {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _address1;
    Template private _token1;

    address private _address2;
    Template private _token2;

    constructor(
        address address1_,
        Template token1_,
        address address2_,
        Template token2_
    ) {
        _address1 = address1_;
        _token1 = token1_;
        _address2 = address2_;
        _token2 = token2_;
    }

    function _swap(uint256 amount) public view {
        require(
            msg.sender == _address1 || msg.sender == _address2,
            'Not an authorized address.'
        );
        require(
            _token1.allowance(_address1, address(this)) >= amount,
            'Token 1 allowance is too low.'
        );
        require(
            _token2.allowance(_address2, address(this)) >= amount,
            'Token 2 allowance is too low.'
        );
        // _safeTransferFrom(_token1Address, _address1, _address2, amount);
        // _safeTransferFrom(_token2Address, _address2, _address1, amount);
    }

    function _safeTransferFrom(
        Template token,
        address sender,
        address receiver,
        uint256 amount
    ) private {
        bool sent = token.transferFrom(sender, receiver, amount);
        require(sent, 'Token transfer failed.');
    }
}


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
        _fujiTateSwapper._swap(amount);
    }

    function unswap(uint256 amount) public view {
        _hakuTateSwapper._swap(amount);
    }
}
