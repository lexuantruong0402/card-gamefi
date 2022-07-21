// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Item.sol";

contract CardService is Ownable, GameItems {

    event NewCard(uint _id, uint _dna);

    modifier onlyOwnerOfCard(uint _cardId) {
        require(msg.sender == cardBelongTo[_cardId], "you are not the owner");
        _;
    }

    mapping (uint => address) public cardBelongTo;
    mapping (address => uint) userCountCard;


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
        
        cardBelongTo[id] = msg.sender;
        userCountCard[msg.sender]++;

        _mint(msg.sender, id, 1, "");
        emit NewCard(id, dna);
    }

    function _getAllCardOfUser(address _userAddress) external view returns (uint[] memory) {
        uint[] memory result = new uint[](userCountCard[_userAddress]);
        uint256 j=0;
        for(uint i = 0; i < listCard.length; i++) {
            if (cardBelongTo[i] == msg.sender) {
                result[j] = i;
                j++;
            }
        }
        return result;
    }

}
