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
import './Token.sol'; // Token Contract

contract Swap {
  using Address for address;
  using SafeMath for uint256;
  using Strings for string;

  address private _admin;

  Token private _token1;
  Token private _token2;

  address private _token1Address;
  address private _token2Address;

  uint256 private _token1TotalSupply;
  uint256 private _token2TotalSupply;

  // Events
  event SwapCreated(
    Token indexed token1,
    Token indexed token2
  );

  constructor(
    Token token1_,
    Token token2_
  ) {
    address admin = msg.sender;
    _admin = admin;

    _token1 = token1_;
    _token2 = token2_;

    _token1TotalSupply = token1_.totalSupply();
    _token2TotalSupply = token2_.totalSupply();

    // console.log('\nadmin: %s', admin);
    // console.log('user1_: %s', user1_);
    // console.log('user2_: %s', user2_);
    // console.log('token1_: %s', address(token1_));
    // console.log('token2_: %s', address(token2_));
    // console.log('token1TotalSupply');
    // console.log(token1TotalSupply);
    // console.log('token2TotalSupply');
    // console.log(token2TotalSupply);

    // token1_.approveFrom(address(_admin), address(this), token1TotalSupply);
    // token2_.approveFrom(address(_admin), address(this), token2TotalSupply);

    // token1_.approveFrom(address(_admin), address(_admin), token1TotalSupply);
    // token2_.approveFrom(address(_admin), address(_admin), token2TotalSupply);

    // token1_.approveFrom(address(_admin), address(_token1), token1TotalSupply);
    // token2_.approveFrom(address(_admin), address(_token2), token2TotalSupply);

    // token1_.approveFrom(address(_admin), address(_user1), token1TotalSupply);
    // token2_.approveFrom(address(_admin), address(_user2), token2TotalSupply);

    // token1_.approveFrom(address(_admin), address(_user2), token1TotalSupply);
    // token2_.approveFrom(address(_admin), address(_user2), token2TotalSupply);

    emit SwapCreated(token1_, token2_);
  }

  function _swap(uint256 amount) external {
    _token1.approveFrom(address(_token1), address(this), amount);
    _token2.approveFrom(address(_token2), address(this), amount);

    // _safeTransferFrom(_token1, address(_token1), address(_token2), amount);
    // _safeTransferFrom(_token2, address(_token2), address(_token1), amount);

    _token1.approveFrom(address(_admin), address(this), amount);
    _token2.approveFrom(address(_admin), address(this), amount);

    _safeTransferFrom(_token1, _admin, address(_token2), amount);
    _safeTransferFrom(_token2, address(_token2), _admin, amount);
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
