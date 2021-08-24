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

    address private _admin;
    address private _address;
    address private constant _submissionAddress = 0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd;

    Token public fuji;
    Token public haku;
    Token public tate;

    Swap private _swapper;
    Swap private _unswapper;

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

    function swap(uint256 amount) public {
        _swapper._swap(amount);
    }

    function unswap(uint256 amount) public {
        _unswapper._swap(amount);
    }

    function submitTokens() external {
        fuji.transferFrom(address(fuji), _submissionAddress, 1000);
        haku.transferFrom(address(haku), _submissionAddress, 1000);
    }
}
