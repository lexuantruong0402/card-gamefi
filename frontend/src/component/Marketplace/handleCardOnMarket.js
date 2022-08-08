import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import { dnaToPartOfImage } from "../Card/handleCard";
import { ShowCardImage } from "./handleCardOfUser";
import "./marketplace.css";

export default function HandleCardOnMarket({
  infoCardOnMarket,
  marketplaceService,
  userAddress,
}) {
  const infoCard = infoCardOnMarket;
  return (
    <Container>
      <Row>
        {infoCard.map((card) => {
          const parts = dnaToPartOfImage(Number(card.dna));
          return (
            <Col
              key={`${Math.random()}`}
              className="d-flex justify-content-center"
            >
              <div>
                {/* show card */}
                <ShowCardImage parts={parts}></ShowCardImage>
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <p>
                    dna: {card.dna} <br></br>
                    price: {card.price / 1e18} ETH <br></br>
                    upgrade: {card.upgrade} <br></br>
                    winrate: {card.winrate}
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={async () => {
                      await marketplaceService.methods
                        ._buyItem(card.marketId, 1)
                        .send({
                          from: userAddress,
                          value: card.price,
                        });
                      window.location.reload();
                    }}
                  >
                    Buy This Card
                  </Button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
