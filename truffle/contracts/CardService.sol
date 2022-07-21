// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "./Item.sol";

contract CardService is Ownable, GameItems {

    event NewCard(uint _id, uint _dna);

    modifier onlyOwnerOfCard(uint _cardId) {
        require(balanceOf(msg.sender, _cardId) == 1, "you are not the owner");
        _;
    }

    function _cardInit(uint8 _amount) external onlyOwner {
        for (uint8 i = 0; i< _amount; i++) 
            _createCard();
    }

    function _random(uint _mod) internal returns (uint) {
        randNonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _mod; 
    }

    function _createCard() internal {
        uint dna = _random(dnaMod);
        uint id = listCard.length;
        listCard.push(Card(dna, uint32(block.timestamp + cooldownTime)));
        
        _mint(msg.sender, id, 1, "");
        emit NewCard(id, dna);
    }

}
