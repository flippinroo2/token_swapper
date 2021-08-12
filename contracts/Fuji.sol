//SPDX-License-Identifier: UNLICENSED
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

// This is Token A
contract Fuji is ReentrancyGuard, Ownable, IERC20 {
  using Address for address;
  using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  address private _admin;
  string private _name;
  string private _symbol;
  uint256 private _totalSupply;
  uint8 public constant TOKEN_DECIMALS = 18;

  mapping(address => uint256) private _balances;

  mapping(address => mapping(address => uint256)) private _allowances;

  modifier security {
    require(msg.sender == _admin, 'Must be contract admin');
    _;
  }

  modifier safe(address account) {
    require(account != address(0), 'Cannot transact with the zero address');
    _;
  }

  modifier positive(uint256 number) {
    require(number > 0, 'Must be a positive number');
  }

  constructor(
    string memory name_,
    string memory symbol_,
    uint16 totalSupply_
  ) payable {
    console.log('Contract creator: %s', msg.sender);
    console.log(
      'constructor(string memory name_: %s, string memory symbol_: %s)',
      name_,
      symbol_
    );
    setAdmin(msg.sender);
    setTotalSupply(totalSupply_);
    mint(totalSupply_);
  }

  function totalSupply() external view returns (uint16) {
    return _totalSupply;
  }

  function setTotalSupply(uint16 totalSupply_) internal {
    // require() // Ensure positive #
    // Can uint16 have an overflow? If not, explain that next to variable declaration.
    _totalSupply = totalSupply_;
  }

  function balanceOf(address account) external view returns (uint16) {}

  function transfer(address recipient, uint16 amount) external returns (bool) {}

  function allowance(address owner, address spender)
    external
    view
    returns (uint16)
  {}

  function approve(address spender, uint16 amount) external returns (bool) {}

  function transferFrom(
    address spender,
    address recipient,
    uint16 amount
  ) external returns (bool) {}

  function mint(address account, uint256 amount) external security positive {
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
  function swap(address token_, uint256 amount) external view {
    console.log('swap(address token_ %s, uint256 amount %s)', token_, amount);
  }

  /**
   * Convert an amount of the output token to an equivalent amount of input token_
   *
   * @param token_ address of token to receive
   * @param amount amount of token to swap/receive
   */
  function unswap(address token_, uint256 amount) external view {
    console.log('unswap(address token_ %s, uint256 amount %s)', token_, amount);
  }

  function setAdmin(address admin) internal {
    _admin = admin;
    // _setOwner(admin);
  }

  function testFunction() external view {
    console.log('_admin: %s', _admin);
    // console.log('_owner: %s', _owner);
  }

  function() external payable {}

  /**
   * @dev Emitted when `value` tokens are moved from one account (`from`) to
   * another (`to`).
   *
   * Note that `value` may be zero.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted when the allowance of a `spender` for an `owner` is set by
   * a call to {approve}. `value` is the new allowance.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);
}
