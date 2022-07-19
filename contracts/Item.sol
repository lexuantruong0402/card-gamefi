// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint public constant CommonEgg = 2 ** 10 - 2;
    uint public constant RareEgg = 2 ** 10 - 3;
    struct Card {
        uint dna;
        uint32 readyTime;
    }
    Card[] public listCard; 

    constructor() ERC1155("") {}

    modifier isEgg(uint _nftId) {
        require(_nftId >= 2**10 - 3, "user cannot mint this nft");
        _;
    }

    function _userMint(uint _nftId) internal isEgg(_nftId) {
        _mint(msg.sender, _nftId, 1, "");
    }
}