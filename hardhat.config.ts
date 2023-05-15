import * as dotenv from 'dotenv'

import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-contract-sizer'
import 'hardhat-deploy'
import 'hardhat-docgen'
import 'hardhat-abi-exporter'
import networks from './hardhat.network'

dotenv.config()

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      { version: '0.5.16' },
      { version: '0.6.12' },
      { version: '0.7.6' },
      {
        version: '0.8.18',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
    except: ['./test'],
  },
  abiExporter: {
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [':LiquidityMining$'],
  },
  contractSizer: {
    runOnCompile: false,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks,
}

export default config
