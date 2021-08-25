//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Hardhat - Console Log
import 'hardhat/console.sol';

// Math
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

// Libraries
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

// Custom Tokens
import './Token.sol'; // Token Contract

contract Swap {
    using Address for address;
    using SafeMath for uint256;
    using Strings for string;

    bool private constant DEBUG = false;

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
        address admin_ = msg.sender;
        setAdmin(admin_);

        name = name_;

        _token1 = token1_;
        _token2 = token2_;

        _token1TotalSupply = token1_.totalSupply();
        _token2TotalSupply = token2_.totalSupply();

        if(DEBUG){
            console.log('\n\nSwap()');
            console.log('token1_: %s', address(token1_));
            console.log('token2_: %s', address(token2_));
            // console.log('_token1TotalSupply');
            // console.log(_token1TotalSupply);
            // console.log('_token2TotalSupply');
            // console.log(_token2TotalSupply);
        }
        emit SwapDeployed(name_, address(this));
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

    function _swap(uint256 amount) external reentrancyProtection {
        _token1.approveFrom(address(_token1), address(this), amount);
        _token2.approveFrom(address(_token2), address(this), amount);

        _token1.approveFrom(address(_admin), address(this), amount);
        _token2.approveFrom(address(_admin), address(this), amount);

        _safeTransferFrom(_token1, _admin, address(_token2), amount);
        _safeTransferFrom(_token2, address(_token2), _admin, amount);
    }

    function _safeTransferFrom(
        Token token,
        address sender,
        address receiver,
        uint256 amount
    ) internal {
        if(DEBUG){
            console.log('\nsender: %s', sender);
            console.log('receiver: %s', receiver);
            // console.log('amount');
            // console.log(amount);
        }
        bool sent = token.transferFrom(sender, receiver, amount);
        require(sent, 'Token transfer failed.');
    }
}
