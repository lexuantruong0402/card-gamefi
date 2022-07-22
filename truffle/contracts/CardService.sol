// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IGameItems is IERC1155 {
    function userMintCard(address sender, uint id) external;
    function userMintEgg(address _sender, uint _typeEgg) external;
    function getCommonEggId() external pure returns(uint);
    function getRareEggId() external pure returns(uint);
}

contract CardService is Ownable {

    event NewCard(uint _id, uint _dna);

    address gameItemAddress; 
    address eggServiceAddress;

    // master data
    uint dnaDigits = 12;
    uint dnaMod = 10 ** dnaDigits;
    uint cooldownTime = 5 minutes;
    uint randNonce = 0;
    
    struct Card {
        uint dna;
        uint32 readyTime;
    }
    Card[] public listCard; 
    
    modifier onlyOwnerOfCard(uint _cardId) {
        IERC1155 nft = IERC1155(gameItemAddress);
        require(nft.balanceOf(msg.sender, _cardId) == 1, "you are not the owner");
        _;
    }

    function _setGameItemAddress(address _address) external onlyOwner {
        gameItemAddress = _address;
    }

    function _setEggAddress(address _address) external onlyOwner {
        eggServiceAddress = _address;
    }

    function _cardInit(uint8 _amount) external onlyOwner {
        for (uint8 i = 0; i< _amount; i++) 
            _createCard(msg.sender);
    }

    function _random(uint _mod) internal returns (uint) {
        randNonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _mod; 
    }

    function _createCard(address _sender) internal onlyOwner {
        IGameItems nft = IGameItems(gameItemAddress);
        uint dna = _random(dnaMod);
        uint id = listCard.length;
        listCard.push(Card(dna, uint32(block.timestamp + cooldownTime)));
        
        nft.userMintCard(_sender, id);
        emit NewCard(id, dna);
    }

    function _userCreateCard(address _sender) external {
        require(msg.sender == eggServiceAddress, "not call from smart contract");

        IGameItems nft = IGameItems(gameItemAddress);
        uint dna = _random(dnaMod);
        uint id = listCard.length;
        listCard.push(Card(dna, uint32(block.timestamp + cooldownTime)));
        
        nft.userMintCard(_sender, id);
        emit NewCard(id, dna);
    }

}
