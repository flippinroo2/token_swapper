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
// import './Template.sol'; // Template Contract
import './Token.sol'; // Token Contract

contract Swap {
  using Address for address;
  using SafeMath for uint256;
  using Strings for string;

  address public _address1;
  address public _address2;

  Token public _token1;
  Token public _token2;

    // Events
    event SwapCreated(address indexed address1_, Token indexed token1_, address indexed address2_, Token indexed token2_);

  constructor(
    address address1_,
    Token token1_,
    address address2_,
    Token token2_
  ) {
    console.log(
      'constructor(address address1_ %s, Template token1_, address address2_ %s, Template token2_)',
      address1_,
      address2_
    );
    _address1 = address1_;
    _token1 = token1_;
    _address2 = address2_;
    _token2 = token2_;
    emit SwapCreated(address1_, token1_, address2_, token2_);
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
    _safeTransferFrom(_token1Address, _address1, _address2, amount);
    _safeTransferFrom(_token2Address, _address2, _address1, amount);
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
