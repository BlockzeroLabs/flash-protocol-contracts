import hre from "hardhat";
import { ethers, BigNumber, utils } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { FlashProtocolTest } from "../typechain/FlashProtocolTest";
import { FlashTokenTest } from "../typechain/FlashTokenTest";
import stakes from "../data.json"

describe("Unit tests", function () {
    let flashToken: FlashTokenTest;
    let flashProtocol: FlashProtocolTest;
    let wallet: SignerWithAddress;
    let walletTo: SignerWithAddress;
    let counter = 0;


    before(async function () {
        const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
        wallet = wallets[0];
        walletTo = wallets[1];
    });


    describe("FlashProtocolTest", function () {
        async function deploy() {
            const flashTokenAddress = await predictAddress(wallet);
            const FlashProtocol = (await hre.ethers.getContractFactory("FlashProtocolTest", wallet)).connect(walletTo);
            const FlashToken = await hre.ethers.getContractFactory("FlashTokenTest", wallet);
            flashProtocol = <FlashProtocolTest>await FlashProtocol.deploy(walletTo.address, "0", flashTokenAddress);
            flashToken = <FlashTokenTest>await FlashToken.deploy(wallet.address, flashProtocol.address);
            await flashToken.mint(wallet.address, ethers.utils.parseUnits(stakes[0].totalSupply.toString(), "ether"));
            await flashToken.approve(flashProtocol.address, ethers.constants.MaxUint256);
        }

        async function stake(amount: BigNumber, duration: string): Promise<any> {
            const protocol = flashProtocol.connect(wallet);
            let tx = await protocol.stake(amount, duration, wallet.address, "0x");
            return tx
        }

        async function unstakeEarly(id: string): Promise<any> {
            const protocol = flashProtocol.connect(wallet);
            let tx = await protocol.unstakeEarly(id);
            return tx
        }

        async function predictAddress(wallet: SignerWithAddress): Promise<string> {
            const nonce = await wallet.getTransactionCount();
            return ethers.utils.getContractAddress({ from: wallet.address, nonce });
        }

        async function generateId(amount: string, duration: string, tx: any): Promise<string> {
            let receipt = await hre.ethers.provider.getTransaction(tx.hash)
            let block = await hre.ethers.provider.getBlock(String(receipt.blockHash))

            let id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
                [
                    amount,
                    duration,
                    wallet.address,
                    wallet.address,
                    block.timestamp
                ]
            )

            return id

        }
        it("stake (half data)", async () => {
            for (let i = 0; i < stakes.length / 2; i++) {
                await testing(stakes[i]);
            }
        });

        it("stake (second half data)", async () => {
            for (let i = stakes.length / 2; i < stakes.length; i++) {
                await testing(stakes[i]);
            }
        });

        async function testing(data: any) {
            await deploy()
            const totalStakeAmount = BigNumber.from(data.totalStakedTokens).add(data.stakedAmount);
            let tx = await stake((ethers.utils.parseUnits(totalStakeAmount.toString(), 'ether')), data.duration.toString())
            let id = await generateId((ethers.utils.parseUnits(totalStakeAmount.toString(), 'ether')).toString(), data.duration.toString(), tx)
            await unstakeEarly(id);
        }

    });
});
