// Goal
// Deny the owner from withdrawing funds.

import { ContractFactory, Signer } from "ethers"
import { Denial } from "../../typechain-types"
import { DenialHack } from "../../typechain-types/ethernaut/Denial.sol"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Denial', function () {
  let Denial: ContractFactory
  let denial: Denial

  let DenialHack: ContractFactory
  let denialHack: DenialHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Denial = await ethers.getContractFactory('Denial')
    denial = (await Denial.deploy()) as Denial

    DenialHack = await ethers.getContractFactory('DenialHack')
    denialHack = (await DenialHack.deploy(denial.address)) as DenialHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should deny the owner from withdrawing funds', async function () {
    owner.sendTransaction({ to: denial.address, value: 100 })
    await denialHack.connect(attacker).attack()

    try {
      
    } catch (error) {
      
    }
    try {
      await denial.withdraw()
    } catch (error: any) {
      console.log(error)
      expect(error.reason).to.contain('no fallback nor receive function')
    }

    // const balance = await ethers.provider.getBalance(denialHack.address)
    // console.log(balance.toString())
    // expect(balance).to.equal(1)

    // console.log((await ethers.provider.getBalance(denial.address)).toString())

    // const denialOwnerBalance = await ethers.provider.getBalance(await denial.owner())
    // console.log(denialOwnerBalance.toString())
    // expect(denialOwnerBalance).to.equal(0)
  })
})