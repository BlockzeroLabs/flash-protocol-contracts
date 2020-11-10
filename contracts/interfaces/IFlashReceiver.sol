// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

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
