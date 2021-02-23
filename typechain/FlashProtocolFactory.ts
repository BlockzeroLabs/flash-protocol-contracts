/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {Signer, BigNumberish} from "ethers";
import {Provider, TransactionRequest} from "@ethersproject/providers";
import {Contract, ContractFactory, Overrides} from "@ethersproject/contracts";

import type {FlashProtocol} from "./FlashProtocol";

export class FlashProtocolFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _initialMatchReceiver: string,
    _initialMatchRatio: BigNumberish,
    overrides?: Overrides
  ): Promise<FlashProtocol> {
    return super.deploy(
      _initialMatchReceiver,
      _initialMatchRatio,
      overrides || {}
    ) as Promise<FlashProtocol>;
  }
  getDeployTransaction(
    _initialMatchReceiver: string,
    _initialMatchRatio: BigNumberish,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _initialMatchReceiver,
      _initialMatchRatio,
      overrides || {}
    );
  }
  attach(address: string): FlashProtocol {
    return super.attach(address) as FlashProtocol;
  }
  connect(signer: Signer): FlashProtocolFactory {
    return super.connect(signer) as FlashProtocolFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FlashProtocol {
    return new Contract(address, _abi, signerOrProvider) as FlashProtocol;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initialMatchReceiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_initialMatchRatio",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_expiry",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_expireAfter",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_mintedAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_staker",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "Unstaked",
    type: "event",
  },
  {
    inputs: [],
    name: "FLASH_TOKEN",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TIMELOCK",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
    ],
    name: "getFPY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_mintedAmount",
        type: "uint256",
      },
    ],
    name: "getMatchedAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_expiry",
        type: "uint256",
      },
    ],
    name: "getMintAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
    ],
    name: "getPercentageStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFlashProtocol.LockedFunctions",
        name: "_lockedFunction",
        type: "uint8",
      },
    ],
    name: "lockFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "matchRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "matchReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newMatchRatio",
        type: "uint256",
      },
    ],
    name: "setMatchRatio",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newMatchReceiver",
        type: "address",
      },
    ],
    name: "setMatchReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_expiry",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "stake",
    outputs: [
      {
        internalType: "uint256",
        name: "mintedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "matchedAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "stakeWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "mintedAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "matchedAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "stakes",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expireAfter",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mintedAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFlashProtocol.LockedFunctions",
        name: "",
        type: "uint8",
      },
    ],
    name: "timelock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IFlashProtocol.LockedFunctions",
        name: "_lockedFunction",
        type: "uint8",
      },
    ],
    name: "unlockFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
    ],
    name: "unstake",
    outputs: [
      {
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_id",
        type: "bytes32",
      },
    ],
    name: "unstakeEarly",
    outputs: [
      {
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405162001b2038038062001b208339818101604052604081101561003557600080fd5b50805160209091015161004781610057565b6100508261009e565b50506100c0565b6107d08111156100995760405162461bcd60e51b815260040180806020018281038252602381526020018062001afd6023913960400191505060405180910390fd5b600055565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b611a2d80620000d06000396000f3fe608060405234801561001057600080fd5b50600436106101215760003560e01c80638fee6407116100ad578063bf499f6811610071578063bf499f6814610397578063c17bae2a14610437578063cc704d5414610457578063d08c970214610474578063e345a3801461047c57610121565b80638fee64071461022e578063a066983d1461028a578063aa53099d14610334578063b3e1f05014610354578063b4fa3b981461037757610121565b80635b49129e116100f45780635b49129e146101c757806368220664146101cf57806371ed5d1a146101ec57806376f5cf28146102095780637aadef8b1461022657610121565b80631051f6961461012657806323c6e14c1461015557806327212b5b1461017957806327e235e3146101a1575b600080fd5b6101436004803603602081101561013c57600080fd5b5035610499565b60408051918252519081900360200190f35b61015d6104c2565b604080516001600160a01b039092168252519081900360200190f35b61019f6004803603602081101561018f57600080fd5b50356001600160a01b03166104da565b005b610143600480360360208110156101b757600080fd5b50356001600160a01b03166105f4565b610143610606565b610143600480360360208110156101e557600080fd5b503561060c565b6101436004803603602081101561020257600080fd5b503561073d565b61019f6004803603602081101561021f57600080fd5b503561096f565b610143610a6a565b61024b6004803603602081101561024457600080fd5b5035610a71565b6040805196875260208701959095528585019390935260608501919091526001600160a01b0390811660808501521660a0830152519081900360c00190f35b610316600480360360808110156102a057600080fd5b8135916020810135916001600160a01b0360408301351691908101906080810160608201356401000000008111156102d757600080fd5b8201836020820111156102e957600080fd5b8035906020019184600183028401116401000000008311171561030b57600080fd5b509092509050610ab4565b60408051938452602084019290925282820152519081900360600190f35b61019f6004803603602081101561034a57600080fd5b503560ff16610c19565b6101436004803603604081101561036a57600080fd5b5080359060200135610c97565b61019f6004803603602081101561038d57600080fd5b503560ff16610cc4565b610316600480360360e08110156103ad57600080fd5b6001600160a01b038235169160208101359160408201359160ff6060820135169160808201359160a08101359181019060e0810160c08201356401000000008111156103f857600080fd5b82018360208201111561040a57600080fd5b8035906020019184600183028401116401000000008311171561042c57600080fd5b509092509050610d20565b6101436004803603602081101561044d57600080fd5b503560ff16610f27565b6101436004803603602081101561046d57600080fd5b5035610f39565b61015d610f5b565b6101436004803603602081101561049257600080fd5b5035610f6a565b60006104bc6127106104b66000548561125090919063ffffffff16565b906112b5565b92915050565b73b4467e8d621105312a914f1d42f10770c0ffe3c881565b6001546001600160a01b031633146105235760405162461bcd60e51b81526004018080602001828103825260228152602001806119d66022913960400191505060405180910390fd5b6001600081905260036020527fa15bc60c955c405d20d9149c709e2460f1c2d9a497496a7f46004d1772c3054c54158015906105885750426003600083600181111561056b57fe5b600181111561057657fe5b81526020019081526020016000205411155b6105c35760405162461bcd60e51b815260040180806020018281038252602381526020018061198b6023913960400191505060405180910390fd5b6105cc8261131f565b600060038160015b60018111156105df57fe5b81526020810191909152604001600020555050565b60046020526000908152604090205481565b60005481565b6000806106a68373b4467e8d621105312a914f1d42f10770c0ffe3c86001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561067457600080fd5b505afa158015610688573d6000803e3d6000fd5b505050506040513d602081101561069e57600080fd5b505190611341565b905061073673b4467e8d621105312a914f1d42f10770c0ffe3c86001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156106f857600080fd5b505afa15801561070c573d6000803e3d6000fd5b505050506040513d602081101561072257600080fd5b50516104b683670de0b6b3a7640000611250565b9392505050565b600061074761191f565b50600082815260026020818152604092839020835160c08101855281548152600182015492810192909252918201549281018390526003820154606082015260048201546001600160a01b03908116608083015260059092015490911660a0820152904210156107fe576040805162461bcd60e51b815260206004820152601f60248201527f466c61736850726f746f6c3a3a205354414b455f4e4f545f4558504952454400604482015290519081900360640190fd5b805160808201516001600160a01b03166000908152600460205260409020546108269161138f565b6080820180516001600160a01b0390811660009081526004602081815260408084209690965586518984526002808352878520858155600181018690559081018590556003810185905580840180546001600160a01b03199081169091556005909101805490911690559451865163a9059cbb60e01b815294169184019190915260248301849052935192955073b4467e8d621105312a914f1d42f10770c0ffe3c89363a9059cbb93604480850194929391928390030190829087803b1580156108ef57600080fd5b505af1158015610903573d6000803e3d6000fd5b505050506040513d602081101561091957600080fd5b50506080810151815160408051868152602081019290925280516001600160a01b03909316927f2ce17f91452598d1f926f6cfe29a9d42a67ff82b45d1eb94e0634c27555c14da9281900390910190a250919050565b6001546001600160a01b031633146109b85760405162461bcd60e51b81526004018080602001828103825260228152602001806119d66022913960400191505060405180910390fd5b600080805260036020527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff5415801590610a1b575042600360008360018111156109fe57fe5b6001811115610a0957fe5b81526020019081526020016000205411155b610a565760405162461bcd60e51b815260040180806020018281038252602381526020018061198b6023913960400191505060405180910390fd5b610a5f826113de565b6000600381806105d4565b6203f48081565b6002602081905260009182526040909120805460018201549282015460038301546004840154600590940154929493919290916001600160a01b03908116911686565b6000806000808811610b0d576040805162461bcd60e51b815260206004820152601e60248201527f466c61736850726f746f636f6c3a3a20494e56414c49445f414d4f554e540000604482015290519081900360640190fd5b6001600160a01b038616301415610b6b576040805162461bcd60e51b815260206004820152601f60248201527f466c61736850726f746f636f6c3a3a20494e56414c49445f4144445245535300604482015290519081900360640190fd5b604080516323b872dd60e01b81523360048201819052306024830152604482018b9052915173b4467e8d621105312a914f1d42f10770c0ffe3c8916323b872dd9160648083019260209291908290030181600087803b158015610bcd57600080fd5b505af1158015610be1573d6000803e3d6000fd5b505050506040513d6020811015610bf757600080fd5b50610c0790508989898989611424565b919b909a509098509650505050505050565b6001546001600160a01b03163314610c625760405162461bcd60e51b81526004018080602001828103825260228152602001806119d66022913960400191505060405180910390fd5b6203f480420160036000836001811115610c7857fe5b6001811115610c8357fe5b815260208101919091526040016000205550565b60006107366a1a1601fc4ea7109e0000006104b6610cb486610f39565b610cbe8787611250565b90611250565b6001546001600160a01b03163314610d0d5760405162461bcd60e51b81526004018080602001828103825260228152602001806119d66022913960400191505060405180910390fd5b60001960036000836001811115610c7857fe5b6000806000808a11610d79576040805162461bcd60e51b815260206004820152601e60248201527f466c61736850726f746f636f6c3a3a20494e56414c49445f414d4f554e540000604482015290519081900360640190fd5b6001600160a01b038b16301415610dd7576040805162461bcd60e51b815260206004820152601f60248201527f466c61736850726f746f636f6c3a3a20494e56414c49445f4144445245535300604482015290519081900360640190fd5b6040805163d505accf60e01b815233600482018190523060248301526000196044830152606482018c905260ff8b16608483015260a482018a905260c48201899052915173b4467e8d621105312a914f1d42f10770c0ffe3c89163d505accf9160e480830192600092919082900301818387803b158015610e5757600080fd5b505af1158015610e6b573d6000803e3d6000fd5b5050604080516323b872dd60e01b81526001600160a01b0385166004820152306024820152604481018f9052905173b4467e8d621105312a914f1d42f10770c0ffe3c893506323b872dd925060648083019260209291908290030181600087803b158015610ed857600080fd5b505af1158015610eec573d6000803e3d6000fd5b505050506040513d6020811015610f0257600080fd5b50610f1290508b8b8e8989611424565b919e909d50909b509950505050505050505050565b60036020526000908152604090205481565b60006104bc60026104b6610f4c8561060c565b670de0b6b3a76400009061138f565b6001546001600160a01b031681565b6000610f7461191f565b50600082815260026020818152604092839020835160c0810185528154815260018201549281019290925291820154928101929092526003810154606083015260048101546001600160a01b03908116608084018190526005909201541660a08301523390811461102c576040805162461bcd60e51b815260206004820152601e60248201527f466c61736850726f746f636f6c3a3a20494e56414c49445f5354414b45520000604482015290519081900360640190fd5b604082015160009061103e904261138f565b9050600061105584600001518386602001516118dd565b845190915081111561106357fe5b83516001600160a01b0384166000908152600460205260409020546110879161138f565b6001600160a01b03841660009081526004602052604090205583516110ac908261138f565b60008781526002602081815260408084208481556001810185905592830184905560038301849055600480840180546001600160a01b0319908116909155600590940180549094169093558051630852cd8d60e31b81529283018690525193985073b4467e8d621105312a914f1d42f10770c0ffe3c8936342966c68936024808501948390030190829087803b15801561114557600080fd5b505af1158015611159573d6000803e3d6000fd5b505050506040513d602081101561116f57600080fd5b50506040805163a9059cbb60e01b81526001600160a01b038516600482015260248101879052905173b4467e8d621105312a914f1d42f10770c0ffe3c89163a9059cbb9160448083019260209291908290030181600087803b1580156111d457600080fd5b505af11580156111e8573d6000803e3d6000fd5b505050506040513d60208110156111fe57600080fd5b5050835160408051888152602081019290925280516001600160a01b038616927f2ce17f91452598d1f926f6cfe29a9d42a67ff82b45d1eb94e0634c27555c14da92908290030190a250505050919050565b60008261125f575060006104bc565b8282028284828161126c57fe5b0414610736576040805162461bcd60e51b81526020600482015260136024820152724d4154483a3a204d554c5f4f564552464c4f5760681b604482015290519081900360640190fd5b600080821161130b576040805162461bcd60e51b815260206004820152601760248201527f4d4154483a3a204449564953494f4e5f42595f5a45524f000000000000000000604482015290519081900360640190fd5b600082848161131657fe5b04949350505050565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b808201828110156104bc576040805162461bcd60e51b81526020600482015260136024820152724d4154483a3a204144445f4f564552464c4f5760681b604482015290519081900360640190fd5b808203828111156104bc576040805162461bcd60e51b81526020600482015260146024820152734d4154483a3a205355425f554e444552464c4f5760601b604482015290519081900360640190fd5b6107d081111561141f5760405162461bcd60e51b81526004018080602001828103825260238152602001806119686023913960400191505060405180910390fd5b600055565b6000806000611432886118f5565b8711156114705760405162461bcd60e51b81526004018080602001828103825260288152602001806119ae6028913960400191505060405180910390fd5b33600061147d428a611341565b6001600160a01b0383166000908152600460205260409020549091506114a3908b611341565b60046000846001600160a01b03166001600160a01b0316815260200190815260200160002081905550898989844260405160200180868152602001858152602001846001600160a01b031660601b8152601401836001600160a01b031660601b81526014018281526020019550505050505060405160208183030381529060405280519060200120925060006001600160a01b03166002600085815260200190815260200160002060040160009054906101000a90046001600160a01b03166001600160a01b0316146115bd576040805162461bcd60e51b815260206004820152601c60248201527f466c61736850726f746f636f6c3a3a205354414b455f45584953545300000000604482015290519081900360640190fd5b6115c78a8a610c97565b94506115d285610499565b935073b4467e8d621105312a914f1d42f10770c0ffe3c86001600160a01b03166340c10f1989876040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561163f57600080fd5b505af1158015611653573d6000803e3d6000fd5b505050506040513d602081101561166957600080fd5b5050600154604080516340c10f1960e01b81526001600160a01b039092166004830152602482018690525173b4467e8d621105312a914f1d42f10770c0ffe3c8916340c10f199160448083019260209291908290030181600087803b1580156116d157600080fd5b505af11580156116e5573d6000803e3d6000fd5b505050506040513d60208110156116fb57600080fd5b50506040805160c0810182528b815260208181018c8152828401858152606084018a81526001600160a01b03808916608087019081528f821660a0880181815260008d8152600298899052999099209751885594516001880155925194860194909455516003850155516004840180549184166001600160a01b0319928316179055935160059093018054939092169290931691909117905561179d90611919565b1561187257876001600160a01b0316632cbff446848c8489878d8d6040518863ffffffff1660e01b815260040180888152602001878152602001868152602001858152602001846001600160a01b03168152602001806020018281038252848482818152602001925080828437600081840152601f19601f82011690508083019250505098505050505050505050602060405180830381600087803b15801561184557600080fd5b505af1158015611859573d6000803e3d6000fd5b505050506040513d602081101561186f57600080fd5b50505b60408051848152602081018c90528082018b9052606081018390526080810187905290516001600160a01b03808b1692908516917f8872a0bfe035dd55f2341f67aa0f9a8196bb3f97e132b6d3cb2f53f91aaa93f99181900360a00190a35050955095509592505050565b60006118ed826104b68686611250565b949350505050565b60006104bc61190383610f39565b6104b66706f05b59d3b200006301e13380611250565b3b151590565b6040518060c001604052806000815260200160008152602001600081526020016000815260200160006001600160a01b0316815260200160006001600160a01b03168152509056fe466c61736850726f746f636f6c3a3a20494e56414c49445f4d415443485f524154494f466c61736850726f746f636f6c3a3a2046554e4354494f4e5f54494d454c4f434b4544466c61736850726f746f636f6c3a3a204d41585f5354414b455f504552494f445f45584345454453466c61736850726f746f636f6c3a3a204e4f545f4d415443485f5245434549564552a2646970667358221220569588485c78802b60ffd7f99fb0e3a1cef3db1d9a2c6c28e2e597dcab71460b64736f6c634300060c0033466c61736850726f746f636f6c3a3a20494e56414c49445f4d415443485f524154494f";
