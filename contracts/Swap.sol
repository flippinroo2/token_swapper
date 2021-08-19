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

  address public _token1Address;
  address public _token2Address;

  uint256 public _token1Allowance;
  uint256 public _token2Allowance;

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
    console.log(
      'constructor(address user1_ %s, Template Token, address user2_ %s, Token token2_)',
      user1_,
      user2_
    );
    _user1 = user1_;
    _token1 = token1_;
    _user2 = user2_;
    _token2 = token2_;
    emit SwapCreated(user1_, token1_, user2_, token2_);
  }

  function getToken1Address() external view returns (address) {
    return address(_token1);
  }

  function getToken2Address() external view returns (address) {
    return address(_token2);
  }

  function getToken1Allowance() external view returns (uint256) {
    return _token1Allowance;
  }

  function getToken2Allowance() external view returns (uint256) {
    return _token2Allowance;
  }

  function setToken1Allowance(address user) public {
    _token1Allowance = _token1.allowance(user, address(this));
  }

  function setToken2Allowance(address user) public {
    _token2Allowance = _token2.allowance(user, address(this));
  }

  function _swap(uint256 amount) external {
    _token1.approve(_user1, 1100);
    _token2.approve(_user2, 1100);
    setToken1Allowance(_user1); // Owner
    setToken2Allowance(_user2); // User
    console.log('token1Allowance = ');
    console.log(_token1Allowance);
    require(
      msg.sender == _user1 || msg.sender == _user2,
      'Not an authorized address.'
    );
    // require(
    //   _token1Allowance >= amount,
    //   'Token 1 allowance is too low.'
    // );
    // require(
    //   _token2Allowance >= amount,
    //   'Token 2 allowance is too low.'
    // );
    _safeTransferFrom(_token1, _user1, _user2, amount);
    _safeTransferFrom(_token2, _user2, _user1, amount);
  }

  function _safeTransferFrom(
    Token token,
    address sender,
    address receiver,
    uint256 amount
  ) internal {
    console.log('_safeTransferFrom(Token token, address sender: %s, address receiver %s, uint256 amount)', sender, receiver);
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failed.');
  }
}
