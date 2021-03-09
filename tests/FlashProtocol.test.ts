// import { expect, use } from "chai";
// import { deployContract, MockProvider, solidity, createFixtureLoader, loadFixture } from "ethereum-waffle";
// import FlashProtocolArtifact from "../artifacts/contracts/FlashProtocol.sol/FlashProtocol.json";
// import FlashTokenArtifact from "../artifacts/contracts/tests/flash-token/FlashToken.sol/FlashToken.json"
// import { constants, ethers, utils } from "ethers";
// import { ecsign } from "ethereumjs-util";
// import {
//   defaultAbiCoder,
//   hexlify,
//   keccak256,
//   toUtf8Bytes,
//   solidityPack
// } from "ethers/lib/utils";

// use(solidity);


// describe("Flash token", async () => {

//   const provider = new MockProvider({
//     ganacheOptions: {
//       "hardfork": 'istanbul',
//       "mnemonic": 'horn horn horn horn horn horn horn horn horn horn horn horn',
//       "gasLimit": 9999999
//     }
//   })
//   const [wallet, walletTo] = provider.getWallets()

//   let FlashToken: ethers.Contract

//   let FlashProtocol: ethers.Contract;

//   let id: String;

//   it('deployFlashProtocol', async () => {
//     FlashProtocol = await deployContract(walletTo, FlashProtocolArtifact, [walletTo.address, "2000"]);
//     FlashToken = await deployContract(wallet, FlashTokenArtifact, [wallet.address, FlashProtocol.address])
//     await FlashToken.mint(wallet.address, "500000000000000000000000")
//     expect(FlashToken.address).to.equal("0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA");
//   });

//   it('stake', async () => {

//     await FlashToken.approve(FlashProtocol.address, constants.MaxUint256);

//     let bytes32Param = await ethers.utils.formatBytes32String("0x");

//     let protocol = await FlashProtocol.connect(wallet);

//     let tx = await protocol.stake("100000000000000000", "1", walletTo.address, bytes32Param)

//     let receipt = await provider.getTransaction(tx.hash)

//     let block = await provider.getBlock(String(receipt.blockHash))

//     id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
//       [
//         "100000000000000000",
//         "1",
//         walletTo.address,
//         wallet.address,
//         block.timestamp
//       ]
//     )
//     let stake = await protocol.stakes(id)

//     expect(stake.amountIn.toString()).not.equal("0")
//   })

//   it('unstake', async () => {
//     setTimeout(async () => {
//       await expect(
//         FlashProtocol.unstake(id)
//       ).to.emit(FlashProtocol, "Unstaked");
//     }, 3000)
//   })

//   it('unstakeEarly', async () => {
//     let protocol = FlashProtocol.connect(wallet)

//     let bytes32Param = await ethers.utils.formatBytes32String("0x");

//     let tx = await protocol.stake("100000000000000000", "10", walletTo.address, bytes32Param)

//     let receipt = await provider.getTransaction(tx.hash)

//     let block = await provider.getBlock(String(receipt.blockHash))

//     let id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
//       [
//         "100000000000000000",
//         "1",
//         walletTo.address,
//         wallet.address,
//         block.timestamp
//       ]
//     )

//     await expect(
//       protocol.unstakeEarly(id)
//     ).to.emit(FlashProtocol, "Unstaked");
//   })

//   it('stakeWithPermit', async () => {

//     const deadline: any = "1714161515"
//     const nonces = await FlashToken.nonces(wallet.address);

//     const encodeData: any = keccak256(
//       defaultAbiCoder.encode(
//         ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
//         [
//           await FlashToken.PERMIT_TYPEHASH(),
//           wallet.address,
//           FlashProtocol.address,
//           constants.MaxUint256,
//           nonces,
//           deadline,
//         ]
//       )
//     );

//     const digest: any = keccak256(
//       solidityPack(
//         ["bytes1", "bytes1", "bytes32", "bytes32"],
//         ["0x19", "0x01", , await FlashToken.getDomainSeparator(), encodeData]
//       )
//     );

//     const { v, r, s } = ecsign(
//       Buffer.from(digest.slice(2), "hex"),
//       Buffer.from(wallet.privateKey.slice(2), "hex")
//     );

//     let bytes32Param = await ethers.utils.formatBytes32String("0x");

//     let protocol = await FlashProtocol.connect(wallet);

//     let tx = await protocol.stakeWithPermit(walletTo.address,"100000000000000000", "1",deadline ,v,r,s, bytes32Param)

//     let receipt = await provider.getTransaction(tx.hash)

//     let block = await provider.getBlock(String(receipt.blockHash))

//     id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
//       [
//         "100000000000000000",
//         "1",
//         walletTo.address,
//         wallet.address,
//         block.timestamp
//       ]
//     )
//     let stake = await protocol.stakes(id)

//     expect(stake.amountIn.toString()).not.equal("0")
  
//   })

//   it('setMatchReceiver -> fail', async()=>{
//     await expect( FlashProtocol.setMatchReceiver(wallet.address)).to.be.revertedWith('FlashProtocol:: FUNCTION_TIMELOCKED');
//   })

//   it('setMatchRatio -> fail', async()=>{
//     await expect( FlashProtocol.setMatchRatio("1000")).to.be.revertedWith('FlashProtocol:: FUNCTION_TIMELOCKED');
//   })

//   it('unlock', async()=>{
//     await FlashProtocol.unlockFunction("0")
//     expect(await FlashProtocol.timelock("0")).to.not.equal("0");
//   })
// });
