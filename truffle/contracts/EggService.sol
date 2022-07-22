// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

interface IGameItems is IERC1155 {
    function userMintCard(address sender, uint id) external;
    function userMintEgg(address _sender, uint _typeEgg) external;
    function getCommonEggId() external pure returns(uint);
    function getRareEggId() external pure returns(uint);
    function userBurnEgg(address _sender, uint _typeEgg, uint _amount) external;
}

interface ICardService {
    function _userCreateCard(address _sender) external;
}

contract EggService is Ownable {

    uint8 amountNeedToOpenCommonEgg = 6;
    uint8 amountNeedToOpenRareEgg = 10;

    address gameItemAddress; 
    address cardServiceAddress;

    modifier checkAmount(uint _eggType) {
        IGameItems nft = IGameItems(gameItemAddress);
        uint CommonEggId = nft.getCommonEggId();
        uint RareEggId = nft.getRareEggId();
        
        if (_eggType == CommonEggId) 
            require(nft.balanceOf(msg.sender, CommonEggId) > amountNeedToOpenCommonEgg, "not enough egg");
        if (_eggType == RareEggId) 
            require(nft.balanceOf(msg.sender, RareEggId) > amountNeedToOpenRareEgg, "not enough egg");
        _;
    }

    function _setGameItemAddress(address _address) external onlyOwner {
        gameItemAddress = _address;
    }

    function _setCardServiceAddress(address _address) external onlyOwner {
        cardServiceAddress = _address;
    }

    function _openEgg(uint _eggType) external  {
        ICardService card = ICardService(cardServiceAddress);
        IGameItems nft = IGameItems(gameItemAddress);

        card._userCreateCard(msg.sender);
        if (_eggType == nft.getCommonEggId()) 
            nft.userBurnEgg(msg.sender, _eggType, amountNeedToOpenCommonEgg);
        if (_eggType == nft.getRareEggId()) 
            nft.userBurnEgg(msg.sender, _eggType, amountNeedToOpenRareEgg);
    }
}
