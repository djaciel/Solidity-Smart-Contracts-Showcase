// Goal
// Guess the correct outcome of the coin flip 10 times in a row.

import { ContractFactory, Signer } from "ethers"
import { CoinFlip, CoinFlipHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('CoinFlip', function () {
  let CoinFlip: ContractFactory
  let coinFlip: CoinFlip

  let CoinFlipHack: ContractFactory
  let coinFlipHack: CoinFlipHack

  let signers: Signer[]
  let owner: Signer
  let attacker: Signer

  before(async function () {
    CoinFlip = await ethers.getContractFactory('CoinFlip')
    coinFlip = (await CoinFlip.deploy()) as CoinFlip

    CoinFlipHack = await ethers.getContractFactory('CoinFlipHack')
    coinFlipHack = (await CoinFlipHack.deploy(coinFlip.address)) as CoinFlipHack

    signers = await ethers.getSigners()
    owner = signers[0]
    attacker = signers[1]
  })

  it('Should guess the correct outcome of the coin flip 10 times in a row', async function () {
    for (let i = 0; i < 10; i++) {
      await coinFlipHack.connect(attacker).attack()
    }
    expect(await coinFlip.consecutiveWins()).to.equal(10)
  })
})