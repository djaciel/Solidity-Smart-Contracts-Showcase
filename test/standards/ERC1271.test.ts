import { expect } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "hardhat";


describe("ERC1271", function () {
  let ERC1271: ContractFactory;
  let erc1271: Contract;

  let signers: Signer[];
  let owner: Signer;
  let otherAccount: Signer;

  before(async function () {
    ERC1271 = await ethers.getContractFactory("ERC1271");
  });

  beforeEach(async function () {
    signers = await ethers.getSigners();
    owner = signers[0];
    otherAccount = signers[1];

    erc1271 = await ERC1271.deploy();
  });

  describe("isValidSignature", function () {
    it("Should return 0x20c13b0b if the signature is valid", async function () {
      const message = "Hello, world!";
      const messageHash = ethers.utils.hashMessage(message);
      const signature = await owner.signMessage(message);

      expect(await erc1271.isValidSignature(messageHash, signature)).to.equal(
        '0x20c13b0b'
      );
    });

    it("Should return 0x00000000 if the signature is invalid", async function () {
      const message = "Hello, world!";
      const messageHash = ethers.utils.hashMessage(message);
      const signature = await otherAccount.signMessage(message);

      expect(await erc1271.isValidSignature(messageHash, signature)).to.equal(
        '0x00000000'
      );
    });
  });
});