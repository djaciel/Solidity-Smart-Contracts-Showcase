// Goal
// Return 42 from whatIsTheMeaningOfLife().
// Max 10 opcodes

import { ContractFactory } from "ethers"
import { MagicNum, MagicNumHack } from "../../typechain-types"
import { ethers } from "hardhat"
import { expect } from "chai"

// Solution
describe('MagicNum', function () {
  let MagicNum: ContractFactory
  let magicNum: MagicNum

  let MagicNumHack: ContractFactory
  let magicNumHack: MagicNumHack

  before(async function () {
    MagicNum = await ethers.getContractFactory('MagicNum')
    magicNum = (await MagicNum.deploy()) as MagicNum

    MagicNumHack = await ethers.getContractFactory('MagicNumHack')
    magicNumHack = (await MagicNumHack.deploy(magicNum.address)) as MagicNumHack
  })

  it('Should return 42 from whatIsTheMeaningOfLife()', async function () {
    await magicNumHack.attack()
    const meaningOfLife = await magicNumHack.getMeaningOfLife()
    expect(meaningOfLife).to.equal(42)
  })
})
    