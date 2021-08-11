pragma solidity ^0.8.0;

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
import '@openzeppelin/contracts/access/AccessControl.sol';
// import '@openzeppelin/contracts/access/AccessControlEnumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// Security
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

// This is Token A
contract Haku is ERC20 {
  using Address for address;
  using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  address admin;

  uint8 public constant TOKEN_DECIMALS = 18;

  constructor(string memory name_, string memory symbol_)
    payable
    ERC20(name_, symbol_)
  {}

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
