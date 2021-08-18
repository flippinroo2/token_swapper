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
  event SwapCreated(
    address _user1,
    Token indexed _token1,
    address _user2,
    Token indexed _token2
  );

  constructor(
    address user1_,
    Token token1_,
    address user2_,
    Token token2_
  ) {
    console.log(
      'constructor(address user1_ %s, Template token1_, address user2_ %s, Template token2_)',
      user1_,
      user2_
    );
    _user1 = user1_;
    _token1 = token1_;
    _user2 = user2_;
    _token2 = token2_;
    emit SwapCreated(user1_, token1_, user2_, token2_);
  }

  function getToken1() external view returns (Token) {
    return _token1;
  }

  function getToken2() external view returns (Token) {
    return _token2;
  }

  function _swap(uint256 amount) external {
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
    _safeTransferFrom(_token1, _user1, _user2, amount);
    _safeTransferFrom(_token2, _user2, _user1, amount);
  }

  function _safeTransferFrom(
    Token token,
    address sender,
    address receiver,
    uint256 amount
  ) internal {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failed.');
  }
}
