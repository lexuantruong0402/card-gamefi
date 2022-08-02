// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "./CardService.sol";

contract CardBattle is CardService {
    uint8 rareEggRate = 30;
    uint8 winRateCommon = 50;
    uint8 winRateRare = 60;

    event FightResult(uint256 cardId, uint8 checkWin, uint8 checkEgg);

    modifier checkCooldown(uint256 _cardId) {
        require(listCard[_cardId].readyTime <= block.timestamp, "is cooldown");
        _;
    }

    function _triggerCooldown(uint256 _cardId) internal {
        listCard[_cardId].readyTime = uint32(block.timestamp + cooldownTime);
    }

    function _battle(uint256 _cardId)
        external
        checkCooldown(_cardId)
        onlyOwnerOfCard(_cardId)
    {
        IGameItems nft = IGameItems(gameItemAddress);
        uint8 checkWin = uint8(_random(100));
        uint8 checkEgg = uint8(_random(100));
        uint256 winRate = winRateRare;
        if (listCard[_cardId].dna % 100 == 0) winRate = winRateCommon;

        if (checkWin >= winRate) {
            if (checkEgg >= rareEggRate)
                nft.userMintEgg(msg.sender, nft.getCommonEggId());
            else nft.userMintEgg(msg.sender, nft.getRareEggId());
        }
        _triggerCooldown(_cardId);
        emit FightResult(_cardId, checkWin, checkEgg);
    }
}
