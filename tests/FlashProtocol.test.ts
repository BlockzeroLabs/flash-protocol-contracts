import { expect, use } from "chai";
import { deployContract, MockProvider, solidity, createFixtureLoader, loadFixture } from "ethereum-waffle";
import FlashProtocolArtifact from "../artifacts/contracts/FlashProtocol.sol/FlashProtocol.json";
import FlashTokenArtifact from "../artifacts/contracts/tests/flash-token/FlashToken.sol/FlashToken.json"
import { constants, ethers, utils } from "ethers";

use(solidity);


describe("Flash token", async () => {

  const provider = new MockProvider({
    ganacheOptions: {
      "hardfork": 'istanbul',
      "mnemonic": 'horn horn horn horn horn horn horn horn horn horn horn horn',
      "gasLimit": 9999999
    }
  })
  const [wallet, walletTo] = provider.getWallets()

  let FlashToken: ethers.Contract

  let FlashProtocol: ethers.Contract;

  let id: String;

  it('deployFlashProtocol', async () => {
    FlashProtocol = await deployContract(walletTo, FlashProtocolArtifact, [walletTo.address]);
    FlashToken = await deployContract(wallet, FlashTokenArtifact, [wallet.address, FlashProtocol.address])
    await FlashToken.mint(wallet.address, "500000000000000000000000")
    expect(FlashToken.address).to.equal("0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA");
  });

  it('stake', async () => {

    await FlashToken.approve(FlashProtocol.address, constants.MaxUint256);

    let bytes32Param = await ethers.utils.formatBytes32String("0x");

    let protocol = await FlashProtocol.connect(wallet);

    let tx = await protocol.stake("100000000000000000", "1", walletTo.address, bytes32Param)

    let receipt = await provider.getTransaction(tx.hash)

    let block = await provider.getBlock(String(receipt.blockHash))

    id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
      [
        "100000000000000000",
        "1",
        walletTo.address,
        wallet.address,
        block.timestamp
      ]
    )
    let stake = await protocol.stakes(id)

    expect(stake.amountIn.toString()).not.equal("0")
  })

  it('unstake', async () => {
    setTimeout(async () => {
      await expect(
        FlashProtocol.unstake(id)
      ).to.emit(FlashProtocol, "Unstaked");
    }, 3000)
  })

  // it('unstakeEarly', async () => {
  //   let protocol = FlashProtocol.connect(wallet)

  //   let bytes32Param = await ethers.utils.formatBytes32String("0x");

  //   let tx = await protocol.stake("100000000000000000", "10", walletTo.address, bytes32Param)

  //   let receipt = await provider.getTransaction(tx.hash)

  //   let block = await provider.getBlock(String(receipt.blockHash))

  //   let id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
  //     [
  //       "100000000000000000",
  //       "1",
  //       walletTo.address,
  //       wallet.address,
  //       block.timestamp
  //     ]
  //   )

  //   await expect(
  //     protocol.unstakeEarly(id)
  //   ).to.emit(FlashProtocol, "Unstaked");
  // })

  it('setMatchReceiver -> fail', async()=>{
    await expect( FlashProtocol.setMatchReceiver(wallet.address)).to.be.revertedWith('FlashProtocol:: FUNCTION_TIMELOCKED');
  })

  it('setMatchRatio -> fail', async()=>{
    await expect( FlashProtocol.setMatchRatio("1000")).to.be.revertedWith('FlashProtocol:: FUNCTION_TIMELOCKED');
  })

  it('unlock', async()=>{
    await FlashProtocol.unlockFunction("0")
    expect(await FlashProtocol.timelock("0")).to.not.equal("0");
  })


});
