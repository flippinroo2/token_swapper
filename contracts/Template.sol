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

// Utils
import '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import '@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol';

abstract contract Template is IERC20 {
// abstract contract Template is IERC20, IERC165, IERC1820Registry {
    using Address for address;
    using Arrays for uint256[];
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    // The variables are oredered this way for memory efficiency.
    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;

    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event Fallback(address indexed sender, uint256 value);
    // event InterfaceImplementerSet(address indexed account, bytes32 indexed interfaceHash, address indexed implementer);
    // event ManagerChanged(address indexed account, address indexed newManager);

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

    constructor() {
        if (DEBUG) {
            console.log('constructor()');
            console.log('Contract creator: %s', msg.sender);
        }
        setAdmin(msg.sender);
    }

    function setAdmin(address admin) internal {
        address _previousAdmin = _admin;
        _admin = admin;
        emit AdminChanged(_previousAdmin, _admin);
    }

    function getAdmin() public view returns (address) {
        return _admin;
    }

    function totalSupply() external view override virtual returns (uint256);

    function setTotalSupply(uint256 totalSupply_) internal virtual;

    function balanceOf(address account)
        external
        view
        virtual
        override
        returns (uint256);

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

    // function supportsInterface(bytes4 interfaceId) external view returns (bool);

    // function setManager(address account, address newManager) external;

    // function getManager(address account) external view returns (address);

    // function setInterfaceImplementer(address account, bytes32 _interfaceHash) external view returns (address);

    // function updateERC165Cache(address account, bytes4 interfaceId) external;

    // function implementsERC165Interface(address account, bytes4 interfaceId) external view returns (bool);

    // function implementsERC165InterfaceNoCache(address account, bytes4 interfaceId) external view returns (bool);

    // New syntax for fallback functions.
    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }
}
