// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;

import "./interfaces/IFlashToken.sol";
import "./interfaces/IFlashReceiver.sol";

import "./libraries/SafeMath.sol";
import "./libraries/Address.sol";

contract FlashProtocol {
    using SafeMath for uint256;
    using Address for address;

    struct Stake {
        uint256 amountIn;
        uint256 initiation;
        uint256 expireAfter;
        uint256 mintedAmount;
        address staker;
        address receiver;
    }

    uint256 internal constant PRECISION = 1e18;
    uint256 internal constant ONE_DAY = 86400;

    address
        public constant FLASH_TOKEN = 0x706AEa632c07D34C9FF9EA419bf19c85dBA4Dcb8;

    uint256 public matchRatio;
    address public matchReceiver;

    mapping(bytes32 => Stake) public stakes;
    mapping(address => uint256) public balances;

    event Staked(
        bytes32 _id,
        uint256 _amountIn,
        uint256 _initiation,
        uint256 _expireAfter,
        uint256 _mintedAmount,
        address indexed _staker,
        address indexed _receiver
    );

    event Unstaked(bytes32 _id, uint256 _amountIn, address indexed _staker);

    modifier onlyMatchReceiver {
        require(
            msg.sender == matchReceiver,
            "FlashProtocol:: NOT_MATCH_RECEIVER"
        );
        _;
    }

    constructor(address _initialMatchReceiver) public {
        _setMatchReceiver(_initialMatchReceiver);
    }

    function setMatchReceiver(address _newMatchReceiver)
        public
        onlyMatchReceiver
    {
        _setMatchReceiver(_newMatchReceiver);
    }

    function _setMatchReceiver(address _newMatchReceiver) internal {
        matchReceiver = _newMatchReceiver;
    }

    function setMatchRatio(uint256 _newMatchRatio) public onlyMatchReceiver {
        require(
            _newMatchRatio >= 0 && _newMatchRatio <= 2000,
            "FlashProtocol:: INVALID_MATCH_RATIO"
        );
        matchRatio = _newMatchRatio;
    }

    function stake(
        uint256 _amountIn,
        uint256 _days,
        address _receiver,
        bytes calldata _data
    ) public {
        // require(expireAfter <= MAX_STAKE, "FlashProtocol:: STAKE_MAX_4_YEARS"); //discuss
        require(_days > 0, "FlashProtocol:: INVALID_DAYS");

        require(_amountIn > 0, "FlashProtocol:: INVALID_AMOUNT");

        address staker = msg.sender; //discuss

        uint256 expiration = _days.mul(ONE_DAY);

        IFlashToken(FLASH_TOKEN).transferFrom(staker, address(this), _amountIn);

        balances[staker] = balances[staker].add(_amountIn);

        bytes32 id = keccak256(
            abi.encodePacked(
                _amountIn,
                _days,
                _receiver,
                staker,
                block.timestamp
            )
        );

        require(
            stakes[id].staker == address(0),
            "FlashProtocol:: STAKE_EXISTS"
        );

        uint256 mintedAmount = getMintAmount(_amountIn, _days);
        uint256 matchedAmount = getMatchedAmount(mintedAmount);

        IFlashToken(FLASH_TOKEN).mint(_receiver, mintedAmount);
        IFlashToken(FLASH_TOKEN).mint(matchReceiver, matchedAmount);

        stakes[id] = Stake(
            _amountIn,
            block.timestamp,
            expiration,
            mintedAmount,
            staker,
            _receiver
        );

        if (_receiver.isContract()) {
            IFlashReceiver(_receiver).receiveFlash(
                id,
                _amountIn,
                expiration,
                mintedAmount,
                staker,
                _data
            );
        }

        emit Staked(
            id,
            block.timestamp,
            _amountIn,
            expiration,
            mintedAmount,
            staker,
            _receiver
        );
    }

    function unstake(bytes32 _id, uint256 _amount) public returns(uint256 withdrawAmount) {
        Stake memory s = stakes[_id];
        address staker = msg.sender;
        if(
            block.timestamp >= s.initiation.add(s.expireAfter)
        ){
            balances[staker] = balances[staker].sub(s.amountIn);
            s.amountIn = s.amountIn.sub(_amount);
            if (s.amountIn == 0) delete stakes[_id];
            withdrawAmount = _amount;
        }else{
            withdrawAmount = _unstakeEarly(_id, _amount);
        }
        IFlashToken(FLASH_TOKEN).transfer(staker, withdrawAmount);
        emit Unstaked(_id, _amount, staker);
    }

    function getMatchedAmount(uint256 mintedAmount)
        public
        view
        returns (uint256)
    {
        return mintedAmount.mul(matchRatio).div(10000);
    }

    function _unstakeEarly(bytes32 _id, uint256 _amount)
        private
        returns (uint256 withdrawAmount)
    {
        Stake memory s = stakes[_id];
        address staker = msg.sender;
        uint256 _remainingDays = (s.expireAfter.sub(block.timestamp));
        uint256 burnAmount = _calculateBurn(
            _amount,
            _remainingDays,
            s.expireAfter.sub(s.initiation)
        );
        balances[staker] = balances[staker].sub(_amount);
        s.amountIn = s.amountIn.sub(_amount);
        withdrawAmount = _amount.sub(burnAmount);
        if (s.amountIn == 0) delete stakes[_id];
        IFlashToken(FLASH_TOKEN).burn(burnAmount);
    }

    function _calculateBurn(
        uint256 _amount,
        uint256 _remainingDays,
        uint256 _totalDays
    ) internal pure returns (uint256 burnAmount) {
        burnAmount = ((_amount.mul(_remainingDays)).div(_totalDays));
    }

    function getMintAmount(uint256 _amountIn, uint256 _days)
        public
        view
        returns (uint256)
    {
        uint256 output = _amountIn.mul(_days).mul(getFPY(_amountIn)).div(
            PRECISION * 365
        );
        uint256 limit = _amountIn.div(2);
        return output > limit ? limit : output;
    }

    function getFPY(uint256 _amountIn) public view returns (uint256) {
        return (PRECISION.sub(getPercentStaked(_amountIn))).div(2);
    }

    function getPercentStaked(uint256 _amountIn) public view returns (uint256) {
        uint256 locked = IFlashToken(FLASH_TOKEN).balanceOf(address(this)).add(
            _amountIn
        );
        uint256 percent = locked.mul(PRECISION).div(
            IFlashToken(FLASH_TOKEN).totalSupply()
        );
        return percent > PRECISION ? PRECISION : percent;
    }
}
