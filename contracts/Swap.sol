//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Custom Tokens
import './Template.sol'; // Template Contract

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
