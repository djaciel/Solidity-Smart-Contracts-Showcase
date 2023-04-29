import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const contractName = 'Lock';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  async function main() {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;
    const lockedAmount = ethers.utils.parseEther("0.001");

    const deployResult = await deploy(contractName, {
      from: deployer,
      args: [unlockTime],
      value: lockedAmount,
      log: true,
    });

    console.log(`${contractName} deployed to ${deployResult.address}`);

    return true;
  }

  await main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
};

export default func;