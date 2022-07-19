// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "./CardBattle.sol";

contract EggService is CardBattle {

    uint8 amountNeedToOpenCommonEgg = 6;
    uint8 amountNeedToOpenRareEgg = 10;

    modifier checkAmount(uint _eggType) {
        if (_eggType == CommonEgg) 
            require(balanceOf(msg.sender, CommonEgg) > amountNeedToOpenCommonEgg, "not enough egg");
        if (_eggType == CommonEgg) 
            require(balanceOf(msg.sender, RareEgg) > amountNeedToOpenRareEgg, "not enough egg");
        _;
    }

    function _openEgg(uint _eggType) external checkAmount(_eggType) {
        _createCard();
    }
}
