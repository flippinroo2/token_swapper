pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
// import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

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

// This is Token C
contract Fuji is ERC20, Ownable {
  using Address for address;
  using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  address admin;

  uint8 public constant TOKEN_DECIMALS = 18;

  constructor(string memory name_, string memory symbol_)
    payable
    ERC20(name_, symbol_)
  {
    console.log(
      'constructor(string memory name_: %s, string memory symbol_: %s)',
      name_,
      symbol_
    );
  }

  function mint(address account, uint256 amount) external {
    console.log(
      'mint(address account: %s, uint256 amount: %s)',
      account,
      amount
    );
    _mint(account, amount);
  }

  /**
   * Convert an amount of input token_ to an equivalent amount of the output token
   *
   * @param token_ address of token to swap
   * @param amount amount of token to swap/receive
   */
  function swap(address token_, uint256 amount) external {}

  /**
   * Convert an amount of the output token to an equivalent amount of input token_
   *
   * @param token_ address of token to receive
   * @param amount amount of token to swap/receive
   */
  function unswap(address token_, uint256 amount) external {}
}
