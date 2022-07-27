import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import Countdown from "react-countdown";

function dnaToPartOfImage(dna) {
  const partArray = [];
  for (let i = 0; i < 6; i++) {
    partArray.push(dna % 100);
    dna = Math.floor(dna / 100);
  }
  return partArray.reverse();
}

const background = 20;
const body = 3;
const brows = 2;
const eyes = 17;
const mouth = 2;
const accessories = 12;

const handleFight = async (cardService, idfight, userAddress) => {
  const response = await cardService.methods
    ._battle(idfight)
    .send({ from: userAddress });
};

export default function HandleCard(listCard, cardService, userAddress) {
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
                >
                  <Button
                    variant="outline-danger"
                    style={{
                      marginTop: "10px",
                      marginBottom: "20px",
                      marginLeft: "60px",
                    }}
                    onClick={() => {
                      handleFight(cardService, card[0], userAddress);
                    }}
                  >
                    Fight
                  </Button>
                </Countdown>
              ) : (
                <Button
                  variant="outline-danger"
                  style={{
                    marginTop: "10px",
                    marginBottom: "20px",
                    marginLeft: "60px",
                  }}
                  onClick={() => {
                    handleFight(cardService, card[0], userAddress);
                  }}
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
}
