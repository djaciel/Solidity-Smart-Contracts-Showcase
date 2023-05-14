// Goal
// Getting our token balance to 0.

import { ContractFactory, Signer } from "ethers"
import { NaughtCoin, NaughtCoinHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('NaughtCoin', function () {
  let NaughtCoin: ContractFactory
  let naughtCoin: NaughtCoin

  let NaughtCoinHack: ContractFactory
  let naughtCoinHack: NaughtCoinHack

  let signers: Signer[]
  let owner: Signer

  before(async function () {
    signers = await ethers.getSigners()
    owner = signers[0]

    NaughtCoin = await ethers.getContractFactory('NaughtCoin')
    naughtCoin = (await NaughtCoin.deploy(await owner.getAddress())) as NaughtCoin

    NaughtCoinHack = await ethers.getContractFactory('NaughtCoinHack')
    naughtCoinHack = (await NaughtCoinHack.deploy(naughtCoin.address)) as NaughtCoinHack
  })

  it('Should get our token balance to 0', async function () {
    const balance = await naughtCoin.balanceOf(await owner.getAddress())
    await naughtCoin.approve(naughtCoinHack.address, balance)
    await naughtCoinHack.attack()
    const newBalance = await naughtCoin.balanceOf(await owner.getAddress())
    const naughtCoinHackBalance = await naughtCoin.balanceOf(naughtCoinHack.address) 
    expect(newBalance).to.equal(0)
    expect(naughtCoinHackBalance).to.equal(balance) 
  })
})