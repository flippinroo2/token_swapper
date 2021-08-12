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

// Custom Tokens
import './Template.sol'; // Template
import './Fuji.sol'; // Token A
import './Haku.sol'; // Token B
import './Tate.sol'; // Token C

contract Swap2 {
  using Address for address;
  using SafeMath for uint256;
  using Strings for string;

  bool private constant DEBUG = false;

  // Most likely make these private.
  address public _address1;
  address public _token1Address;
  Template public _token1;

  address public _address2;
  address public _token2Address;
  Template public _token2;

  constructor(
    address address1_,
    address token1Address_,
    address address2_,
    address token2Address_
  ) {
    if (DEBUG) {
      console.log(
        'constructor(address address1_ %s, IERC20 token1Address_, address address2_ %s, IERC20 token2Address_)',
        address1_,
        address2_
      );
    }
    _address1 = address1_;
    _token1Address = token1Address_;
    _address2 = address2_;
    _token2Address = token2Address_;
  }

  function _swap(uint256 amount) public {
    // We need to approve this contract to spend both other coins tokens.
    require(
      msg.sender == _address1 || msg.sender == _address2,
      'Not an authorized address.'
    );
    // require(
    //   _token1Address.allowance(_address1, address(this)) >= amount,
    //   'Token 1 allowance is too low.'
    // );
    // require(
    //   _token2Address.allowance(_address2, address(this)) >= amount,
    //   'Token 2 allowance is too low.'
    // );

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
