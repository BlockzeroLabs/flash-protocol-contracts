import { expect, use } from "chai";
import { deployContract, MockProvider, solidity, createFixtureLoader, loadFixture } from "ethereum-waffle";
import FlashProtocolArtifact from "../artifacts/contracts/tests/FlashProtocolTest.sol/FlashProtocol.json";
import FlashTokenArtifact from "../artifacts/contracts/tests/flash-token/FlashToken.sol/FlashToken.json"
import { constants, ethers, utils } from "ethers";
import csvtojson from "csvtojson"


use(solidity);

describe("Flash protocol", async () => {

    let counter = 0;

    let dataStake: any;
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

    beforeEach(async () => {
        dataStake = await getJSON();
        let flashtokenAddress = await predictAddress(wallet)
        console.log(flashtokenAddress)
        FlashProtocol = await deployContract(walletTo, FlashProtocolArtifact, [walletTo.address, "0", flashtokenAddress]);
        FlashToken = await deployContract(wallet, FlashTokenArtifact, [wallet.address, FlashProtocol.address])
        console.log(FlashToken.address)
        await FlashToken.mint(wallet.address, (ethers.utils.parseUnits(dataStake[counter].totalSupply, 'ether')))
        await FlashToken.approve(FlashProtocol.address, constants.MaxUint256);
    })

    it('stake', async () => {
        let totalStakeAmount = Number(dataStake[counter].totalStakedTokens) +Number(dataStake[counter].stakedAmount)
        await stake((ethers.utils.parseUnits(totalStakeAmount.toString(),'ether')).toString(),dataStake[counter].duration)
        counter++
    })

    async function stake(amount: string, duration: string) {

        // console.log(amount, (await FlashToken.totalSupply()).toString(), (await FlashToken.balanceOf(wallet.address)).toString())

        let bytes32Param = await ethers.utils.formatBytes32String("0x");

        let protocol = await FlashProtocol.connect(wallet);

        let tx = await protocol.stake(amount, duration, wallet.address, bytes32Param)

        let receipt = await provider.getTransaction(tx.hash)

        let block = await provider.getBlock(String(receipt.blockHash))

        console.log(block.timestamp)

        let balance = await protocol.balances(wallet.address);
        // console.log(balance.toString())
        // console.log((await FlashToken.balanceOf(wallet.address)).toString())
        id = await utils.solidityKeccak256(["uint256", "uint256", "address", "address", "uint256"],
            [
                amount,
                duration,
                walletTo.address,
                wallet.address,
                block.timestamp
            ]
        )
        let stake = await protocol.stakes(id)
        // console.log(stake)

        expect(balance.toString()).not.equal("0")

            

    }
});

async function getJSON(): Promise<any> {
    const csvFilePath = 'data.csv'
    const jsonArray = await csvtojson().fromFile(csvFilePath)
    return jsonArray
}

async function predictAddress(wallet:ethers.Wallet) : Promise<string>{
    let nonce = await wallet.getTransactionCount();
    let address = await ethers.utils.getContractAddress({from: wallet.address, nonce})
    return address
  }
  