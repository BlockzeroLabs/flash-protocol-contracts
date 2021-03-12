// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

interface IFlashMint {
    function flashMint(uint256 value, bytes calldata data) external;
}
