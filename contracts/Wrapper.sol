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
    address private _address;

    Token public fuji;
    Token public haku;
    Token public tate;

    Swap private _swapper;
    Swap private _unswapper;

    modifier reentrancyProtection() {
        require(_status != _ENTERED, 'Reentrant call');
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address address_) {
        address admin = msg.sender;
        _admin = admin;
        _address = address_;
        TokenFactory tokenFactory = new TokenFactory();

        fuji = tokenFactory.createToken('Fuji', 'FUJI', 18, 1100);
        haku = tokenFactory.createToken('Haku', 'HAKU', 18, 1050);
        tate = tokenFactory.createToken('Tate', 'TATE', 18, 100);

        fuji.approveFrom(address(fuji), address(this), 1100);
        haku.approveFrom(address(haku), address(this), 1050);
        tate.approveFrom(address(tate), address(this), 100);

        fuji.transferFrom(address(fuji), address(this), 100);
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

    function swap(uint256 amount) public reentrancyProtection {
        _swapper._swap(amount);
    }

    function unswap(uint256 amount) public reentrancyProtection {
        _unswapper._swap(amount);
    }

    function submitTokens() external {
        fuji.transferFrom(address(fuji), _submissionAddress, 1000);
        haku.transferFrom(address(haku), _submissionAddress, 1000);
    }
}
