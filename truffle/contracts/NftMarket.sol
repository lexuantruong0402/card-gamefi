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

    MarketItem[] public listItemOnMarket;

    modifier checkPrice(uint256 _price) {
        require(_price > 0, "Price must be at least 1 wei");
        _;
    }

    modifier checkOnMarket(uint256 _marketId) {
        require(listItemOnMarket[_marketId].price > 0, "Item not on market");
        _;
    }

    modifier isSeller(address _sender, uint256 _marketId) {
        require(
            _sender == listItemOnMarket[_marketId].seller,
            "You arn't the Seller"
        );
        _;
    }

    function _setNftAddress(address _nftAddress) external onlyOwner {
        nftAddress = _nftAddress;
    }

    function _setCardAddress(address _nftAddress) external onlyOwner {
        nftAddress = _nftAddress;
    }

    function _sellItem(
        uint256 _itemId,
        uint256 _price,
        uint256 _amount
    ) external checkPrice(_price) {
        IERC1155 nft = IERC1155(nftAddress);
        require(
            nft.balanceOf(msg.sender, _itemId) >= _amount,
            "not enough item"
        );

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

    function _cancelItemListed(uint256 _marketId)
        external
        checkOnMarket(_marketId)
        isSeller(msg.sender, _marketId)
    {
        IERC1155 nft = IERC1155(nftAddress);

        nft.safeTransferFrom(
            address(this),
            msg.sender,
            listItemOnMarket[_marketId].itemId,
            listItemOnMarket[_marketId].amount,
            "0x0"
        );
        delete listItemOnMarket[_marketId];
    }

    function _update(
        uint256 _marketId,
        uint256 _newPrice,
        uint256 _newAmount // check new amount > 0
    )
        external
        checkOnMarket(_marketId)
        checkPrice(_newAmount)
        isSeller(msg.sender, _marketId)
    {
        IERC1155 nft = IERC1155(nftAddress);

        if (listItemOnMarket[_marketId].amount > _newAmount)
            nft.safeTransferFrom(
                address(this),
                msg.sender,
                listItemOnMarket[_marketId].itemId,
                listItemOnMarket[_marketId].amount - _newAmount,
                "0x0"
            );

        if (listItemOnMarket[_marketId].amount < _newAmount) {
            require(
                nft.balanceOf(msg.sender, listItemOnMarket[_marketId].itemId) >
                    _newAmount - listItemOnMarket[_marketId].amount,
                "not enough item"
            );
            nft.safeTransferFrom(
                msg.sender,
                address(this),
                listItemOnMarket[_marketId].itemId,
                _newAmount - listItemOnMarket[_marketId].amount,
                "0x0"
            );
        }

        listItemOnMarket[_marketId].amount = _newAmount;
        listItemOnMarket[_marketId].price = _newPrice;
    }

    function _buyItem(uint256 _marketId, uint256 _amount)
        external
        payable
        checkOnMarket(_marketId)
        checkPrice(_amount)
    {
        require(
            msg.sender != listItemOnMarket[_marketId].seller,
            "Can't buy your own item "
        );
        IERC1155 nft = IERC1155(nftAddress);

        uint256 _cardPriceToWei = listItemOnMarket[_marketId].price * _amount;
        require(msg.value >= _cardPriceToWei);
        uint256 _changeMoney = msg.value - _cardPriceToWei;
        uint256 _ownerEarn = (_cardPriceToWei * fee) / 100;
        uint256 _sellerEarn = _cardPriceToWei - _ownerEarn;

        payable(msg.sender).transfer(_changeMoney);
        payable(owner()).transfer(_ownerEarn);
        payable(listItemOnMarket[_marketId].seller).transfer(_sellerEarn);

        nft.safeTransferFrom(
            address(this),
            msg.sender,
            listItemOnMarket[_marketId].itemId,
            _amount,
            "0x0"
        );
        if (_amount == listItemOnMarket[_marketId].amount)
            delete listItemOnMarket[_marketId];
        else
            (listItemOnMarket[_marketId].amount =
                listItemOnMarket[_marketId].amount -
                _amount);

        emit ItemBought(
            listItemOnMarket[_marketId].itemId,
            _amount,
            listItemOnMarket[_marketId].seller,
            msg.sender
        );
    }

    function getListItemOnMarket() external view returns (MarketItem[] memory) {
        return listItemOnMarket;
    }
}
