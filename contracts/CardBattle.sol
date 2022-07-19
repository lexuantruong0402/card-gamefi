// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "./CardEntity.sol";

contract CardBattle is CardEntity {
    uint8 winRate = 50;
    uint8 rareEggRate = 30;

    modifier checkCooldown(uint _cardId) {
        require(listCard[_cardId].readyTime <= block.timestamp, "is cooldown");
        _;
    }

    function _triggerCooldown(uint _cardId) internal {
        listCard[_cardId].readyTime = uint32(block.timestamp + cooldownTime);
    }

    function _randomEnemy() external returns (Card memory) {
        return (listCard[_random(listCard.length)]);
    }

    function _battle(uint _cardId) external checkCooldown(_cardId) onlyOwnerOfCard(_cardId) returns (uint8) {
        uint8 checkWin = uint8(_random(100));
        uint8 checkEgg = uint8(_random(100));
        if (checkWin >= winRate) {
            if (checkEgg >= rareEggRate) _userMint(CommonEgg);
            else _userMint(RareEgg);
        }
        _triggerCooldown(_cardId);
        return checkEgg;
    }
}