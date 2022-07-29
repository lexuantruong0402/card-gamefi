import React, { useEffect, useState } from "react";
import {
  Contract_abi_marketplace,
  Contract_address_marketplace,
} from "../../contracts/NftMarketplace";
import {
  Contract_address_cardService,
  Contract_abi_cardService,
} from "../../contracts/CardService.js";

import "./marketplace.css";
import HandleCardOfUser from "./handleCardOfUser";
import HandleCardOnMarket from "./handleCardOnMarket";

function coverToObject(infoOnMarket, infoOnCardService) {
  const cardIdsUser = [];

  infoOnMarket.forEach((e) => {
    const ob = {
      id: e[0],
      price: e[1],
      seller: e[3],
      dna: infoOnCardService.find((elm) => elm[0] === e[0])[1],
    };

    cardIdsUser.push(ob);
  });
  return cardIdsUser;
}

function ShowMarketPlace({ userAddress, web3Connect }) {
  const [infoCardOnMarketOfUser, setInfoCardOnMarketOfUser] = useState([]);
  const [infoCardOnMarket, setInfoCardOnMarket] = useState([]);
  const [cardsCanBuy, setCardsCanBuy] = useState([]);

  const marketplaceService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_marketplace,
    Contract_address_marketplace
  );
  const cardService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_cardService,
    Contract_address_cardService
  );

  useEffect(() => {
    async function load() {
      const totalCard = await cardService.methods.getTotalCard().call();
      const cardsOnMarket = await marketplaceService.methods
        .getListCardOnMarket(totalCard)
        .call();

      const getInfoCardMarket = await cardService.methods
        .getInfoCard(cardsOnMarket.map((e) => e[0][0]))
        .call();

      const cardInfoMarket = coverToObject(cardsOnMarket, getInfoCardMarket);
      setInfoCardOnMarket(cardInfoMarket);

      const cardsOnMarketOfUser = await marketplaceService.methods
        .getListCardOfUserOnMarket(userAddress, totalCard)
        .call();

      const getInfoCardUser = await cardService.methods
        .getInfoCard(cardsOnMarketOfUser.map((e) => e[0][0]))
        .call();

      const cardInfoMarketUser = coverToObject(
        cardsOnMarketOfUser,
        getInfoCardUser
      );
      setInfoCardOnMarketOfUser(cardInfoMarketUser);

      const cardInfoMarketFilter = cardInfoMarket.filter(
        (e) => !cardInfoMarketUser.map((elm) => elm.id).includes(e.id)
      );
      setCardsCanBuy(cardInfoMarketFilter);
    }

    load().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <HandleCardOfUser
        infoCardOnMarketOfUser={infoCardOnMarketOfUser}
        marketplaceService={marketplaceService}
        userAddress={userAddress}
      ></HandleCardOfUser>
      <HandleCardOnMarket
        infoCardOnMarket={cardsCanBuy}
        marketplaceService={marketplaceService}
        userAddress={userAddress}
      ></HandleCardOnMarket>
    </>
  );
}
export default ShowMarketPlace;
