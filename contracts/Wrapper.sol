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

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event SwapCreated(address indexed token1_, address indexed token2_);
    event FallbackCalled(address indexed sender, uint256 value);

    modifier reentrancyProtection() {
        require(_status != _ENTERED, 'Reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address owner_) {
        address admin_ = msg.sender;
        if(DEBUG){
            console.log('\n\nWrapper()');
            console.log('admin_: %s, owner_: %s', admin_, owner_);
        }
        setAdmin(admin_);
        setOwner(owner_);
    }

    function setAdmin(address admin_) internal {
        if(DEBUG){
            console.log('setAdmin()');
            console.log('Previous Admin: %s', _admin);
            console.log('New Admin: %s', admin_);
        }
        emit AdminChanged(_admin, admin_);
        _admin = admin_;
    }

    function setOwner(address owner_) internal {
        if(DEBUG){
            console.log('setOwner()');
            console.log('Previous Owner: %s', _owner);
            console.log('New Owner: %s', owner_);
        }
        emit OwnerChanged(_owner, owner_);
        _owner = owner_;
    }

    function getAdmin() public view returns (address) {
        return address(_admin);
    }

    function getOwner() public view returns (address) {
        return address(_owner);
    }

    function createTokenFactory() external returns (TokenFactory) {
        _tokenFactory = new TokenFactory();
    }

    function createSwapper(Token token1_, Token token2_) external returns (Swap) {
        if(DEBUG){
            console.log('createSwapper()');
            console.log('token1_: %s', address(token1_));
            console.log('token2_: %s', address(token2_));
        }
        Swap swap = new Swap(token1_, token2_);
        emit SwapCreated(address(token1_), address(token2_));
        return swap;
    }

    receive() external payable reentrancyProtection {
        emit FallbackCalled(msg.sender, msg.value);
    }
}
