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

    function setAdmin(address admin_) internal {
        _admin = admin_;
        emit AdminChanged(_admin, admin_);
    }

    function getAdmin() public view returns (address) {
        return address(_admin);
    }

    function setOwner(address owner_) internal {
        _owner = owner_;
        emit OwnerChanged(_owner, owner_);
    }

    function getOwner() public view returns (address) {
        return address(_owner);
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

    function getTokenFactory() external view returns (TokenFactory) {
        return _tokenFactory;
    }

    function createSwapper(string memory name, Token token1_, Token token2_) external returns (Swap) {
        Swap swap_ = new Swap(name, token1_, token2_);
        emit SwapCreated(name, address(swap_), address(token1_), address(token2_));
        return swap_;
    }

    receive() external payable {
        emit FallbackCalled(msg.sender, msg.value);
    }
}
