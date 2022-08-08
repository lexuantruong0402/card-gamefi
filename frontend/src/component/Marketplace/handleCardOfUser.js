import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";

import {
  accessories,
  background,
  body,
  brows,
  dnaToPartOfImage,
  eyes,
  mouth,
} from "../Card/handleCard";
import "./marketplace.css";

export function ShowCardImage({ parts }) {
  return (
    <div style={{ marginLeft: "7px" }}>
      <div
        style={{
          height: "200px",
          width: "200px",
          position: "relative",
          margin: "5 5 5 5",
        }}
        className="img-nft"
      >
        <img
          alt="bg"
          className="img-nft img-background"
          src={`/images/background/${parts[0] % background}.png`}
        ></img>
        <img
          alt="body"
          className="img-nft img-body"
          src={`/images/body/${parts[1] % body}.png`}
        ></img>
        <img
          alt="brows"
          className="img-nft img-brows"
          src={`/images/brows/${parts[2] % brows}.png`}
        ></img>
        <img
          alt="eyes"
          className="img-nft img-eyes"
          src={`/images/eyes/${parts[3] % eyes}.png`}
        ></img>
        <img
          alt="mouth"
          className="img-nft img-mouth"
          src={`/images/mouth/${parts[4] % mouth}.png`}
        ></img>
        <img
          alt="accessories"
          className="img-nft img-accessories"
          src={`/images/accessories/${parts[5] % accessories}.png`}
        ></img>
      </div>
    </div>
  );
}

export default function HandleCardOfUser({
  infoCardOnMarketOfUser,
  marketplaceService,
  userAddress,
}) {
  const infoCard = infoCardOnMarketOfUser;
  const [show, setShow] = useState(false);
  const [marketId, setMarketId] = useState(0);
  let newPrice;
  const handleUpdatePrice = (e) => {
    newPrice = e.target.value;
  };

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

                {/* show button update price */}
                <div style={{ textAlign: "center", marginTop: "2px" }}>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setShow(true);
                      setMarketId(card.marketId);
                    }}
                  >
                    Update price
                  </Button>

                  <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Price</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0.1"
                          onChange={handleUpdatePrice}
                        />
                      </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShow(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={async () => {
                          await marketplaceService.methods
                            ._update(marketId, (newPrice * 1e18).toString(), 1)
                            .send({ from: userAddress });
                          setShow(false);
                          window.location.reload();
                        }}
                      >
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await marketplaceService.methods
                        ._cancelItemListed(card.marketId)
                        .send({ from: userAddress });
                      window.location.reload();
                    }}
                  >
                    Cancel sell
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
