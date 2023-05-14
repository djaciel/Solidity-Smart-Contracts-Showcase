// Goal
// Register as an entrant.

import { expect } from "chai"
import { ContractFactory, Signer } from "ethers"
import { ethers } from "hardhat"
import { GatekeeperTwo, GatekeeperTwoHack } from "../../typechain-types"

// Solution
describe('GatekeeperTwo', function () {
  let GatekeeperTwo: ContractFactory
  let gatekeeperTwo: GatekeeperTwo

  let GatekeeperTwoHack: ContractFactory
  let gatekeeperTwoHack: GatekeeperTwoHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    GatekeeperTwo = await ethers.getContractFactory('GatekeeperTwo')
    gatekeeperTwo = (await GatekeeperTwo.deploy()) as GatekeeperTwo

    GatekeeperTwoHack = await ethers.getContractFactory('GatekeeperTwoHack')

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should register as an entrant', async function () {
    gatekeeperTwoHack = (await GatekeeperTwoHack.connect(attacker).deploy(gatekeeperTwo.address)) as GatekeeperTwoHack
    expect(await gatekeeperTwo.entrant()).to.equal(await attacker.getAddress())
  })
})