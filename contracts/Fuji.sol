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
contract Fuji is IERC20 {
  using Address for address;
  // using Arrays for uint256[];
  using SafeMath for uint16;
  using SafeMath for uint256;
  using Strings for string;

  address private _admin;
  string private _name;
  string private _symbol;
  uint16 private _totalSupply;
  uint16 private _totalMinted;
  uint8 public constant TOKEN_DECIMALS = 18;
  uint8 private constant _NOT_ENTERED = 1;
  uint8 private constant _ENTERED = 2;
  uint8 private _status;

  mapping(address => uint16) private _balances;
  mapping(address => mapping(address => uint16)) private _allowances;

  event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
  event Approval(address indexed owner, address indexed spender, uint16 value);
  event Transfer(address indexed from, address indexed to, uint16 value);
  event Fallback(address indexed sender, uint16 value);

  modifier security {
    require(msg.sender == _admin, 'Must be contract admin');
    _;
  }

  modifier safe(address account) {
    // assert.notEqual(address, 0x0);
    // assert.notEqual(address, '');
    // assert.notEqual(address, null);
    // assert.notEqual(address, undefined);
    require(account != address(0), 'Cannot transact with the zero address');
    _;
  }

  modifier restricted(uint16 number) {
    require(number != 0, 'Number cannot be zero');
    require(number > 0, 'Must be a positive number.');
    require(number <= _totalSupply, 'Must be less than total supply.');
    require(
      (_totalMinted + number) <= _totalSupply,
      'This would cause the total minted coins to be more than the total supply.'
    );
    _;
  }

  modifier reentrancyProtection() {
    require(_status != _ENTERED, 'Reentrant call');
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
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

  function totalSupply() external view override returns (uint16) {
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

  function name() external view returns (string memory) {
    return _name;
  }

  function symbol() external view returns (string memory) {
    return _symbol;
  }

  function decimals() external view returns (uint8) {
    return TOKEN_DECIMALS;
  }

  function mint(address account, uint256 amount)
    public
    security
    safe
    restricted
  {
    console.log(
      'mint(address account: %s, uint256 amount: %s)',
      account,
      amount
    );
    _balances[account] += amount;
    emit Transfer(address(0), account, amount);
  }

  /**
   * Convert an amount of input token_ to an equivalent amount of the output token
   *
   * @param token_ address of token to swap
   * @param amount amount of token to swap/receive
   */
  function swap(address token_, uint16 amount) public view {
    console.log('swap(address token_ %s, uint256 amount %s)', token_, amount);
  }

  /**
   * Convert an amount of the output token to an equivalent amount of input token_
   *
   * @param token_ address of token to receive
   * @param amount amount of token to swap/receive
   */
  function unswap(address token_, uint16 amount) public view {
    console.log('unswap(address token_ %s, uint256 amount %s)', token_, amount);
  }

  function getAdmin() public view returns (address) {
    return _admin;
  }

  function setAdmin(address admin) internal {
    address _previousAdmin = _admin;
    _admin = admin;
    emit AdminChanged(_previousAdmin, _admin);
  }

  function testFunction() public view {
    console.log('_admin: %s', _admin);
    // console.log('_owner: %s', _owner);
  }

  receive() external payable {
    emit Fallback(msg.sender, msg.value);
  }
}
