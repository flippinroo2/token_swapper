//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
// import '@openzeppelin/contracts/token/ERC20/IERC20.sol'
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Math
// import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Custom Tokens
import './Swap.sol'; // Swap Utility Token
import './Template.sol'; // Template
import './Fuji.sol'; // Token A
import './Haku.sol'; // Token B
import './Tate.sol'; // Token C

contract Wrapper {
  using Address for address;
  using Arrays for ERC20[];
  using SafeMath for uint256;
  using Strings for string;

  address public _admin;
  address public contractAddress;
  address public _address1;
  address public _address2;

  address[] public tokenAddresses;
  // ERC20[] tokens;

  Swap public _fujiTateSwapper;
  Swap public _hakuTateSwapper;

  Template public fuji = new Template('Fuji', 'FUJI', 1100);
  Template public haku = new Template('Haku', 'HAKU', 1050);
  Template public tate = new Template('Tate', 'TATE', 1000);

  // Fuji public _fuji = new Fuji('Fuji', 'FUJI', 1100);
  // Haku public _haku = new Haku('Haku', 'HAKU', 1050);
  // Tate public _tate = new Tate('Tate', 'TATE', 1000);

  constructor(address address1_, address address2_) {
    _admin = msg.sender;
    contractAddress = address(this);
    _address1 = address1_;
    _address2 = address2_;

    // fuji = new Fuji('Fuji', 'FUJI', 1100);
    // tokens.push(fuji);
    // haku = new Haku('Haku', 'HAKU', 1050);
    // tokens.push(haku);
    // tate = new Tate('Tate', 'TATE', 1000);
    // tokens.push(tate);

    address fujiAddress = address(_fuji);
    console.log('fujiAddress: %s', fujiAddress);
    // tokenAddresses[0] = address(_fuji);
    tokenAddresses.push(fujiAddress);

    address hakuAddress = address(_haku);
    console.log('hakuAddress: %s', hakuAddress);
    // tokenAddresses[1] = address(_haku);
    tokenAddresses.push(hakuAddress);

    address tateAddress = address(_tate);
    console.log('tateAddress: %s', tateAddress);
    // tokenAddresses[2] = address(_tate);
    tokenAddresses.push(tateAddress);

    _fujiTateSwapper = new Swap(_address1, fujiAddress, _address2, tateAddress);
    _hakuTateSwapper = new Swap(_address2, hakuAddress, _address1, tateAddress);

    // Example constructor for when trying to send Eth
    // Swap swapper = (new Swapper).value(msg.value)(admin, _haku, admin, _tate);
  }

  function swap(uint256 amount) external {
    console.log('swap(uint256 amount %s)', amount);
    _fujiTateSwapper._swap(amount);
  }

  function unswap(uint256 amount) external {
    console.log('unswap(uint amount %s)', amount);
    _hakuTateSwapper._swap(amount);
  }

  function testFunction() external {
    console.log('testFunction()');
  }
}
