import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import {
  Contract_address_cardService,
  Contract_abi_cardService,
} from "../../contracts/CardService.js";
import "./card.css";

const background = 20;
const body = 3;
const brows = 2;
const eyes = 17;
const mouth = 2;
const accessories = 12;

const handleCard = (listCard) => {
  return (
    <Container className="d-flex justify-content-center">
      <Row>
        {listCard.map((card) => {
          const parts = dnaToPartOfImage(Number(card[1]));
          const coolDown = card[2];
          const now = Date.now();

          return (
            <Col key={`${Math.random()}`}>
              <div
                style={{
                  height: "200px",
                  width: "200px",
                  position: "relative",
                  margin: "5 5 5 5",
                }}
              >
                <img
                  alt="bg"
                  className="img-background"
                  src={`/images/background/${parts[0] % background}.png`}
                ></img>
                <img
                  alt="body"
                  className="img-body"
                  src={`/images/body/${parts[1] % body}.png`}
                ></img>
                <img
                  alt="brows"
                  className="img-brows"
                  src={`/images/brows/${parts[2] % brows}.png`}
                ></img>
                <img
                  alt="eyes"
                  className="img-eyes"
                  src={`/images/eyes/${parts[3] % eyes}.png`}
                ></img>
                <img
                  alt="mouth"
                  className="img-mouth"
                  src={`/images/mouth/${parts[4] % mouth}.png`}
                ></img>
                <img
                  alt="accessories"
                  className="img-accessories"
                  src={`/images/accessories/${parts[5] % accessories}.png`}
                ></img>
              </div>
              {Number(coolDown) * 1000 > now ? (
                <Countdown
                  className="countdown-battle"
                  date={Number(coolDown) * 1000}
                />
              ) : (
                <Button
                  variant="outline-danger"
                  style={{
                    marginTop: "10px",
                    marginBottom: "20px",
                    marginLeft: "60px",
                  }}
                  onClick={handleFight(card[0])}
                >
                  Fight
                </Button>
              )}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

async function getAllCardOfUser(userAddress, web3Connect) {
  const rs = await web3Connect.methods.getAllCardOfUser(userAddress).call();
  return rs;
}

function dnaToPartOfImage(dna) {
  const partArray = [];
  for (let i = 0; i < 6; i++) {
    partArray.push(dna % 100);
    dna = Math.floor(dna / 100);
  }
  return partArray.reverse();
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
        setListCard(await getAllCardOfUser(userAddress, cardService));
      }
      loadCard();
    } catch (err) {
      console.log(err);
    }
  }, [userAddress, cardService]);

  return <>{listCard.length > 0 ? handleCard(listCard) : ""}</>;
}
export default CardService;
