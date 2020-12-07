import { Contract, ethers, Wallet } from 'ethers'
import { providers } from 'ethers'
import { deployContract } from 'ethereum-waffle'

import FlashTokenArtifact from '../../artifacts/contracts/tests/flash-token/FlashToken.sol/FlashToken.json'

const AMOUNT: any = "500000000000000000000000";

const overrides = {
    gasLimit: 9999999
}

export async function tokenFixture([wallet]: Wallet[],_: providers.Web3Provider, address:String ) : Promise<ethers.Contract> {
    const token = await deployContract(wallet, FlashTokenArtifact, [wallet.address, address], overrides)
    await mintTokens(token, wallet.address);
    return token
}

export async function mintTokens(
    token: Contract,
    owner: string
): Promise<void> {
    await token.mint(owner, AMOUNT)
}