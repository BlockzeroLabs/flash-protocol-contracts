// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IFlashProtocol {
    function stake(
        uint256 _amountIn,
        uint256 _days,
        address _receiver,
        bytes calldata _data
    )
        external
        returns (
            uint256 mintedAmount,
            uint256 matchedAmount,
            bytes32 id
        );

    function unstake(bytes32 _id)
        external
        returns (uint256 withdrawAmount);
}
