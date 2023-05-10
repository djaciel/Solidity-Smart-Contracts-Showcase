// Goal
// Claim ownership of the contract.

import { ContractFactory, Signer } from "ethers"
import { Telephone, TelephoneHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Telephone', function () {
  let Telephone: ContractFactory
  let telephone: Telephone

  let TelephoneHack: ContractFactory
  let telephoneHack: TelephoneHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    Telephone = await ethers.getContractFactory('Telephone')
    telephone = (await Telephone.deploy()) as Telephone

    TelephoneHack = await ethers.getContractFactory('TelephoneHack')
    telephoneHack = (await TelephoneHack.deploy(telephone.address)) as TelephoneHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should claim ownership of the contract', async function () {
    await telephoneHack.connect(attacker).attack()
    expect(await telephone.owner()).to.equal(await attacker.getAddress())
  })
})