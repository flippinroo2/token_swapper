//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Custom Tokens
import './TokenFactory.sol'; // TokenFactory Contract
import './Swap.sol'; // Swap Contract

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

    uint8 private constant _NOT_ENTERED = 1;
    uint8 private constant _ENTERED = 2;
    uint8 private _status;

    address private _admin; // Addresses default to 0x000...000;
    address private _owner;

    TokenFactory private _tokenFactory;

    // EVENTS
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event FactoryCreated(address indexed factory_);
    event SwapCreated(string name_, address swap_, address indexed token1_, address indexed token2_);
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
        _admin = admin_;
        emit AdminChanged(_admin, admin_);
    }

    function getAdmin() public view returns (address) {
        return address(_admin);
    }

    function setOwner(address owner_) internal {
        if(DEBUG){
            console.log('setOwner()');
            console.log('Previous Owner: %s', _owner);
            console.log('New Owner: %s', owner_);
        }
        _owner = owner_;
        emit OwnerChanged(_owner, owner_);
    }

    function getOwner() public view returns (address) {
        return address(_owner);
    }

    function createTokenFactory() external reentrancyProtection returns (TokenFactory) {
        if(address(_tokenFactory) == address(0)){
            TokenFactory tokenFactory_ = new TokenFactory();
            emit FactoryCreated(address(tokenFactory_));
            _tokenFactory = tokenFactory_;
            return tokenFactory_;
        }
        return _tokenFactory;
    }

    function getTokenFactory() external view returns (TokenFactory) {
        return _tokenFactory;
    }

    function createSwapper(string memory name, Token token1_, Token token2_) external reentrancyProtection returns (Swap) {
        if(DEBUG){
            console.log('createSwapper()');
            console.log('name: %s', name);
            console.log('token1_: %s', address(token1_));
            console.log('token2_: %s', address(token2_));
        }
        Swap swap_ = new Swap(name, token1_, token2_);
        emit SwapCreated(name, address(swap_), address(token1_), address(token2_));
        return swap_;
    }

    receive() external payable reentrancyProtection {
        emit FallbackCalled(msg.sender, msg.value);
    }
}
