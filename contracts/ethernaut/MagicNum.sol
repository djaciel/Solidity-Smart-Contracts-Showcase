// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}

// MagicNum Hack Contract
contract MagicNumHack {
    // more than 10 opcodes
    // function whatIsTheMeaningOfLife() external pure returns (uint256) {
    //     return 42;
    // }
    MagicNum public immutable magicNum;

    constructor(MagicNum _magicNum) {
        magicNum = _magicNum;
    }

    function attack() external {
        bytes memory bytecode = hex"69602a60005260206000f3600052600a6016f3";
        address addr;

        assembly {
            addr := create(0, add(bytecode, 0x20), 0x13)
        }
        require(addr != address(0), "Failed to deploy contract");

        magicNum.setSolver(addr);
    }

    function getMeaningOfLife() external view returns (uint256) {
        return IMeaningOfLife(magicNum.solver()).getMeaningOfLife();
    }
}

interface IMeaningOfLife {
    function getMeaningOfLife() external view returns (uint);
}