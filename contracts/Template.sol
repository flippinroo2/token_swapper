//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Token
// import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Math
// import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract Template is IERC20 {
    using Address for address;
    // using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    // The variables are oredered this way for memory efficiency.
    uint8 public constant TOKEN_DECIMALS = 18;
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    uint256 public _totalMinted;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    // event Approval(address indexed owner, address indexed spender, uint256 value);
    // event Transfer(address indexed from, address indexed to, uint256 value);
    event Fallback(address indexed sender, uint256 value);

    // Function Modifiers
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
        string memory symbol_
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
        // setTotalSupply(totalSupply_);
        // mint(getAdmin(), totalSupply_);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function setTotalSupply(uint256 totalSupply_) internal restricted {
        // Can uint256 have an overflow? If not, explain that next to variable declaration.
        _totalSupply = totalSupply_;
    }

    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool){
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool){
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address spender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        _transfer(spender, recipient, amount);
        address sender = msg.sender;
        uint256 currentAllowance = _allowances[spender][sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(spender, sender, currentAllowance - amount);
        }
        return true;
    }

    function getAdmin() public view returns (address) {
        return _admin;
    }

    function setAdmin(address admin) internal {
        address _previousAdmin = _admin;
        _admin = admin;
        emit AdminChanged(_previousAdmin, _admin);
    }

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

    function getTotalMinted() public view returns (uint256) {
        return _totalMinted;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    // New syntax for fallback functions.
    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }
}
