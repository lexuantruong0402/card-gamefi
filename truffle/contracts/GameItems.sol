// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract GameItems is ERC1155, Ownable {
    // egg properties
    uint256 constant CommonEgg = 2**10 - 2;
    uint256 constant RareEgg = 2**10 - 3;

    constructor() ERC1155("") {}

    modifier isEgg(uint256 _nftId) {
        require(_nftId >= 2**10 - 3, "user cannot mint this nft");
        _;
    }

    function userMintCard(address _sender, uint256 _id) external {
        _mint(_sender, _id, 1, "");
    }

    function userMintEgg(address _sender, uint256 _typeEgg) external {
        _mint(_sender, _typeEgg, 1, "");
    }

    function getCommonEggId() external pure returns (uint256) {
        return CommonEgg;
    }

    function getRareEggId() external pure returns (uint256) {
        return RareEgg;
    }

    function userBurnEgg(
        address _sender,
        uint256 _typeEgg,
        uint256 _amount
    ) external {
        _burn(_sender, _typeEgg, _amount);
    }
}
