// Goal
// Makt the balance of the contract greater than zero.

import { Contract, ContractFactory, Signer } from "ethers"
import { ForceHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Force', () => {
  let Force: ContractFactory
  let force: Contract

  let ForceHack: ContractFactory
  let forceHack: ForceHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async () => {
    Force = await ethers.getContractFactory('Force')
    force = (await Force.deploy()) as Contract

    ForceHack = await ethers.getContractFactory('ForceHack')
    forceHack = (await ForceHack.deploy(force.address)) as ForceHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should send ether to Force contract', async () => {
    await forceHack.attack({ value: ethers.utils.parseEther('1') })
    const balance = await ethers.provider.getBalance(force.address)
    expect(balance.gt(0)).to.be.true
  })
})