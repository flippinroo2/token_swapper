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

// Access
import '@openzeppelin/contracts/access/Ownable.sol';

// Security
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

abstract contract Template is IERC20 {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    // The variables are oredered this way for memory efficiency.
    uint8 public constant TOKEN_DECIMALS = 18;
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;
    string public _name;
    string public _symbol;

    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
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
        _name = name_;
        _symbol = symbol_;
    }

    function getAdmin() public view returns (address) {
        return _admin;
    }

    function setAdmin(address admin) internal {
        address _previousAdmin = _admin;
        _admin = admin;
        emit AdminChanged(_previousAdmin, _admin);
    }

    function totalSupply() public view override virtual returns (uint256);

    function setTotalSupply(uint256 totalSupply_) internal virtual;

    function balanceOf(address account)
        external
        view
        virtual
        override
        returns (uint256);

    // function name() external view returns (string memory) {
    //     return _name;
    // }

    // function symbol() external view returns (string memory) {
    //     return _symbol;
    // }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool);

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256);

    function approve(address spender, uint256 amount) public virtual override returns (bool);

    function transferFrom(
        address spender,
        address recipient,
        uint256 amount
    ) external virtual override returns (bool);

    function mint(address account, uint256 amount) public virtual;

    function getTotalMinted() public view virtual returns (uint256);

    // New syntax for fallback functions.
    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }
}
