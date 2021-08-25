//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Custom Tokens
import './Template.sol'; // Template

contract Token is Template {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = true;

    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    string public _name;
    string public _symbol;
    uint256 public _tokenDecimals;
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

    constructor(string memory name_, string memory symbol_, uint256 decimals_, uint256 totalSupply_) payable Template() {
        address admin = msg.sender;
        _name = name_;
        _symbol = symbol_;
        _tokenDecimals = decimals_;
        setAdmin(admin);
        setTotalSupply(totalSupply_);
        mint(address(this), totalSupply);
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
    uint256 amount) public returns (bool) {
        require((owner != address(0) || (spender != address(0))), "ERC20: approve from the zero address");
        _approve(owner, spender, amount);
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        _allowances[owner][spender] = amount;
        if(DEBUG){
            console.log('_approve()');
            console.log('owner: %s', owner);
            console.log('spender: %s', spender);
            console.log('amount');
            console.log(amount);
        }
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
        if(DEBUG){
            console.log('_transfer()');
            console.log('sender: %s', sender);
            console.log('recipient: %s', recipient);
            console.log('amount');
            console.log(amount);
        }
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
        uint256 newSenderBalance = senderBalance - amount;
            _balances[sender] = newSenderBalance;
        }
        _balances[recipient] = newRecipientBalance;
        emit Transfer(sender, recipient, amount);
    }
}
