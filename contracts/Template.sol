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

    modifier security {
        require(msg.sender == _admin, 'Must be contract admin');
        _;
    }

    modifier safe(address account) {
        require(account != address(0), 'Cannot transact with the zero address');
        _;
    }

    constructor() {
        address admin = msg.sender;
        setAdmin(admin);
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
        public
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

    receive() external payable {
        emit Fallback(msg.sender, msg.value);
    }
}
