import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Contract_address_cardService,
  Contract_abi_cardService,
} from "../../contracts/CardService.js";
import "./card.css";
import HandleCard from "./handleCard.js";
import handleCard from "./handleCard.js";

async function getAllCardOfUser(userAddress, web3Connect) {
  const rs = await web3Connect.methods.getAllCardOfUser(userAddress).call();
  return rs;
}

function CardService({ userAddress, web3Connect }) {
  const [listCard, setListCard] = useState([]);
  const [cardService, setCardService] = useState(
    new web3Connect.eth.Contract(
      // @ts-ignore
      Contract_abi_cardService,
      Contract_address_cardService
    )
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
  }, [userAddress, cardService]);

  return (
    <>
      {listCard?.length > 0 ? (
        <HandleCard
          listCard={listCard}
          cardService={cardService}
          userAddress={userAddress}
        ></HandleCard>
      ) : (
        ""
      )}
    </>
  );
}
export default CardService;
