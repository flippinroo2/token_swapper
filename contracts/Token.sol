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

    string public _name;
    string public _symbol;
    uint8 public _tokenDecimals;
    uint256 public override totalSupply;
    uint256 public totalMinted;

    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public _allowances;

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
        address admin = msg.sender;
        _name = name_;
        _symbol = symbol_;
        _tokenDecimals = decimals_;
        setTotalSupply(totalSupply_);
        mint(getAdmin(), totalSupply_);
    }

    function setTotalSupply(uint256 totalSupply_) internal override {
        totalSupply = totalSupply_;
    }

    function balanceOf(address account)
    public
    view
    override
    returns (uint256)
    {
    return _balances[account];
    }

    function mint(address account, uint256 amount)
    public
    override
    security
    safe(account)
    restricted(amount)
    {
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
        require((owner != address(0) || (spender != address(0))), "ERC20: mint from the zero address");
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool){
        address owner = msg.sender;
        require((owner != address(0) || (spender != address(0))), "ERC20: approve from the zero address");
        require(amount >= (amount - totalSupply), "Approval would exceed the total supply");
        uint256 spenderBalance = balanceOf(spender);
        require(amount >= spenderBalance, "Approval would exceed spender's balance");
        _approve(owner, spender, amount);
        return true;
    }

    function approveFrom(
    address owner,
    address spender,
    uint256 amount) external returns (bool) {
        require((owner != address(0) || (spender != address(0))), "ERC20: approve from the zero address");
        uint256 currentAllowance = _allowances[owner][spender];
        _approve(owner, spender, amount);
        uint256 newAllowance = _allowances[owner][spender];
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool){
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
    address sender,
    address recipient,
    uint256 amount
    ) external override returns (bool) {
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        uint256 recipientBalance = _balances[recipient];

        uint256 newRecipientBalance = recipientBalance + amount;

        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
        uint256 newSenderBalance = senderBalance - amount;
            _balances[sender] = newSenderBalance;
        }
        _balances[recipient] = newRecipientBalance;
        emit Transfer(sender, recipient, amount);
    }
}
