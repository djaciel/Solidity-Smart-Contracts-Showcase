import { expect } from 'chai'
import { ContractFactory, Signer } from 'ethers'
import { ethers } from 'hardhat'
import { MultiSigWallet } from '../../typechain-types/multiSigWallet'

describe('MultiSigWallet', function () {
  let MultiSigWallet: ContractFactory
  let multiSigWallet: MultiSigWallet

  let signers: Signer[]
  let ownerA: Signer
  let ownerB: Signer
  let ownerC: Signer

  let nonOwner: Signer

  before(async function () {
    MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
  })

  beforeEach(async function () {
    signers = await ethers.getSigners()
    ownerA = signers[0]
    ownerB = signers[1]
    ownerC = signers[2]

    nonOwner = signers[3]

    multiSigWallet = (await MultiSigWallet.deploy(
      [ownerA.getAddress(), ownerB.getAddress(), ownerC.getAddress()],
      2
    )) as MultiSigWallet
  })

  describe('deploy MultiSigWallet', function () {
    it('Should deploy MultiSigWallet with 3 owners and 2 required confirmations', async function () {
      expect(await multiSigWallet.getOwners()).to.eql([
        await ownerA.getAddress(),
        await ownerB.getAddress(),
        await ownerC.getAddress(),
      ])
      expect(await multiSigWallet.numConfirmationsRequired()).to.equal(2)
    })

    it('Should revert if there are no owners', async function () {
      await expect(MultiSigWallet.deploy([], 2)).to.be.revertedWith('owners required')
    })

    it('Should revert if number of required confirmations is 0', async function () {
      await expect(
        MultiSigWallet.deploy([ownerA.getAddress(), ownerB.getAddress()], 0)
      ).to.be.revertedWith('invalid number of required confirmations')
    })

    it('Should revert if number of required confirmations is greater than number of owners', async function () {
      await expect(
        MultiSigWallet.deploy([ownerA.getAddress(), ownerB.getAddress()], 3)
      ).to.be.revertedWith('invalid number of required confirmations')
    })

    it('Should revert if a owner is a zero address', async function () {
      await expect(
        MultiSigWallet.deploy([ethers.constants.AddressZero, ownerB.getAddress()], 2)
      ).to.be.revertedWith('invalid owner')
    })

    it('Should revert if a owner is duplicated', async function () {
      await expect(
        MultiSigWallet.deploy([ownerA.getAddress(), ownerA.getAddress()], 2)
      ).to.be.revertedWith('owner not unique')
    })
  })

  describe('transaction', function () {
    it('Should revert if a non-owner submits a transaction', async function () {
      await expect(
        multiSigWallet.connect(nonOwner).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      ).to.be.revertedWith('not owner')
    })

    it('Should submit a transaction', async function () {
      await expect(
        multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      )
        .to.emit(multiSigWallet, 'SubmitTransaction')
        .withArgs(await ownerA.getAddress(), 0, ethers.constants.AddressZero, 0, '0x')

      expect(await multiSigWallet.getTransactionCount()).to.equal(1)

      const tx = await multiSigWallet.getTransaction(0)
      expect(tx.to).to.equal(ethers.constants.AddressZero)
      expect(tx.value).to.equal(0)
      expect(tx.data).to.equal('0x')
      expect(tx.executed).to.equal(false)
      expect(tx.numConfirmations).to.equal(0)
    })

    it('Should revert if a non-owner confirms a transaction', async function () {
      await expect(multiSigWallet.connect(nonOwner).confirmTransaction(0)).to.be.revertedWith(
        'not owner'
      )
    })

    it('Should revert if a owner confirms a non-existing transaction', async function () {
      await expect(multiSigWallet.connect(ownerA).confirmTransaction(0)).to.be.revertedWith(
        'tx does not exist'
      )
    })

    it('Should confirm a transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')

      await expect(await multiSigWallet.connect(ownerA).confirmTransaction(0))
        .to.emit(multiSigWallet, 'ConfirmTransaction')
        .withArgs(await ownerA.getAddress(), 0)

      const tx = await multiSigWallet.getTransaction(0)
      expect(tx.numConfirmations).to.equal(1)
    })

    it('Should revert if a owner confirms a transaction twice', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)

      await expect(multiSigWallet.connect(ownerA).confirmTransaction(0)).to.be.revertedWith(
        'tx already confirmed'
      )
    })

    it('Should revert if a owner confirms a executed transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)
      await multiSigWallet.connect(ownerB).confirmTransaction(0)

      await multiSigWallet.connect(ownerA).executeTransaction(0)

      await expect(multiSigWallet.connect(ownerA).confirmTransaction(0)).to.be.revertedWith(
        'tx already executed'
      )
    })

    it('Should execute a transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)
      await multiSigWallet.connect(ownerB).confirmTransaction(0)

      await expect(await multiSigWallet.connect(ownerA).executeTransaction(0))
        .to.emit(multiSigWallet, 'ExecuteTransaction')
        .withArgs(await ownerA.getAddress(), 0)

      const tx = await multiSigWallet.getTransaction(0)
      expect(tx.executed).to.equal(true)
    })

    it('Should revert if a non-owner executes a transaction', async function () {
      await expect(multiSigWallet.connect(nonOwner).executeTransaction(0)).to.be.revertedWith(
        'not owner'
      )
    })

    it('Should revert if a owner executes a non-existing transaction', async function () {
      await expect(multiSigWallet.connect(ownerA).executeTransaction(0)).to.be.revertedWith(
        'tx does not exist'
      )
    })

    it('Should revert if a owner executes a non-confirmed transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')

      await expect(multiSigWallet.connect(ownerA).executeTransaction(0)).to.be.revertedWith(
        'cannot execute tx'
      )
    })

    it('Should revert if a owner executes a executed transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)
      await multiSigWallet.connect(ownerB).confirmTransaction(0)

      await multiSigWallet.connect(ownerA).executeTransaction(0)

      await expect(multiSigWallet.connect(ownerA).executeTransaction(0)).to.be.revertedWith(
        'tx already executed'
      )
    })

    it('Should revert if a owner executes a transaction with a value greater than the balance', async function () {
      await multiSigWallet
        .connect(ownerA)
        .submitTransaction(ethers.constants.AddressZero, 100, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)
      await multiSigWallet.connect(ownerB).confirmTransaction(0)

      await expect(multiSigWallet.connect(ownerA).executeTransaction(0)).to.be.revertedWith(
        'tx failed'
      )
    })

    it('Should revoke a confirmation', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)

      await expect(await multiSigWallet.connect(ownerA).revokeConfirmation(0))
        .to.emit(multiSigWallet, 'RevokeConfirmation')
        .withArgs(await ownerA.getAddress(), 0)

      const tx = await multiSigWallet.getTransaction(0)
      expect(tx.numConfirmations).to.equal(0)
    })

    it('Should revert if a non-owner revokes a confirmation', async function () {
      await expect(multiSigWallet.connect(nonOwner).revokeConfirmation(0)).to.be.revertedWith(
        'not owner'
      )
    })

    it('Should revert if a owner revokes a non-existing transaction', async function () {
      await expect(multiSigWallet.connect(ownerA).revokeConfirmation(0)).to.be.revertedWith(
        'tx does not exist'
      )
    })

    it('Should revert if a owner revokes a non-confirmed transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')

      await expect(multiSigWallet.connect(ownerA).revokeConfirmation(0)).to.be.revertedWith(
        'tx not confirmed'
      )
    })

    it('Should revert if a owner revokes a executed transaction', async function () {
      await multiSigWallet.connect(ownerA).submitTransaction(ethers.constants.AddressZero, 0, '0x')
      await multiSigWallet.connect(ownerA).confirmTransaction(0)
      await multiSigWallet.connect(ownerB).confirmTransaction(0)

      await multiSigWallet.connect(ownerA).executeTransaction(0)

      await expect(multiSigWallet.connect(ownerA).revokeConfirmation(0)).to.be.revertedWith(
        'tx already executed'
      )
    })

    it('Should emit an event when a deposit is made', async function () {
      await expect(
        await ownerA.sendTransaction({ to: multiSigWallet.address, value: 100 })
      ).to.emit(multiSigWallet, 'Deposit')

      const balance = await ethers.provider.getBalance(multiSigWallet.address)
      expect(balance).to.equal(100)
    })
  })
})
