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

// Custom Tokens
import './Template.sol'; // Template Contract
import './Token.sol'; // Token Contract
import './TokenFactory.sol'; // TokenFactory Contract
import './Swap.sol'; // Swap Contract

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = true;

    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin;
    address private _owner;

    TokenFactory private _tokenFactory;

    Swap private _swapper;
    Swap private _unswapper;

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event Fallback(address indexed sender, uint256 value);

    modifier reentrancyProtection() {
        require(_status != _ENTERED, 'Reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address owner_) {
        address admin_ = msg.sender;
        setAdmin(admin_);
        setOwner(owner_);
    }

    function setAdmin(address admin_) internal view {
        _admin = admin_;
    }

    function setOwner(address owner_) internal view {
        _owner = owner_;
    }

    function getAdmin() public view {
        return _admin;
    }

    function getOwner() public view {
        return _owner;
    }

    function createTokenFactory() external {
        _tokenFactory = new TokenFactory();
    }

    function createSwapper(Token _fuji, Token _tate) external {
        _swapper = new Swap(_fuji, _tate);
    }

    function createUnswapper(Token _tate, Token _haku) external {
        _unswapper = new Swap(_tate, _haku);
    }

    function getSwapperAddress() external view returns (address) {
        return address(_swapper);
    }

    function getUnswapperAddress() external view returns (address) {
        return address(_unswapper);
    }

    function swap(uint256 amount) external reentrancyProtection {
        _swapper._swap(amount);
    }

    function unswap(uint256 amount) external reentrancyProtection {
        _unswapper._swap(amount);
    }

    function submitTokens() external reentrancyProtection {
        fuji.transferFrom(address(fuji), _submissionAddress, 1000);
        haku.transferFrom(address(haku), _submissionAddress, 1000);
    }

    receive() external payable reentrancyProtection {
        emit Fallback(msg.sender, msg.value);
    }
}
