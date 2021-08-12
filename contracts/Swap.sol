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
  using Address for address;
  // using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  // Most likely make these private.
  address public _address1;
  ERC20 public _token1;
  address public _address2;
  ERC20 public _token2;
  uint256 public _amount;

  constructor(
    address address1_,
    ERC20 token1_,
    address address2_,
    ERC20 token2_,
    uint256 amount_
  ) {
    console.log(
      'constructor(address _token1 %s, address _token2 %s)',
      _token1,
      _token2
    );
    _address1 = address1_;
    _token1 = token1_;
    _address2 = address2_;
    _token2 = token2_;
    _amount = amount_;
    swap();
  }

  function swap() internal {
    // require(msg.sender == owner1 || msg.sender == owner2, 'Not authorized.');
    // require(
    //   token1.allowance(owner1, address(this)) >= _amount1,
    //   'Token 1 allowance too low'
    // );
    _safeTransferFrom(_address1, _token1, _address2, _token2, _amount);
  }

  function _safeTransferFrom(
    address sender,
    ERC20 token1,
    address receiver,
    ERC20 token2,
    uint256 amount
  ) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, 'Token transfer failied');
  }

  // We need to approve this contract to spend both other coins tokens.
  function testFunction() external view {}
}
