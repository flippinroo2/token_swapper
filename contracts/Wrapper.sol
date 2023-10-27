//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './TokenFactory.sol';
import './Swap.sol';

contract Wrapper {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    address private _admin;
    address private _owner;

    TokenFactory private _tokenFactory;

    mapping(string => address) private _swapperAddresses;

    // EVENTS
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event FactoryCreated(address indexed factory);
    event SwapCreated(string name, address swap, address indexed token1, address indexed token2);
    event FallbackCalled(address indexed sender, uint256 value);

    constructor(address admin_) {
        address owner_ = msg.sender;
        setOwner(owner_);
        setAdmin(admin_);
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

    function createSwapper(string memory name_, Token token1_, Token token2_) external returns (Swap) {
        Swap swap_ = new Swap(name_, token1_, token2_);
        address swapAddress_ = address(swap_);
        _swapperAddresses[name_] = swapAddress_;
        emit SwapCreated(name_, swapAddress_, address(token1_), address(token2_));
        return swap_;
    }

    function getTokenFactory() external view returns (TokenFactory) {
        return _tokenFactory;
    }

    function getSwapperAddress(string memory name_) external view returns (address) {
        return _swapperAddresses[name_];
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
