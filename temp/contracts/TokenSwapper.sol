//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Token
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Access
import '@openzeppelin/contracts/access/Ownable.sol';

// Security
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

// Utils
import '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import '@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol';

abstract contract Template is IERC20 {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event Fallback(address indexed sender, uint256 value);

    constructor() {
        address admin = msg.sender;
        setAdmin(admin);
    }

    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }

    function transferFrom(
        address spender,
        address recipient,
        uint256 amount
    ) external virtual override returns (bool);

    function totalSupply() external view override virtual returns (uint256);

    function mint(address account, uint256 amount) public virtual;
    function approve(address spender, uint256 amount) public virtual override returns (bool);
    function transfer(address recipient, uint256 amount) public virtual override returns (bool);


    function getAdmin() public view returns (address) {
        return _admin;
    }

    function getTotalMinted() public view virtual returns (uint256);

    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256);

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256);

    function setAdmin(address admin) internal {
        address _previousAdmin = _admin;
        _admin = admin;
        emit AdminChanged(_previousAdmin, _admin);
    }

    function setTotalSupply(uint256 totalSupply_) internal virtual;
}

contract Token is Template {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;

    string public _name;
    string public _symbol;
    uint256 public _tokenDecimals;
    uint256 public override totalSupply;
    uint256 public totalMinted;

    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public _allowances;

    modifier safe(address account) {
        require(account != address(0), 'Cannot transact with the zero address');
        _;
    }

    modifier security {
        require((msg.sender == getAdmin()) || (msg.sender == address(this)), 'Must be contract admin');
        _;
    }

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

    modifier reentrancyProtection() {
        require(_status != _ENTERED, 'Reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
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

    function transferFrom(
    address sender,
    address recipient,
    uint256 amount
    ) external override safe(msg.sender) reentrancyProtection returns (bool) {
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }
        return true;
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

    function approve(address spender, uint256 amount) public override safe(msg.sender) returns (bool){
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
    uint256 amount) public safe(msg.sender)  returns (bool) {
        require((owner != address(0) || (spender != address(0))), "ERC20: approve from the zero address");
        _approve(owner, spender, amount);
        return true;
    }

    function transfer(address recipient, uint256 amount) public override safe(msg.sender) returns (bool){
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function getTotalMinted() public view override returns (uint256) {
        return totalMinted;
    }

    function balanceOf(address account)
    public
    view
    override
    returns (uint256)
    {
        return _balances[account];
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

    function setTotalSupply(uint256 totalSupply_) internal override security safe(msg.sender) {
        totalSupply = totalSupply_;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
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

contract TokenFactory {
    using Address for address;
    using Arrays for string[];
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;

    mapping(string => address) private _tokens;

    event TokenCreated(address indexed tokenAddress, string indexed name, string indexed symbol, uint256 decimals, uint256 totalSupply);

    constructor() {
        address admin = msg.sender;
        _admin = admin;
    }

    function createToken(string memory name, string memory symbol, uint256 decimals, uint256 totalSupply) public returns (Token) {
        Token token = new Token(name, symbol, decimals, totalSupply);
        address tokenAddress = address(token);
        _tokens[symbol] = tokenAddress;
        emit TokenCreated(tokenAddress, name, symbol, decimals, totalSupply);
        return token;
    }
}

contract Swap {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;

    string public name;

    Token private _token1;
    Token private _token2;

    address private _token1Address;
    address private _token2Address;

    uint256 private _token1TotalSupply;
    uint256 private _token2TotalSupply;

    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event SwapDeployed(string indexed name_, address indexed swap_);

    modifier reentrancyProtection() {
        require(_status != _ENTERED, 'Reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(
        string memory name_,
        Token token1_,
        Token token2_
    ) {
        emit SwapDeployed(name_, address(this));
        address admin_ = msg.sender;
        setAdmin(admin_);
        name = name_;
        _token1 = token1_;
        _token2 = token2_;
        _token1TotalSupply = token1_.totalSupply();
        _token2TotalSupply = token2_.totalSupply();
    }
    }

    function swap(uint256 amount) external reentrancyProtection {
        _token1.approveFrom(address(_token1), address(this), amount);
        _token2.approveFrom(address(_token2), address(this), amount);
        _swap(amount);
    }

    function unswap(uint256 amount) external reentrancyProtection {
        _token1.approveFrom(address(_token2), address(this), amount);
        _token2.approveFrom(address(_token1), address(this), amount);
        _unswap(amount);
    }

    function setAdmin(address admin_) internal {
        _admin = admin_;
        emit AdminChanged(_admin, admin_);

    function _swap(uint256 amount) internal {
        _safeTransferFrom(_token1, address(_token1), address(_token2), amount);
        _safeTransferFrom(_token2, address(_token2), address(_token1), amount);
    }

    function _unswap(uint256 amount) internal {
        _safeTransferFrom(_token1, address(_token2), address(_token1), amount);
        _safeTransferFrom(_token2, address(_token1), address(_token2), amount);
    }

    function _safeTransferFrom(
        Token token,
        address sender,
        address receiver,
        uint256 amount
    ) internal {
        bool sent = token.transferFrom(sender, receiver, amount);
        require(sent, 'Token transfer failed.');
    }
}

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;
    address private _owner;

    TokenFactory private _tokenFactory;

    // EVENTS
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event FactoryCreated(address indexed factory_);
    event SwapCreated(string name_, address swap_, address indexed token1_, address indexed token2_);
    event FallbackCalled(address indexed sender, uint256 value);

    constructor(address owner_) {
        address admin_ = msg.sender;
        setAdmin(admin_);
        setOwner(owner_);
    }

    receive() external payable {
        emit FallbackCalled(msg.sender, msg.value);
    }

    function createTokenFactory() external returns (TokenFactory) {
        if(address(_tokenFactory) == address(0)){
            TokenFactory tokenFactory_ = new TokenFactory();
            emit FactoryCreated(address(tokenFactory_));
            _tokenFactory = tokenFactory_;
            return tokenFactory_;
        }
        return _tokenFactory;
    }

    function createSwapper(string memory name, Token token1_, Token token2_) external returns (Swap) {
        Swap swap_ = new Swap(name, token1_, token2_);
        emit SwapCreated(name, address(swap_), address(token1_), address(token2_));
        return swap_;
    }

    function getTokenFactory() external view returns (TokenFactory) {
        return _tokenFactory;
    }

    function getAdmin() public view returns (address) {
        return address(_admin);
    }

    function getOwner() public view returns (address) {
        return address(_owner);
    }

    function setAdmin(address admin_) internal {
        _admin = admin_;
        emit AdminChanged(_admin, admin_);
    }

    function setOwner(address owner_) internal {
        _owner = owner_;
        emit OwnerChanged(_owner, owner_);
    }
}
