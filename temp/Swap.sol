//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Math
// import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Access
import '@openzeppelin/contracts/access/Ownable.sol';

// Security
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract Swap is IERC20 {
  ERC20 public tokenA;
  address public ownerA;

  ERC20 public tokenB;
  address public ownerB;

  constructor(address _tokenA, address _ownerA) {}

  function swap(uint256 _amount1, uint256 _amount2) public {
    require(msg.sender == owner1 || msg.sender == owner2, 'Not authoerized');
    require(
      token1.allowance(owner1, address(this)) >= _amount1,
      'Token 1 allowance too low'
    );
    _safeTransferFrom(token1, owner1, token2, owner2);
    _safeTransferFrom(token1, owner1, token2, owner2);
  }

  function _safeTransferFrom(
    ERC20 token,
    address sender,
    address,
    receiver,
    uint256 amount
  ) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failied');
  }

  // We need to approve this contract to spend both other coins tokens.
  function testFunction() external view {}
}
