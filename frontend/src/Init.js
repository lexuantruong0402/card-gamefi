import React from "react";
import { Button, Container } from "react-bootstrap";
import {
  Contract_abi_gameItems,
  Contract_address_gameItems,
} from "./contracts/GameItems";
import {
  Contract_abi_eggService,
  Contract_address_eggService,
} from "./contracts/EggService";
import {
  Contract_abi_marketplace,
  Contract_address_marketplace,
} from "./contracts/NftMarketplace";
import {
  Contract_abi_cardService,
  Contract_address_cardService,
} from "./contracts/CardService";

function Init({ userAddress, web3Connect }) {
  const nftService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_gameItems,
    Contract_address_gameItems
  );
  const eggService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_eggService,
    Contract_address_eggService
  );
  const cardService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_cardService,
    Contract_address_cardService
  );
  const marketplaceService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_marketplace,
    Contract_address_marketplace
  );

  const setAddress = async () => {
    await cardService.methods
      ._setEggAddress(Contract_address_eggService)
      .send({ from: userAddress });

    await cardService.methods
      ._setGameItemAddress(Contract_address_gameItems)
      .send({ from: userAddress });

    await eggService.methods
      ._setCardServiceAddress(Contract_address_cardService)
      .send({ from: userAddress });

    await eggService.methods
      ._setGameItemAddress(Contract_address_gameItems)
      .send({ from: userAddress });

    await nftService.methods
      ._setCardServiceAddress(Contract_address_cardService)
      .send({ from: userAddress });

    await marketplaceService.methods
      ._setCardAddress(Contract_address_cardService)
      .send({ from: userAddress });

    await marketplaceService.methods
      ._setNftAddress(Contract_address_gameItems)
      .send({ from: userAddress });
  };

  return (
    <Container>
      <Button onClick={() => setAddress()}>Init</Button>
    </Container>
  );
}
export default Init;
