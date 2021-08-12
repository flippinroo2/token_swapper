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

contract Swap {
  using Address for address;
  using SafeMath for uint256;
  using Strings for string;

  bool private constant DEBUG = false;

  // Most likely make these private.
  address public _address1;
  string public _token1Name;
  string public _token1Symbol;
  Template public _token1;

  address public _address2;
  string public _token2Name;
  string public _token2Symbol;
  Template public _token2;

  constructor(
    address address1_,
    string memory token1Name_,
    string memory token1Symbol_,
    address address2_,
    string memory token2Name_,
    string memory token2Symbol_
  ) {
    _address1 = address1_;
    _token1Name = token1Name_;
    _token1Symbol = token1Symbol_;
    _address2 = address2_;
    _token2Name = token2Name_;
    _token2Symbol = token2Symbol_;

    console.log(
      '_token1Name: %s\n_token1Symbol: %s',
      _token1Name,
      _token1Symbol
    );
    _token1 = new Template(_token1Name, _token1Symbol);

    console.log(
      '_token2Name: %s\n_token2Symbol: %s',
      _token2Name,
      _token2Symbol
    );
    // _token2 = new Template(_token2Name, _token2Symbol);
  }

  function _swap(uint256 amount) public {
    // We need to approve this contract to spend both other coins tokens.
    require(
      msg.sender == _address1 || msg.sender == _address2,
      'Not an authorized address.'
    );
    // require(
    //   token1.allowance(_address1, address(this)) >= amount,
    //   'Token 1 allowance is too low.'
    // );
    // require(
    //   token2.allowance(_address2, address(this)) >= amount,
    //   'Token 2 allowance is too low.'
    // );

    _safeTransferFrom(token1, _address1, _address2, amount);
    _safeTransferFrom(token2, _address2, _address1, amount);
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
