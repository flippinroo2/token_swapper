//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract Swap {
  using Address for address;
  using SafeMath for uint256;
  using Strings for string;

  // Most likely make these private.
  address public _address1;
  IERC20 public _token1;
  address public _address2;
  IERC20 public _token2;

  constructor(
    address address1_,
    IERC20 token1_,
    address address2_,
    IERC20 token2_
  ) {
    console.log(
      'constructor(address address1_ %s, IERC20 token1_, address address2_ %s, IERC20 token2_)',
      address1_,
      address2_
    );
    _address1 = address1_;
    _token1 = token1_;
    _address2 = address2_;
    _token2 = token2_;
  }

  function _swap(uint256 amount1_, uint256 amount2_) public {
    // We need to approve this contract to spend both other coins tokens.
    require(
      msg.sender == _address1 || msg.sender == _address2,
      'Not an authorized address.'
    );
    require(
      _token1.allowance(_address1, address(this)) >= amount1_,
      'Token 1 allowance is too low.'
    );
    require(
      _token2.allowance(_address2, address(this)) >= amount2_,
      'Token 2 allowance is too low.'
    );
    _safeTransferFrom(_token1, _address1, _address2, amount1_);
    _safeTransferFrom(_token2, _address2, _address1, amount2_);
  }

  function _safeTransferFrom(
    IERC20 token,
    address sender,
    address receiver,
    uint256 amount
  ) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failed.');
  }
}
