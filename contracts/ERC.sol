//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
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

// This is Token A
contract ERC is IERC20 {
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


  constructor(string memory name_, string memory symbol_)
    payable
  {
    console.log('Contract creator: %s', msg.sender);
    console.log(
      'constructor(string memory name_: %s, string memory symbol_: %s)',
      name_,
      symbol_
    );
    setAdmin(msg.sender);
  }

  modifier security {
    require(msg.sender == _admin, 'Must be contract admin');
    _;
  }

  function totalSupply() external view returns (uint256){
    console.log('totalSupply()');
  };

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256){
    console.log('balanceOf(address account)');

    };

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool){
    console.log('transfer(address recipient, uint256 amount)');

    };

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256){
    console.log('allowance(address owner, address spender)');

    };

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool){
    console.log('approve(address spender, uint256 amount)');

    };

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

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


  function mint(address account, uint256 amount) external security {
    console.log(
      'mint(address account: %s, uint256 amount: %s)',
      account,
      amount
    );

  }

  function allBalances() external view {
    console.log('allBalances()');
    // return _balances;
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
    _setOwner(admin);
  }

  function testFunction() external view {
    console.log('testFunction()');
    console.log('_admin: %s', _admin);
    // console.log('_owner: %s', _owner);
  }
}
