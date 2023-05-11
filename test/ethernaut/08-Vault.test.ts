// Goal
// Unlock the Vault contract.

import { ContractFactory, Signer } from "ethers"
import { Vault } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Vault', function () {
  let Vault: ContractFactory
  let vault: Vault

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Vault = await ethers.getContractFactory('Vault')
    vault = (await Vault.deploy(ethers.utils.formatBytes32String('h3ll0 w0r1d'))) as Vault

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should unlock the vault', async function () {
    const password = await ethers.provider.getStorageAt(vault.address, 1)
    await vault.unlock(password)
    const isUnlocked = await vault.locked()
    expect(isUnlocked).to.be.false
  })
})