import hre from "hardhat";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";

import { BigNumber } from "bignumber.js"

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { FlashProtocolTest } from "../typechain/FlashProtocolTest";
import { FlashTokenTest } from "../typechain/FlashTokenTest";
import stakes from "../data.json"

import { constants, ethers, utils } from "ethers";

use(solidity)

describe("Unit tests", function () {
    let flashToken: FlashTokenTest;
    let flashProtocol: FlashProtocolTest;
    let wallet: SignerWithAddress;
    let walletMatchReceiver: SignerWithAddress;
    let walletReceiverStake: SignerWithAddress;
    let totalSupply = "10000000000000000000000000"
    let deployFlag: boolean = false;
    let PRECISION = "1000000000000000000"
    let ONE_YEAR_SECONDS = "31536000"

    before(async function () {
        const wallets: SignerWithAddress[] = await hre.ethers.getSigners();
        wallet = wallets[0];
        walletMatchReceiver = wallets[1];
        walletReceiverStake = wallets[2];
    });

    describe("FlashProtocolTest", function () {
        async function deploy() {
            const flashTokenAddress = await predictAddress(wallet);
            const FlashProtocol = (await hre.ethers.getContractFactory("FlashProtocolTest", wallet)).connect(walletMatchReceiver);
            const FlashToken = await hre.ethers.getContractFactory("FlashTokenTest", wallet);
            flashProtocol = <FlashProtocolTest>await FlashProtocol.deploy(walletMatchReceiver.address, "2000", flashTokenAddress);
            flashToken = <FlashTokenTest>await FlashToken.deploy(wallet.address, flashProtocol.address);
            await flashToken.mint(wallet.address, totalSupply);
            await flashToken.approve(flashProtocol.address, ethers.constants.MaxUint256);
        }

        async function getFpy(amountIn: string): Promise<string> {
            let totalSupply = (await flashToken.totalSupply()).toString();
            let lockedAmount = (await flashToken.balanceOf(flashProtocol.address)).toString();

            let totalFlash = new BigNumber(lockedAmount).plus(new BigNumber(amountIn)).multipliedBy(PRECISION).toFixed(0)
            return new BigNumber(PRECISION).minus(new BigNumber(totalFlash).dividedBy(new BigNumber(totalSupply))).dividedBy(2).toFixed(0)
        }

        async function getMintedAmount(amountIn: string, expiry: string, fpy: string) {
            return (new BigNumber(amountIn).multipliedBy(new BigNumber(expiry)).multipliedBy(new BigNumber(fpy))).dividedBy(new BigNumber(PRECISION).multipliedBy(new BigNumber(ONE_YEAR_SECONDS))).toFixed(0)
        }

        async function matchAmount(mintedAmount: string) {
            return (new BigNumber(mintedAmount).multipliedBy(new BigNumber(2000)).dividedBy(new BigNumber(10000))).toFixed(0)
        }

        async function calculateUnstakeAount() {

        }

        async function calculateBurnAmount() {

        }

        async function stake(amount: BigNumber, duration: string, mintedAmount: string, fpyAfterStake: string): Promise<any> {
            try {
                let maxStakePeriod = (await flashProtocol.calculateMaxStakePeriod(amount.toString())).toString()
                console.log(duration, maxStakePeriod)
                expect(Number(duration) <= Number(maxStakePeriod))

                let balanceStakeReceiverBefore = (await flashToken.balanceOf(walletReceiverStake.address)).toString()
                let balanceMatchReceiverBefore = (await flashToken.balanceOf(walletMatchReceiver.address)).toString()
                
                let fpyBeforeStake = await getFpy(amount.toString());
                let fpyBeforeStakeContract = new BigNumber((await flashProtocol.getFPY(amount.toString())).toString()).toFixed(0)
                expect(fpyBeforeStake).to.be.equal(fpyBeforeStakeContract)

                const protocol = flashProtocol.connect(wallet);
                let tx = await protocol.stake(amount.toString(), duration, walletReceiverStake.address, "0x");
                
                let balancerStakeReceiverAfter = (await flashToken.balanceOf(walletReceiverStake.address)).toString()
                let balanceMatchReceiverAfter = (await flashToken.balanceOf(walletMatchReceiver.address)).toString();
                
                let fpyAfterStake = await getFpy("0");
                let fpyAfterStakeContract = new BigNumber((await flashProtocol.getFPY("0")).toString()).toFixed(0);
                console.log(fpyAfterStake, fpyAfterStakeContract)
                expect(fpyAfterStake).to.be.equal(fpyAfterStakeContract);
                
                let mintedAmount = await getMintedAmount(amount.toString(), duration, fpyBeforeStake);
                let differenceBalance = (new BigNumber(balancerStakeReceiverAfter).minus(new BigNumber(balanceStakeReceiverBefore))).toFixed(0)
                console.log(mintedAmount, differenceBalance, "Minted amount");
                expect(mintedAmount).to.be.equal(differenceBalance);

                // let mintedAmount = await matchAmount(amount.toString(), duration, fpyBeforeStake);
                // let differenceBalance = (new BigNumber(balancerStakeReceiverAfter).minus(new BigNumber(balanceStakeReceiverBefore))).toFixed(0)
                // console.log(mintedAmount, differenceBalance, "Minted amount");
                // expect(mintedAmount).to.be.equal(differenceBalance);

                // let totalSupplyContract = (await flashToken.totalSupply()).toString()
                // let mintedAmountContract = (new BigNumber(totalSupplyContract).minus(new BigNumber(totalSupply))).toFixed(0).toString();
                // expect(mintedAmountContract.toString()).to.be.equal(mintedAmount)
                return null
            }
            catch (e) {
                return false
            }
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
            if (!deployFlag) {
                await deploy();
                deployFlag = true;
            }
            if (data.unstakeTime !== '0') {
                deployFlag = false;
                let tx = await stake(data.stakeAmount, data.expiry, data.mintedAmount, data.fpyAfterStake)
                // if (tx) {
                //     let obj = await generateId(data.stakeAmount, data.expiry, tx)
                //     if (data.expiry === data.unstakeTime) {
                //         await hre.network.provider.send("evm_setNextBlockTimestamp", [obj.timestamp + Number(data.unstakeTime)])
                //         // await hre.network.provider.send("evm_increaseTime", [Number(data.unstakeTime)])
                //         console.log(data.stakeAmount)
                //         await unstake(obj.id, data.fpyAfterUnstake);
                //     } else {
                //         await unstakeEarly(obj.id, data.unstakeAmount, data.stakeAmount)
                //     }
                // }
            } else {
                await stake(data.stakeAmount, data.expiry, data.mintedAmount, data.fpyAfterStake)
            }
        }

    });
});
