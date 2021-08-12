//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Token
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Arrays.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';


contract Template is IERC20 {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

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
    event Fallback(address indexed sender, uint256 value);

    // Function Modifiers
    modifier security {
        require(msg.sender == _admin, 'Must be contract admin');
        _;
    }

    modifier safe(address account) {
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
        setAdmin(msg.sender);
        // setTotalSupply(totalSupply_);
        // mint(getAdmin(), totalSupply_);
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

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function balanceOf(address account)
        external
        view
        override
        returns (uint256)
    {
        return _balances[account];
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
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function approve(address spender, uint256 amount) public override returns (bool){
        _approve(msg.sender, spender, amount);
        return true;
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

    function getAdmin() public view returns (address) {
        return _admin;
    }

    function getTotalMinted() public view returns (uint256) {
        return _totalMinted;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function setAdmin(address admin) internal {
        address _previousAdmin = _admin;
        _admin = admin;
        emit AdminChanged(_previousAdmin, _admin);
    }

    function setTotalSupply(uint256 totalSupply_) internal {
        _totalSupply = totalSupply_;
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
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

    // New syntax for fallback functions.
    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }
}


contract Token is Template {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    // The variables are oredered this way for memory efficiency.
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) payable Template(name_, symbol_) {
        setAdmin(msg.sender);
        setTotalSupply(totalSupply_);
        mint(getAdmin(), totalSupply_);
    }
}


contract Swap {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _address1;
    Template private _token1;

    address private _address2;
    Template private _token2;

    constructor(
        address address1_,
        Template token1_,
        address address2_,
        Template token2_
    ) {
        _address1 = address1_;
        _token1 = token1_;
        _address2 = address2_;
        _token2 = token2_;
    }

    function _swap(uint256 amount) public view {
        require(
            msg.sender == _address1 || msg.sender == _address2,
            'Not an authorized address.'
        );
        require(
            _token1.allowance(_address1, address(this)) >= amount,
            'Token 1 allowance is too low.'
        );
        require(
            _token2.allowance(_address2, address(this)) >= amount,
            'Token 2 allowance is too low.'
        );
        // _safeTransferFrom(_token1Address, _address1, _address2, amount);
        // _safeTransferFrom(_token2Address, _address2, _address1, amount);
    }

    function _safeTransferFrom(
        Template token,
        address sender,
        address receiver,
        uint256 amount
    ) private {
        bool sent = token.transferFrom(sender, receiver, amount);
        require(sent, 'Token transfer failed.');
    }
}


contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;
    address public contractAddress;
    address private _address1;
    address private _address2;

    Swap private _fujiTateSwapper;
    Swap private _hakuTateSwapper;

    // Was testing a different method for instantiating the Swap contract.
    string[] fujiArgs = ['Fuji', 'FUJI'];
    string[] hakuArgs = ['Haku', 'HAKU'];
    string[] tateArgs = ['Tate', 'TATE'];

    Template private _fuji = new Token(fujiArgs[0], fujiArgs[1], 1100);
    Template private _haku = new Token(hakuArgs[0], hakuArgs[1], 1050);
    Template private _tate = new Token(tateArgs[0], tateArgs[1], 1000);

    constructor(address address1_, address address2_) {
        _admin = msg.sender;
        contractAddress = address(this);
        _address1 = address1_;
        _address2 = address2_;
        _fujiTateSwapper = new Swap(_address1, _fuji, _address2, _tate);
        _hakuTateSwapper = new Swap(_address1, _haku, _address2, _tate);
    }

    function swap(uint256 amount) public view {
        _fujiTateSwapper._swap(amount);
    }

    function unswap(uint256 amount) public view {
        _hakuTateSwapper._swap(amount);
    }
}
