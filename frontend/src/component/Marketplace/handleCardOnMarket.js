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
                  dna: {card.dna} -- price: {card.price}
                </div>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={async () => {
                      await marketplaceService.methods
                        ._buyItem(card.id, 1, card.seller)
                        .send({
                          from: userAddress,
                          value: card.price * 1e18,
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
