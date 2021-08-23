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

  address private _admin;

  address public _user1;
  address public _user2;

  Token public _token1;
  Token public _token2;

  address public _token1Address;
  address public _token2Address;

  // Events
  event SwapCreated(
    address user1,
    Token indexed token1,
    address user2,
    Token indexed token2
  );

  constructor(
    address user1_,
    Token token1_,
    address user2_,
    Token token2_
  ) {
    address admin = msg.sender;
    _admin = admin;
    _user1 = user1_;
    _token1 = token1_;
    _user2 = user2_;
    _token2 = token2_;
    // console.log('\nadmin: %s', admin);
    // console.log('user1_: %s', user1_);
    // console.log('user2_: %s', user2_);
    // console.log('token1_: %s', address(token1_));
    // console.log('token2_: %s', address(token2_));
    token1_.approve(user1_, token1_.totalSupply());
    token2_.approve(user2_, token2_.totalSupply());
    emit SwapCreated(user1_, token1_, user2_, token2_);
  }

  function _swap(uint256 amount) external {
    require(
      msg.sender == _user1 || msg.sender == _user2,
      'Not an authorized address.'
    );

    // _safeTransferFrom(_token1, address(_token1), _user1, amount);
    // _safeTransferFrom(_token2, address(_token2), _user2, amount);
    _token1.transfer(_user1, amount);
    _token2.transfer(_user2, amount);

    // _safeTransferFrom(_token1, _user1, _user2, amount);
    // _safeTransferFrom(_token2, _user2, _user1, amount);
  }

  function _safeTransferFrom(
    Token token,
    address sender,
    address receiver,
    uint256 amount
  ) internal {
    address contractAddress = address(this);
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failed.');
  }
}
