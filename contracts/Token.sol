//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Math
// import '@openzeppelin/contracts/utils/math/SafeCast.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Custom Tokens
import './Template.sol'; // Template

contract Token is Template {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    // address private _admin;
    uint256 private _totalSupply;
    uint256 private _totalMinted;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // Events
    // event Approval(address indexed owner, address indexed spender, uint256 value);
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    // event Fallback(address indexed sender, uint256 value);

    // Function Modifiers
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

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) payable Template(name_, symbol_) {
        if (DEBUG) {
            console.log('Contract creator: %s', msg.sender);
            console.log(
                'constructor(string memory name_: %s, string memory symbol_: %s)',
                name_,
                symbol_
            );
        }
        // setAdmin(msg.sender);
        setTotalSupply(totalSupply_);
        mint(getAdmin(), totalSupply_);
    }

    function totalSupply() public view override returns (uint256) {
    return _totalSupply;
    }

    function setTotalSupply(uint256 totalSupply_) internal override {
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

    function allBalances() external view {
        return _balances;
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
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool){
        address owner = msg.sender;
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _approve(owner, spender, amount);
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
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

    function decimals() external pure returns (uint8) {
        return TOKEN_DECIMALS;
    }

    function mint(address account, uint256 amount)
    public
    override
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

    function getTotalMinted() public view override returns (uint256) {
        return _totalMinted;
    }

    // function setAdmin(address admin) internal {
    //     _admin = admin;
    //     // _setOwner(admin);
    // }

    function testFunction() external view {
        address admin = getAdmin();
        console.log('admin: %s', admin);
    }

    // receive() external payable {
    //     emit Fallback(msg.sender, msg.value);
    // }
}
