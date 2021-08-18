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

  address public _user1;
  address public _user2;

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
    _user1 = address1_;
    _token1 = token1_;
    _user2 = address2_;
    _token2 = token2_;
    emit SwapCreated(address1_, token1_, address2_, token2_);
  }

    function getToken1() external view {

    }
function getToken2() external view {

    }

  function _swap(uint256 amount) public view {
    require(
      msg.sender == _user1 || msg.sender == _user2,
      'Not an authorized address.'
    );
    require(
      _token1.allowance(_user1, address(this)) >= amount,
      'Token 1 allowance is too low.'
    );
    require(
      _token2.allowance(_user2, address(this)) >= amount,
      'Token 2 allowance is too low.'
    );
    _safeTransferFrom(_token1Address, _user1, _user2, amount);
    _safeTransferFrom(_token2Address, _user2, _user1, amount);
  }

  function _safeTransferFrom(
    Token token,
    address sender,
    address receiver,
    uint256 amount
  ) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failed.');
  }
}
