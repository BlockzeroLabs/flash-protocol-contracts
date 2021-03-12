import hre from "hardhat";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { BigNumber } from "bignumber.js"

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { FlashProtocolTest } from "../typechain/FlashProtocolTest";
import { FlashTokenTest } from "../typechain/FlashTokenTest";
import stakes from "../data.json"

import { constants, ethers, utils } from "ethers";
import { ecsign } from "ethereumjs-util";

import {
  defaultAbiCoder,
  hexlify,
  keccak256,
  toUtf8Bytes,
  solidityPack
} from "ethers/lib/utils";

use(solidity)

describe("Unit tests", function () {
    let flashToken: FlashTokenTest;
    let flashProtocol: FlashProtocolTest;
    let wallet: SignerWithAddress;
    let walletTo: SignerWithAddress;
    let counter = 0;
    let totalSupply = "1000000000000000000000000"
    let universalTimestamp = 1615544773




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
            await flashToken.mint(wallet.address, totalSupply);
            await flashToken.approve(flashProtocol.address, ethers.constants.MaxUint256);
        }

        async function stake(amount: BigNumber, duration: string, mintedAmount: string, fpyAfterStake: string): Promise<any> {
            let maxStakePeriod = (await flashProtocol.calculateMaxStakePeriod(amount.toString())).toString()
            console.log(maxStakePeriod, duration)
            if (Number(duration) > Number(maxStakePeriod)) {
                expect(false).to.be.equal(false)
                return false
            }
            const protocol = flashProtocol.connect(wallet);
            let fpyBeforeStakeContract = (await flashProtocol.getFPY("0")).toString()
            console.log(fpyBeforeStakeContract)
            expect(fpyBeforeStakeContract).to.be.equal("500000000000000000");
            let tx = await protocol.stake(amount.toString(), duration, wallet.address, "0x");
            let fpyAfterStakeContract = (await flashProtocol.getFPY("0")).toString();
            expect(fpyAfterStakeContract).to.be.equal(fpyAfterStake);
            let totalSupplyContract = (await flashToken.totalSupply()).toString()
            let mintedAmountContract = (new BigNumber(totalSupplyContract).minus(new BigNumber(totalSupply))).toFixed(0).toString();
            expect(mintedAmountContract.toString()).to.be.equal(mintedAmount)
            return tx
        }

        async function unstakeEarly(id: string, unstakeAmount: string, stakeAmount: string): Promise<any> {
            let stake = (await flashProtocol.stakes(id))
            console.log(stake.expireAfter.toString(), "EXPIREAFTER")
            let stakeAmountContract = stake.amountIn.toString()
            let balanceOfUserContract = (await flashToken.balanceOf(wallet.address)).toString();
            const protocol = flashProtocol.connect(wallet);
            let tx = await protocol.unstakeEarly(id);
            let receipt = await hre.ethers.provider.getTransaction(tx.hash)
            let block = await hre.ethers.provider.getBlock(String(receipt.blockHash))
            console.log(block.timestamp, "TIMESTAMP")
            let balanceOfAfterUnstake = (await flashToken.balanceOf(wallet.address)).toString();
            let differenceReceive = (new BigNumber(balanceOfAfterUnstake).minus(new BigNumber(balanceOfUserContract))).toFixed(0).toString();
            let burnAmount = (new BigNumber(stakeAmountContract).minus(new BigNumber(differenceReceive))).toFixed(0).toString()
            expect(burnAmount).to.be.equal(unstakeAmount);
            return tx
        }

        async function unstake(id: string, fpyAfterUnstake: string): Promise<any> {
            const protocol = flashProtocol.connect(wallet);
            let tx = await protocol.unstake(id);
            let stake = (await flashProtocol.stakes(id))
            let stakeAmountContract = stake.amountIn.toString()
            expect(stakeAmountContract).to.be.equal("0")
            let fpyAfterUnstakeContract = (await flashProtocol.getFPY("10000000000000000000000")).toString();
            expect(fpyAfterUnstakeContract).to.be.equal(fpyAfterUnstake);
            return tx
        }

        async function predictAddress(wallet: SignerWithAddress): Promise<string> {
            const nonce = await wallet.getTransactionCount();
            return ethers.utils.getContractAddress({ from: wallet.address, nonce });
        }

        async function generateId(amount: string, duration: string, tx: any): Promise<any> {
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

            return { id, timestamp: block.timestamp }

        }

        it("stake (half data)", async () => {
            for (let i = 0; i < stakes.length / 2; i++) {
                console.log(i)
                await testing(stakes[i]);
            }
        });

        it("stake (second half data)", async () => {
            for (let i = stakes.length / 2; i < stakes.length; i++) {
                console.log(i)
                await testing(stakes[i]);
            }
        });


        async function testing(data: any) {
            await deploy()
            let tx = await stake(data.stakeAmount, data.expiry, data.mintedAmount, data.fpyAfterStake)
            if (tx) {
                let obj = await generateId(data.stakeAmount, data.expiry, tx)
                if (data.expiry === data.unstakeTime) {
                    // "300000000000000000000000"
                    await hre.network.provider.send("evm_setNextBlockTimestamp", [obj.timestamp + Number(data.unstakeTime)])
                    // await hre.network.provider.send("evm_increaseTime", [Number(data.unstakeTime)])
                    console.log(data.stakeAmount)
                    await unstake(obj.id, data.fpyAfterUnstake);
                } else {
                    await unstakeEarly(obj.id, data.unstakeAmount, data.stakeAmount)
                }
            }

        }

    });
});
