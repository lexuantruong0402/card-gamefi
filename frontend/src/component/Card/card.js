import React, { useEffect, useState } from "react";
import {
  Contract_address_cardService,
  Contract_abi_cardService,
} from "../../contracts/CardService.js";
import {
  Contract_address_marketplace,
  Contract_abi_marketplace,
} from "../../contracts/NftMarketplace.js";
import "./card.css";
import HandleCard from "./handleCard.js";

async function getAllCardOfUser(userAddress, web3Connect) {
  const rs = await web3Connect.methods.getAllCardOfUser(userAddress).call();
  return rs;
}

function CardService({ userAddress, web3Connect }) {
  const [listCard, setListCard] = useState([]);
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

  useEffect(() => {
    try {
      async function loadCard() {
        const cards = await getAllCardOfUser(userAddress, cardService);
        setListCard(cards);
      }
      loadCard();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      {listCard?.length > 0 ? (
        <HandleCard
          listCard={listCard}
          cardService={cardService}
          userAddress={userAddress}
          marketplaceService={marketplaceService}
        ></HandleCard>
      ) : (
        ""
      )}
    </>
  );
}
export default CardService;
