// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

import FlashProtocol from "../artifacts/contracts/FlashProtocol.sol/FlashProtocol.json"


async function predictAddress() {
  const [liquidityProvider] = await ethers.getSigners()
  let nonce = await liquidityProvider.getTransactionCount();
  let address = await ethers.utils.getContractAddress({from: liquidityProvider.address, nonce})
  // let address = await ethers.utils.getContractAddress({from: "0x28931Ba0e10f66064384109FA2a19d4049CC4105", nonce:"0"})
  console.log(address)
}

async function getAddres(): Promise<any> {
  const [liquidityProvider] = await ethers.getSigners()
  console.log(liquidityProvider.address)
  return liquidityProvider
}

async function deployContract() {
  let account = await getAddres()

  let INITIAL_MINTER = "0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F"
  let INTIIAL_MATCH_RATIO = "2000"
  
  const factory = new ContractFactory(FlashProtocol.abi, FlashProtocol.bytecode, account);
  let tx = await factory
    .deploy(
      INITIAL_MINTER, INTIIAL_MATCH_RATIO,
      {
        gasLimit: 3000000,
      }

    )
  let result = await tx.deployTransaction.wait(1)
  console.log(result)
}

deployContract()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
