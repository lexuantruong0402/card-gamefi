// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IGameItems is IERC1155 {
    function userMintCard(address sender, uint256 id) external;

    function userMintEgg(address _sender, uint256 _typeEgg) external;

    function userBurnCard(uint256 _tokenId, address _sender) external;

    function getCommonEggId() external pure returns (uint256);

    function getRareEggId() external pure returns (uint256);
}

contract CardService is Ownable {
    event NewCard(uint256 _id, uint256 _dna);
    event UpgradeResult(uint256 _cardId, uint8 success);

    address gameItemAddress;
    address eggServiceAddress;

    // master data
    uint256 dnaDigits = 12;
    uint256 dnaMod = 10**dnaDigits;
    uint256 cooldownTime = 5 minutes;
    uint256 randNonce = 0;

    struct Card {
        uint256 id;
        uint256 dna;
        uint8 winRate;
        uint8 upgrade;
        uint32 readyTime;
    }
    Card[] public listCard;

    modifier onlyOwnerOfCard(uint256 _cardId) {
        IERC1155 nft = IERC1155(gameItemAddress);
        require(
            nft.balanceOf(msg.sender, _cardId) == 1,
            "you are not the owner"
        );
        _;
    }

    function _setGameItemAddress(address _address) external onlyOwner {
        gameItemAddress = _address;
    }

    function _setEggAddress(address _address) external onlyOwner {
        eggServiceAddress = _address;
    }

    function _cardInit(uint8 _amount) external onlyOwner {
        for (uint8 i = 0; i < _amount; i++) _createCard(msg.sender);
    }

    function _random(uint256 _mod) internal returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _mod;
    }

    function _createCard(address _sender) internal onlyOwner {
        IGameItems nft = IGameItems(gameItemAddress);
        uint256 dna = _random(dnaMod);
        dna = dna * 100;
        uint256 id = listCard.length;
        listCard.push(
            Card(id, dna, 50, 1, uint32(block.timestamp + cooldownTime))
        );

        nft.userMintCard(_sender, id);
        emit NewCard(id, dna);
    }

    function _userCreateCard(address _sender, bool _typeEgg) external {
        require(
            msg.sender == eggServiceAddress,
            "not call from smart contract"
        );

        IGameItems nft = IGameItems(gameItemAddress);
        uint256 dna;
        uint256 id = listCard.length;
        if (_typeEgg) {
            dna = _random(dnaMod);
            dna = dna * 100;
            listCard.push(
                Card(id, dna, 50, 1, uint32(block.timestamp + cooldownTime))
            );
        } else {
            dna = _random(dnaMod);
            if (dna % 100 == 0) dna = dna * 100 + 1;
            listCard.push(
                Card(id, dna, 60, 1, uint32(block.timestamp + cooldownTime))
            );
        }

        nft.userMintCard(_sender, id);
        emit NewCard(id, dna);
    }

    function getAllCardOfUser(address _sender)
        external
        view
        returns (Card[] memory)
    {
        uint256 count = 0;
        IGameItems nft = IGameItems(gameItemAddress);
        for (uint256 i = 0; i < listCard.length; i++) {
            if (nft.balanceOf(_sender, i) == 1) count++;
        }

        Card[] memory results = new Card[](count);
        count = 0;
        for (uint256 i = 0; i < listCard.length; i++) {
            if (nft.balanceOf(_sender, i) == 1) {
                results[count] = listCard[i];
                count++;
            }
        }
        return results;
    }

    function getInfoCard(uint256[] memory _listIds)
        external
        view
        returns (Card[] memory)
    {
        Card[] memory results = new Card[](_listIds.length);
        uint256 j = 0;
        for (uint256 i = 0; i < _listIds.length; i++) {
            results[j] = listCard[_listIds[i]];
            j++;
        }
        return results;
    }

    function upgrade(uint256 _cardId, uint256 _cardMaterial) external {
        IGameItems nft = IGameItems(gameItemAddress);
        require(nft.balanceOf(msg.sender, _cardId) == 1, "user not own card");
        require(
            nft.balanceOf(msg.sender, _cardMaterial) == 1,
            "user not own material card"
        );
        require(
            listCard[_cardMaterial].upgrade == listCard[_cardId].upgrade,
            "card and material must have the same upgrade level"
        );

        uint8 checkSuccess = uint8(_random(100));

        if (checkSuccess >= 50) {
            listCard[_cardId].upgrade++;
            listCard[_cardId].winRate = listCard[_cardId].winRate + 3;
        }

        nft.userBurnCard(_cardMaterial, msg.sender);
        delete listCard[_cardMaterial];

        emit UpgradeResult(_cardId, checkSuccess);
    }
}
