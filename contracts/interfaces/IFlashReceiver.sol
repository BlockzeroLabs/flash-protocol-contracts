// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

interface IFlashReceiver {
    function receiveFlash(
        bytes32 id,
        uint256 amountIn,
        uint256 expireAfter,
        uint256 mintedAmount,
        address staker,
        bytes calldata data
    ) external returns (uint256);
}
