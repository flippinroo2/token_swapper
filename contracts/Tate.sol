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
contract Tate is IERC20 {
  using Address for address;
  // using Arrays for uint256[];
  using SafeMath for uint256;
  using Strings for string;

  address private _admin;
  string private _name;
  string private _symbol;
  uint256 private _totalSupply;
  uint256 private _totalMinted;
  uint8 public constant TOKEN_DECIMALS = 18;
  uint8 private constant _NOT_ENTERED = 1;
  uint8 private constant _ENTERED = 2;
  uint8 private _status;

  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
  // event Approval(address indexed owner, address indexed spender, uint256 value);
  // event Transfer(address indexed from, address indexed to, uint256 value);
  event Fallback(address indexed sender, uint256 value);

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

  modifier restricted(uint256 number) {
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
    uint256 totalSupply_
  ) payable {
    if (DEBUG) {
      console.log('Contract creator: %s', msg.sender);
      console.log(
        'constructor(string memory name_: %s, string memory symbol_: %s)',
        name_,
        symbol_
      );
    }
    setAdmin(msg.sender);
    setTotalSupply(totalSupply_);
    mint(getAdmin(), totalSupply_);
  }

  function totalSupply() external view override returns (uint256) {
    return _totalSupply;
  }

  function setTotalSupply(uint256 totalSupply_) internal {
    // require() // Ensure positive #
    // Can uint256 have an overflow? If not, explain that next to variable declaration.
    _totalSupply = totalSupply_;
  }

  function balanceOf(address account)
    external
    view
    override
    returns (uint256)
  {}

  function transfer(address recipient, uint256 amount)
    external
    override
    returns (bool)
  {}

  function allowance(address owner, address spender)
    external
    view
    override
    returns (uint256)
  {}

  function approve(address spender, uint256 amount)
    external
    override
    returns (bool)
  {}

  function transferFrom(
    address spender,
    address recipient,
    uint256 amount
  ) external override returns (bool) {}

  function name() external view returns (string memory) {
    return _name;
  }

  function symbol() external view returns (string memory) {
    return _symbol;
  }

  function decimals() external pure returns (uint8) {
    return TOKEN_DECIMALS;
  }

  function mint(address account, uint256 amount)
    public
    security
    safe(account)
    restricted(amount)
  {
    if (DEBUG) {
      console.log(
        'mint(address account: %s, uint256 amount: %s)',
        account,
        amount
      );
    }
    _balances[account] += amount;
    emit Transfer(address(0), account, amount);
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
    if (DEBUG) {
      console.log('_admin: %s', _admin);
      // console.log('_owner: %s', _owner);
    }
  }

  receive() external payable {
    emit Fallback(msg.sender, msg.value);
  }
}
