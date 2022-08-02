// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IGameItems is IERC1155 {
    function userMintCard(address sender, uint256 id) external;

    function userMintEgg(address _sender, uint256 _typeEgg) external;

    function getCommonEggId() external pure returns (uint256);

    function getRareEggId() external pure returns (uint256);

    function userBurnEgg(
        address _sender,
        uint256 _typeEgg,
        uint256 _amount
    ) external;
}

interface ICardService {
    function _userCreateCard(address _sender, bool _eggType) external;
}

contract EggService is Ownable {
    uint8 amountNeedToOpenCommonEgg = 6;
    uint8 amountNeedToOpenRareEgg = 10;

    address gameItemAddress;
    address cardServiceAddress;

    modifier checkAmount(uint256 _eggType) {
        IGameItems nft = IGameItems(gameItemAddress);
        uint256 CommonEggId = nft.getCommonEggId();
        uint256 RareEggId = nft.getRareEggId();

        if (_eggType == CommonEggId)
            require(
                nft.balanceOf(msg.sender, CommonEggId) >
                    amountNeedToOpenCommonEgg,
                "not enough egg"
            );
        if (_eggType == RareEggId)
            require(
                nft.balanceOf(msg.sender, RareEggId) > amountNeedToOpenRareEgg,
                "not enough egg"
            );
        _;
    }

    function _setGameItemAddress(address _address) external onlyOwner {
        gameItemAddress = _address;
    }

    function _setCardServiceAddress(address _address) external onlyOwner {
        cardServiceAddress = _address;
    }

    function _openEgg(uint256 _eggType) external checkAmount(_eggType) {
        ICardService card = ICardService(cardServiceAddress);
        IGameItems nft = IGameItems(gameItemAddress);

        if (_eggType == nft.getCommonEggId()) {
            card._userCreateCard(msg.sender, true);
            nft.userBurnEgg(msg.sender, _eggType, amountNeedToOpenCommonEgg);
        }
        if (_eggType == nft.getRareEggId()) {
            card._userCreateCard(msg.sender, false);
            nft.userBurnEgg(msg.sender, _eggType, amountNeedToOpenRareEgg);
        }
    }
}
