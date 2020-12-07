import {
  defaultAbiCoder,
  hexlify,
  keccak256,
  toUtf8Bytes,
  solidityPack
} from "ethers/lib/utils";
import { expect, use } from "chai";
import { deployContract, MockProvider, solidity, createFixtureLoader, loadFixture } from "ethereum-waffle";
import FlashProtocolArtifact from "../artifacts/contracts/FlashProtocol.sol/FlashProtocol.json";
import FlashTokenArtifact from "../artifacts/contracts/tests/flash-token/FlashToken.sol/FlashToken.json"
import { constants, ethers, providers, ContractFactory, utils } from "ethers";
// import { ecsign } from "ethereumjs-util";
import { tokenFixture } from "./utils/fixtures"

use(solidity);

async function approve(FlashProtocol: any, FlashToken: any) {
  await FlashToken.approve(FlashProtocol.address, constants.MaxUint256);
}

describe("Flash token", async () => {

  const provider = new MockProvider({
    ganacheOptions: {
      "hardfork": 'istanbul',
      "mnemonic": 'horn horn horn horn horn horn horn horn horn horn horn horn',
      "gasLimit": 9999999
    }
  })
  const [wallet, walletTo] = provider.getWallets()

  const loadFixture = createFixtureLoader([wallet], provider)

  let FlashToken: ethers.Contract

  let FlashProtocol: ethers.Contract;

  it('deployFlashProtocol', async () => {
    FlashProtocol = await deployContract(walletTo, FlashProtocolArtifact, [wallet.address]);
    FlashToken = await loadFixture(tokenFixture)
    expect(FlashToken.address).to.equal("0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA");
  });

  it('stake', async () => {
    await FlashToken.approve(FlashProtocol.address, constants.MaxUint256);

    let bytes32Param = await ethers.utils.formatBytes32String("0x");

    let protocol = await FlashProtocol.attach(wallet.address);

    let tx = await protocol.stake("100000000000000000", "3", walletTo.address, bytes32Param)

    console.log(tx)
    let receipt = await provider.getTransaction(tx.hash)


    let block = await provider.getBlock(String(receipt.blockHash))



    const logs = await provider.getLogs({
      address: protocol.address,
      topics: ["0x8872a0bfe035dd55f2341f67aa0f9a8196bb3f97e132b6d3cb2f53f91aaa93f9"]
    });

    console.log(logs)
    //  )
    // let id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
    //   [
    //     "100000000000000000",
    //     "3",
    //     wallet.address,
    //     walletTo.address,
    //     block.timestamp
    //   ]
    // )

    let stake = await FlashProtocol.stakes(id)
    console.log(stake)
    expect("1").not.equal("0")
  })

});
