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

    bool private constant DEBUG = true;

    // address private _admin;
    string public _name;
    string public _symbol;
    uint8 public _tokenDecimals;
    uint256 public override totalSupply;
    uint256 public totalMinted;

    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public _allowances;

    // Events
    // event Approval(address indexed owner, address indexed spender, uint256 value);
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    // event Fallback(address indexed sender, uint256 value);

    // Function Modifiers
    modifier restricted(uint256 number) {
        require(number != 0, 'Number cannot be zero');
        require(number > 0, 'Must be a positive number.');
        require(number <= totalSupply, 'Must be less than total supply.');
        require(
            (totalMinted + number) <= totalSupply,
            'This would cause the total minted coins to be more than the total supply.'
        );
        _;
    }

    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 totalSupply_) payable Template() {
        if (DEBUG) {
            console.log('Contract creator: %s', msg.sender);
            console.log('constructor(string name_ %s, string symbol_ %s, uint8 decimals_, uint256 totalSupply_)', name_, symbol_); // Cannot convert ", decimals_, totalSupply_" into strings without a prewritten funciton. (https://ethereum.stackexchange.com/questions/10932/how-to-convert-string-to-int)
        }
        // setAdmin(msg.sender); // Already implemented in the "Template" contract.
        setTotalSupply(totalSupply_); // Moving these functions to the createToken() function.
        mint(getAdmin(), totalSupply_); // Moving these functions to the createToken() function.
    }

    function setTotalSupply(uint256 totalSupply_) internal override {
        // Can uint256 have an overflow? If not, explain that next to variable declaration.
        totalSupply = totalSupply_;
    }

    function balanceOf(address account)
    external
    view
    override
    returns (uint256)
    {
    return _balances[account];
    }

    // function allBalances() external view returns (uint256[]) {
    //     // Need to create a loop to go through mapping and save all the items into an array in order to return it from a function.
    //     address[] memory temp = new address[]
    //     return _balances;
    // }

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
    totalMinted += amount;
    emit Transfer(address(0), account, amount);
    }

    function getTotalMinted() public view override returns (uint256) {
        return totalMinted;
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
        if (DEBUG) {
            console.log('approve(address owner: %s, address spender: %s, uint256 amount)', owner, spender);
        }
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _approve(owner, spender, amount);
        return true;
    }

    function approveFrom(
    address owner,
    address spender,
    uint256 amount) external returns (bool) {
        if (DEBUG) {
            console.log('approveFrom(address owner: %s, address spender: %s, uint256 amount)', owner, spender);
        }
        _approve(owner, spender, amount);
        uint256 currentAllowance = _allowances[owner][spender];
        if (DEBUG) {
            console.log('currentAllowance');
            console.log(currentAllowance);
        }
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(owner, spender, currentAllowance - amount);
        }
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        if (DEBUG) {
            console.log('_approve(address owner: %s, address spender: %s, uint256 amount)', owner, spender);
        }
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool){
        if (DEBUG) {
            console.log('transfer(address recipient: %s, uint256 amount)', recipient);
        }
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
    address sender,
    address recipient,
    uint256 amount
    ) external override returns (bool) {
        if (DEBUG) {
            console.log('transferFrom(address sender: %s, address recipient: %s, uint256 amount)', sender, recipient);
        }
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        if (DEBUG) {
            console.log('_transfer(address sender: %s, address recipient: %s, uint256 amount)', sender, recipient);
        }
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

    function testFunction() external view {
        address admin = getAdmin();
        console.log('admin: %s', admin);
    }

    // receive() external payable {
    //     emit Fallback(msg.sender, msg.value);
    // }
}
