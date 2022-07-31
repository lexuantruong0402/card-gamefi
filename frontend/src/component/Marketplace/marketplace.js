import React, { useEffect, useState } from "react";
import {
  Contract_abi_marketplace,
  Contract_address_marketplace,
} from "../../contracts/NftMarketplace";
import {
  Contract_address_cardService,
  Contract_abi_cardService,
} from "../../contracts/CardService.js";
import {
  Contract_address_gameItems,
  Contract_abi_gameItems,
} from "../../contracts/GameItems.js";

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
  const gamesItemService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_gameItems,
    Contract_address_gameItems
  );

  const loadMarket = async () => {
    const listItemOnMarket = await marketplaceService.methods
      .getListItemOnMarket()
      .call();

    const listCardOnMarket = listItemOnMarket.filter(
      (item) => item[0] !== "1022" && item[0] !== "1021"
    );

    const listCardOnMarketInfo = await cardService.methods
      .getInfoCard(listCardOnMarket.map((e) => e[0]))
      .call();

    const listCardOnMarketWithInfo = coverToObject(
      listCardOnMarket,
      listCardOnMarketInfo
    );

    setInfoCardOnMarketOfUser(
      listCardOnMarketWithInfo.filter((elm) => elm.seller === userAddress)
    );

    setInfoCardOnMarket(
      listCardOnMarketWithInfo.filter((elm) => elm.seller !== userAddress)
    );
  };

  useEffect(() => {
    async function load() {
      const checkApprove = await gamesItemService.methods
        .isApprovedForAll(userAddress, Contract_address_marketplace)
        .call();

      if (!checkApprove)
        await gamesItemService.methods
          .setApprovalForAll(Contract_address_marketplace, true)
          .send({ from: userAddress });

      loadMarket();
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
        infoCardOnMarket={infoCardOnMarket}
        marketplaceService={marketplaceService}
        userAddress={userAddress}
      ></HandleCardOnMarket>
    </>
  );
}
export default ShowMarketPlace;
