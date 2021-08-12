//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Custom Tokens
import './Template.sol'; // Template

contract Coin is Template {
  using Address for address;
  // using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  bool private constant DEBUG = false;

  address private _admin;
  string private _name;
  string private _symbol;
  uint256 private _totalSupply;
  // uint256 private _totalMinted;
  uint8 private constant _NOT_ENTERED = 1;
  uint8 private constant _ENTERED = 2;
  uint8 private _status;

  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  constructor(
    string memory name_,
    string memory symbol_,
    uint256 totalSupply_
  ) payable Template(name_, symbol_) {
    if (DEBUG) {
      console.log('Contract creator: %s', msg.sender);
      console.log(
        'constructor(string memory name_: %s, string memory symbol_: %s)',
        name_,
        symbol_
      );
    }
    setAdmin(msg.sender);
    setTotalSupply(totalSupply_);
    // mint(getAdmin(), totalSupply_);
  }
}
