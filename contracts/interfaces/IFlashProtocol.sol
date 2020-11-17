// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

interface IFlashProtocol {
    function FLASH_TOKEN() external view returns (address);

    function matchRatio() external view returns (uint256);

    function matchReceiver() external view returns (address);

    function stakes(bytes32 _id)
        external
        view
        returns (
            uint256 amountIn,
            uint256 expiry,
            uint256 expireAfter,
            uint256 mintedAmount,
            address staker,
            address receiver
        );

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

    function balances(address _staker) external view returns (uint256);

    function unstake(bytes32 _id) external returns (uint256 withdrawAmount);

    function unstakeEarly(bytes32 _id) external returns (uint256 withdrawAmount);

    function getFPY(uint256 _amountIn) external view returns (uint256);

    function setMatchReceiver(address _newMatchReceiver) external;

    function setMatchRatio(uint256 _newMatchRatio) external;

    function getMatchedAmount(uint256 mintedAmount) external view returns (uint256);

    function getMintAmount(uint256 _amountIn, uint256 _expiry) external view returns (uint256);

    function getPercentageStaked(uint256 _amountIn) external view returns (uint256 percentage);
}
