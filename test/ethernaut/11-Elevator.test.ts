// Goal
// Reach the top of the building.

import { ContractFactory, Signer } from "ethers"
import { Elevator, ElevatorHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Elevator', () => {
  let Elevator: ContractFactory
  let elevator: Elevator

  let ElevatorHack: ContractFactory
  let elevatorHack: ElevatorHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]

    Elevator = await ethers.getContractFactory('Elevator')
    elevator = (await Elevator.deploy()) as Elevator

    ElevatorHack = await ethers.getContractFactory('ElevatorHack')
    elevatorHack = (await ElevatorHack.deploy(elevator.address)) as ElevatorHack
  })

  it('Should reach the top of the building', async () => {
    await elevatorHack.attack()
    expect(await elevator.top()).to.be.true
  })
})