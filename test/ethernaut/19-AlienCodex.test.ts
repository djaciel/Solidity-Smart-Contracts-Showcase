// Goal
// Claim ownership of the AlienCodex contract.

import { ContractFactory, Signer } from "ethers"
import { AlienCodex, AlienCodexHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('AlienCodex', function () {
  let AlienCodex: ContractFactory
  let alienCodex: AlienCodex

  let AlienCodexHack: ContractFactory
  let alienCodexHack: AlienCodexHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    AlienCodex = await ethers.getContractFactory('AlienCodex')
    alienCodex = (await AlienCodex.deploy()) as AlienCodex

    AlienCodexHack = await ethers.getContractFactory('AlienCodexHack')
    alienCodexHack = (await AlienCodexHack.deploy(alienCodex.address)) as AlienCodexHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should claim ownership of the AlienCodex contract', async function () {
    await alienCodexHack.connect(attacker).attack()
    const owner = await alienCodex.owner()
    expect(owner).to.equal(await attacker.getAddress())
  })
})