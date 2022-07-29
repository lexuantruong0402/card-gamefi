// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC1155Holder, Ownable {
    event MarketItemCreated(
        uint256 _cardId,
        uint256 price,
        address seller,
        address keeper
    );
    event ItemCanceled(uint256 _cardId, address seller);
    event MarketItemUpdated(
        uint256 _cardId,
        uint256 oldPrice,
        uint256 newPrice,
        address seller,
        address keeper
    );
    event ItemBought(uint256 _cardId, address seller, address buyer);

    struct CardMarketItem {
        uint256 _cardId;
        uint256 price;
        address nftAddress;
        address seller;
        address keeper;
    }

    address nftAddress;
    address cardAddress;
    uint8 fee = 10;

    mapping(uint256 => CardMarketItem) public listCardOnMarket;

    modifier checkPrice(uint256 _price) {
        require(_price > 0, "Price must be at least 1 wei");
        _;
    }

    modifier checkIsSeller(uint256 _cardId) {
        require(
            listCardOnMarket[_cardId].seller == msg.sender,
            "You are not the seller"
        );
        _;
    }

    modifier checkIsOnMarket(uint256 _cardId) {
        require(listCardOnMarket[_cardId].price > 0, "Not Listed");
        _;
    }

    modifier checkIsNotOnMarket(uint256 _cardId) {
        require(listCardOnMarket[_cardId].price <= 0, "Listed");
        _;
    }

    function _setNftAddress(address _nftAddress) external {
        nftAddress = _nftAddress;
    }

    function _setCardAddress(address _nftAddress) external {
        nftAddress = _nftAddress;
    }

    function _sellItem(uint256 _cardId, uint256 _price)
        external
        checkPrice(_price)
        checkIsNotOnMarket(_cardId)
    {
        IERC1155 nft = IERC1155(nftAddress);
        listCardOnMarket[_cardId] = CardMarketItem(
            _cardId,
            _price,
            nftAddress,
            msg.sender,
            address(this)
        );
        nft.safeTransferFrom(msg.sender, address(this), _cardId, 1, "0x0");
        emit MarketItemCreated(_cardId, _price, msg.sender, address(this));
    }

    function _cancelItemListed(uint256 _cardId)
        external
        checkIsOnMarket(_cardId)
        checkIsSeller(_cardId)
    {
        IERC1155 nft = IERC1155(nftAddress);
        delete (listCardOnMarket[_cardId]);
        nft.safeTransferFrom(address(this), msg.sender, _cardId, 1, "0x0");
        emit ItemCanceled(_cardId, msg.sender);
    }

    function _updatePrice(uint256 _cardId, uint256 _newPrice)
        external
        checkIsOnMarket(_cardId)
        checkIsSeller(_cardId)
    {
        emit MarketItemUpdated(
            _cardId,
            listCardOnMarket[_cardId].price,
            _newPrice,
            listCardOnMarket[_cardId].seller,
            listCardOnMarket[_cardId].keeper
        );
        listCardOnMarket[_cardId].price = _newPrice;
    }

    function _buyItem(uint256 _cardId)
        external
        payable
        checkIsOnMarket(_cardId)
    {
        IERC1155 nft = IERC1155(nftAddress);
        CardMarketItem memory itemOnMarket = listCardOnMarket[_cardId];
        require(msg.value >= itemOnMarket.price);

        uint256 _cardPriceToWei = itemOnMarket.price * 1e18;
        uint256 _changeMoney = msg.value - _cardPriceToWei;
        uint256 _ownerEarn = (_cardPriceToWei * fee) / 100;
        uint256 _sellerEarn = _cardPriceToWei - _ownerEarn;

        payable(msg.sender).transfer(_changeMoney);
        payable(owner()).transfer(_ownerEarn);
        payable(itemOnMarket.seller).transfer(_sellerEarn);

        nft.safeTransferFrom(address(this), msg.sender, _cardId, 1, "0x0");
        delete (listCardOnMarket[_cardId]);
        emit ItemBought(_cardId, itemOnMarket.seller, msg.sender);
    }

    function getListCardOfUserOnMarket(address _userAddress, uint256 _totalCard)
        external
        view
        returns (CardMarketItem[] memory)
    {
        uint256 count = 0;
        uint256 j = 0;
        for (uint256 i = 0; i < _totalCard; i++) {
            if (listCardOnMarket[i].seller == _userAddress) count++;
        }

        CardMarketItem[] memory results = new CardMarketItem[](count);
        for (uint256 i = 0; i < _totalCard; i++) {
            if (listCardOnMarket[i].seller == _userAddress) {
                results[j] = listCardOnMarket[i];
                j++;
            }
        }
        return results;
    }

    function getListCardOnMarket(uint256 _totalCard)
        external
        view
        returns (CardMarketItem[] memory)
    {
        uint256 count = 0;
        uint256 j = 0;
        for (uint256 i = 0; i < _totalCard; i++) {
            if (listCardOnMarket[i].keeper == address(this)) count++;
        }

        CardMarketItem[] memory results = new CardMarketItem[](count);
        for (uint256 i = 0; i < _totalCard; i++) {
            if (listCardOnMarket[i].keeper == address(this)) {
                results[j] = listCardOnMarket[i];
                j++;
            }
        }
        return results;
    }
}
