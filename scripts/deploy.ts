// We require the Buidler Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `buidler run <script>` you'll find the Buidler
// Runtime Environment's members available in the global scope.
import { ethers } from "@nomiclabs/buidler";
import { Contract, ContractFactory } from "ethers";

async function main(): Promise<void> {
  // Buidler always runs the compile task when running scripts through it.
  // If this runs in a standalone fashion you may want to call compile manually
  // to make sure everything is compiled
  // await run("compile");

  const MATCH_RECEIVER = "0xDE174710543dCED471A5747Fe3060d11E881a356";

  // We get the contract to deploy
  const FlashProtocol: ContractFactory = await ethers.getContractFactory("FlashProtocol");
  console.log(`Start deploying Flash Protocol with match receiver: ${MATCH_RECEIVER}`);
  const flashProtocol: Contract = await FlashProtocol.deploy(MATCH_RECEIVER);
  await flashProtocol.deployed();

  console.log("FlashProtocol deployed to: ", flashProtocol.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
