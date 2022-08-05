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
import { normalEggId, rareEggId } from "../Egg/egg";
import HandleEggOfUser from "./handleEggOfUser";
import HandleEggOnMarket from "./handleEggOnMarket";
import { Row, Col, Button } from "react-bootstrap";

function coverToObject(infoOnMarket, infoOnCardService) {
  const cardIdsUser = [];

  infoOnMarket.forEach((e) => {
    const ob = {
      marketId: e.marketId,
      id: e.itemId,
      price: e.price,
      seller: e.seller,
      dna: infoOnCardService.find((elm) => elm.id === e.itemId).dna,
    };

    cardIdsUser.push(ob);
  });
  return cardIdsUser;
}

function ShowMarketPlace({ userAddress, web3Connect }) {
  const [infoCardOnMarketOfUser, setInfoCardOnMarketOfUser] = useState([]);
  const [infoCardOnMarket, setInfoCardOnMarket] = useState([]);
  const [eggOnMarket, setEggOnMarket] = useState([]);
  const [tab, setTab] = useState("card");

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
      (item) =>
        item.itemId !== "1022" && item.itemId !== "1021" && item.price > 0
    );

    const listCardOnMarketInfo = await cardService.methods
      .getInfoCard(listCardOnMarket.map((e) => e.itemId))
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

    const listEggOnMarket = listItemOnMarket.filter(
      (item) =>
        item.itemId === normalEggId.toString() ||
        item.itemId === rareEggId.toString()
    );

    setEggOnMarket(listEggOnMarket);
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
      <Row>
        <Col
          className="d-flex justify-content-center"
          style={{ padding: "5 5 5 5" }}
        >
          <Button
            variant="primary"
            onClick={() => {
              setTab("card");
            }}
          >
            <span className="button-text-before-click"> Cards </span>
          </Button>
        </Col>
        <Col
          className="d-flex justify-content-center"
          style={{ padding: "5 5 5 5" }}
        >
          <Button
            variant="info"
            onClick={() => {
              setTab("egg");
            }}
          >
            <span className="button-text-before-click"> Eggs </span>
          </Button>
        </Col>
      </Row>
      {tab === "card" ? (
        <>
          <div>
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              You are selling
            </h1>
            <HandleCardOfUser
              infoCardOnMarketOfUser={infoCardOnMarketOfUser}
              marketplaceService={marketplaceService}
              userAddress={userAddress}
            ></HandleCardOfUser>
          </div>
          <div>
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              Another user are selling
            </h1>
            <HandleCardOnMarket
              infoCardOnMarket={infoCardOnMarket}
              marketplaceService={marketplaceService}
              userAddress={userAddress}
            ></HandleCardOnMarket>{" "}
          </div>
        </>
      ) : (
        <>
          <div>
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              You are selling
            </h1>
            <HandleEggOfUser
              infoEgg={eggOnMarket}
              marketplaceService={marketplaceService}
              userAddress={userAddress}
            ></HandleEggOfUser>
          </div>
          <div>
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              Another user are selling
            </h1>
            <HandleEggOnMarket
              infoEgg={eggOnMarket}
              marketplaceService={marketplaceService}
              userAddress={userAddress}
            ></HandleEggOnMarket>
          </div>
        </>
      )}
    </>
  );
}
export default ShowMarketPlace;
