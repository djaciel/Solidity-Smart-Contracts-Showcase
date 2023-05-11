// Goal
// Deny anyone to become King.

import { ContractFactory, Signer } from 'ethers'
import { King, KingHack } from '../../typechain-types'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { string } from 'hardhat/internal/core/params/argumentTypes'

// Solution
describe('King', function () {
  let King: ContractFactory
  let king: King

  let KingHack: ContractFactory
  let kingHack: KingHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]

    King = await ethers.getContractFactory('King')
    king = (await King.deploy({value: ethers.utils.parseEther('1')})) as King

    KingHack = await ethers.getContractFactory('KingHack')
    kingHack = (await KingHack.deploy(king.address)) as KingHack
  })

  it('Should deny anyone to become King', async function () {
    let prize = await king.prize()
    
    await kingHack.connect(attacker).attack({ value: prize })
    expect(await king._king()).to.be.equal(kingHack.address)

    try {
      await king.connect(attacker).fallback({ value: prize })
      expect.fail('Revert expected')
    } catch (error: any) {
      expect(error.reason).to.contain('no fallback nor receive function')
    }
  })
})
