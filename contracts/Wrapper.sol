//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
// import '@openzeppelin/contracts/token/ERC20/IERC20.sol'
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// Custom Tokens
import './Swap.sol'; // Swap Utility Token
import './Fuji.sol'; // Token A
import './Haku.sol'; // Token B
import './Tate.sol'; // Token C

contract Wrapper is Swap {
  function swap(address token_, uint256 amount) external {
    console.log('swap(address token_ %s, uint256 amount %s)');
  }

  function unswap(address token_, uint256 amount) external {
    console.log('unswap(address token_ %s, uint amount %s)');
  }

  function testFunction() external {
    console.log('testFunction()');
  }
}
