// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC1155Holder, Ownable {
    event MarketItemCreated(
        uint256 id,
        uint256 price,
        uint256 amount,
        address seller,
        address keeper
    );
    event ItemBought(
        uint256 itemId,
        uint256 amount,
        address seller,
        address buyer
    );

    struct MarketItem {
        uint256 marketId;
        uint256 itemId;
        uint256 price;
        uint256 amount;
        address seller;
        address keeper;
    }

    address nftAddress;
    address cardAddress;
    uint8 fee = 10;
    uint256 marketId = 0;

    MarketItem[] listItemOnMarket;

    modifier checkPrice(uint256 _price) {
        require(_price > 0, "Price must be at least 1 wei");
        _;
    }

    function _setNftAddress(address _nftAddress) external {
        nftAddress = _nftAddress;
    }

    function _setCardAddress(address _nftAddress) external {
        nftAddress = _nftAddress;
    }

    function _findItem(uint256 _marketId) public view returns (uint256) {
        uint256 index;
        for (uint256 i = 0; i < listItemOnMarket.length; i++) {
            if (listItemOnMarket[i].marketId == _marketId) {
                index = i;
                return (index);
            }
        }
        return (index + 1);
    }

    function _deleteFromListItemOnMarket(uint256 _index) internal {
        listItemOnMarket[_index] = listItemOnMarket[
            listItemOnMarket.length - 1
        ];
        listItemOnMarket.pop();
    }

    function _sellItem(
        uint256 _itemId,
        uint256 _price,
        uint256 _amount
    ) external checkPrice(_price) {
        IERC1155 nft = IERC1155(nftAddress);

        listItemOnMarket.push(
            MarketItem(
                marketId,
                _itemId,
                _price,
                _amount,
                msg.sender,
                address(this)
            )
        );
        marketId++;

        nft.safeTransferFrom(
            msg.sender,
            address(this),
            _itemId,
            _amount,
            "0x0"
        );

        emit MarketItemCreated(
            _itemId,
            _price,
            _amount,
            msg.sender,
            address(this)
        );
    }

    function _cancelItemListed(uint256 _marketId) external {
        IERC1155 nft = IERC1155(nftAddress);

        uint256 index;
        (index) = _findItem(_marketId);
        MarketItem memory middle = listItemOnMarket[index];
        _deleteFromListItemOnMarket(index);

        nft.safeTransferFrom(
            address(this),
            msg.sender,
            middle.itemId,
            middle.amount,
            "0x0"
        );
    }

    function _update(
        uint256 _marketId,
        uint256 _newPrice,
        uint256 _newAmount // check new amount > 0
    ) external {
        IERC1155 nft = IERC1155(nftAddress);

        uint256 index;
        (index) = _findItem(_marketId);
        MarketItem memory middle = listItemOnMarket[index];
        if (listItemOnMarket[index].amount > _newAmount)
            nft.safeTransferFrom(
                address(this),
                msg.sender,
                middle.itemId,
                middle.amount - _newAmount,
                "0x0"
            );

        if (listItemOnMarket[index].amount < _newAmount)
            nft.safeTransferFrom(
                msg.sender,
                address(this),
                middle.itemId,
                _newAmount - middle.amount,
                "0x0"
            );

        listItemOnMarket[index].amount = _newAmount;
        listItemOnMarket[index].price = _newPrice;
    }

    function _buyItem(uint256 _marketId, uint256 _amount) external payable {
        IERC1155 nft = IERC1155(nftAddress);

        uint256 index;
        (index) = _findItem(_marketId);
        MarketItem memory middle = listItemOnMarket[index];

        uint256 _cardPriceToWei = middle.price * 1e18 * _amount;
        require(msg.value >= _cardPriceToWei);
        uint256 _changeMoney = msg.value - _cardPriceToWei;
        uint256 _ownerEarn = (_cardPriceToWei * fee) / 100;
        uint256 _sellerEarn = _cardPriceToWei - _ownerEarn;

        payable(msg.sender).transfer(_changeMoney);
        payable(owner()).transfer(_ownerEarn);
        payable(middle.seller).transfer(_sellerEarn);

        nft.safeTransferFrom(
            address(this),
            msg.sender,
            middle.itemId,
            _amount,
            "0x0"
        );
        if (_amount == middle.amount) _deleteFromListItemOnMarket(index);
        else (listItemOnMarket[index].amount = middle.amount - _amount);

        emit ItemBought(middle.itemId, _amount, middle.seller, msg.sender);
    }

    function getListItemOnMarket() external view returns (MarketItem[] memory) {
        return listItemOnMarket;
    }
}
