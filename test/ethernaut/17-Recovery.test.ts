// Goal
// Recover the 0.001 ether from the lost contract address.

import { ContractFactory, Signer } from 'ethers'
import { Recovery, SimpleToken } from '../../typechain-types'
import { ethers } from 'hardhat'
import { expect } from 'chai'

// Solution
describe('Recovery', function () {
  let Recovery: ContractFactory
  let recovery: Recovery

  let signers: Signer[]
  let owner: Signer
  let other: Signer

  before(async function () {
    Recovery = await ethers.getContractFactory('Recovery')
    recovery = (await Recovery.deploy()) as Recovery

    signers = await ethers.getSigners()
    owner = signers[0]
    other = signers[1]
  })

  it('Should recover the 0.001 ether', async function () {
    const amount = ethers.utils.parseEther('0.001')
    await recovery.generateToken('TEST', 0)

    const tokenGeneratedAddress = ethers.utils.getContractAddress({
      from: recovery.address,
      nonce: 1,
    })

    owner.sendTransaction({
      to: tokenGeneratedAddress,
      value: amount,
    })

    const tokenGeneratedContract = (await ethers.getContractAt(
      'SimpleToken',
      tokenGeneratedAddress
    )) as SimpleToken

    const otherBalanceBefore = await ethers.provider.getBalance(await other.getAddress())
    await tokenGeneratedContract.destroy(await other.getAddress())
    const otherBalanceAfter = await ethers.provider.getBalance(await other.getAddress())

    expect(otherBalanceAfter.sub(otherBalanceBefore)).to.be.equal(amount)
  })
})
