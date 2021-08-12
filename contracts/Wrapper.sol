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
import './Fuji.sol'; // Token A
import './Haku.sol'; // Token B
import './Tate.sol'; // Token C

contract Wrapper {
  using Address for address;
  using Arrays for ERC20[];
  using SafeMath for uint256;
  using Strings for string;

  address private _admin;

  address[] tokenAddresses;
  // ERC20[] tokens;

  Swap private _fujiTateSwapper;
  Swap private _hakuTateSwapper;

  // Fuji public fuji;
  // Haku public haku;
  // Tate public tate;

  Fuji private _fuji = new Fuji('Fuji', 'FUJI', 1100);
  Haku private _haku = new Haku('Haku', 'HAKU', 1050);
  Tate private _tate = new Tate('Tate', 'TATE', 1000);

  constructor() {
    _admin = msg.sender;

    // fuji = new Fuji('Fuji', 'FUJI', 1100);
    // tokens.push(fuji);
    // haku = new Haku('Haku', 'HAKU', 1050);
    // tokens.push(haku);
    // tate = new Tate('Tate', 'TATE', 1000);
    // tokens.push(tate);

    // tokenAddresses[0] = address(_fuji);
    tokenAddresses.push(address(_fuji));

    // tokenAddresses[1] = address(_haku);
    tokenAddresses.push(address(_haku));

    // tokenAddresses[2] = address(_tate);
    tokenAddresses.push(address(_tate));

    _fujiTateSwapper = new Swap(_admin, _fuji, _admin, _tate);
    _hakuTateSwapper = new Swap(_admin, _haku, _admin, _tate);

    // Example constructor for when trying to send Eth
    // Swap swapper = (new Swapper).value(msg.value)(_admin, _haku, _admin, _tate);
  }

  function swap(address token_, uint256 amount) external {
    console.log('swap(address token_ %s, uint256 amount %s)');
    _fujiTateSwapper._swap(amount, amount);
  }

  function unswap(address token_, uint256 amount) external {
    console.log('unswap(address token_ %s, uint amount %s)');
    _hakuTateSwapper._swap(amount, amount);
  }

  function testFunction() external {
    console.log('testFunction()');
  }
}
