import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import "./card.css";

const background = 20;
const body = 3;
const brows = 2;
const eyes = 17;
const mouth = 2;
const accessories = 12;

function dnaToPartOfImage(dna) {
  const partArray = [];
  for (let i = 0; i < 6; i++) {
    partArray.push(dna % 100);
    dna = Math.floor(dna / 100);
  }
  return partArray.reverse();
}

const handleCard = (listCard) => {
  return (
    <Container className="d-flex justify-content-center">
      <Row>
        {listCard.map(card => {
          const parts = dnaToPartOfImage(Number(card[0]));
          const coolDown = card[1];
          return (

            <Col key={`${Math.random()}`}>
              <div style={{ height: "200px", width: "200px", position: "relative", margin: "5 5 5 5" }}>
                <img alt="bg" className="img-background" src={`/images/background/${parts[0] % background}.png`}></img>
                <img alt="body" className="img-body" src={`/images/body/${parts[1] % body}.png`}></img>
                <img alt="brows" className="img-brows" src={`/images/brows/${parts[2] % brows}.png`}></img>
                <img alt="eyes" className="img-eyes" src={`/images/eyes/${parts[3] % eyes}.png`}></img>
                <img alt="mouth" className="img-mouth" src={`/images/mouth/${parts[4] % mouth}.png`}></img>
                <img alt="accessories" className="img-accessories" src={`/images/accessories/${parts[5] % accessories}.png`}></img>
              </div>
              {
                coolDown > Date.now() ?
                  <Countdown className="countdown-battle" date={Number(coolDown) - Date.now()} /> :
                  <Button variant="outline-danger" style={{ marginTop: "10px", marginBottom: "20px", marginLeft: "60px" }}>Fight</Button>
              }
            </Col>
          )
        })}
      </Row>
    </Container >
  )
}

async function getAllCardOfUser(userAddress, web3Connect) {
  const rs = await web3Connect.methods.getAllCardOfUser(userAddress).call();
  return rs;
}

function CardService({ userAddress, web3Connect }) {
  const [listCard, setListCard] = useState([]);

  useEffect(() => {
    try {
      async function loadCard() {
        setListCard(await getAllCardOfUser(userAddress, web3Connect));
      }
      loadCard();
    } catch (err) {
      console.log(err)
    }
  }, [userAddress, web3Connect]);

  return (
    <>{listCard.length > 0 ? (handleCard(listCard)) : ""}</>
  );
}
export default CardService;
