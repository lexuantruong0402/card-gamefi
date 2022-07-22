// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "./CardService.sol";

contract CardBattle is CardService {
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

    function _battle(uint _cardId) external checkCooldown(_cardId) onlyOwnerOfCard(_cardId) returns (uint8, uint8) {
        IGameItems nft = IGameItems(gameItemAddress);
        uint8 checkWin = uint8(_random(100));
        uint8 checkEgg = uint8(_random(100));
        if (checkWin >= winRate) {
            if (checkEgg >= rareEggRate) nft.userMintEgg(msg.sender, nft.getCommonEggId());
            else nft.userMintEgg(msg.sender, nft.getRareEggId());
        }
        _triggerCooldown(_cardId);
        return (checkWin, checkEgg) ;
    }
}