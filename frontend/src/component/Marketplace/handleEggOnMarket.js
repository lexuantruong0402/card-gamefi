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
import { normalEggId } from "../Egg/egg";

export default function HandleEggOnMarket({
  infoEgg,
  marketplaceService,
  userAddress,
}) {
  const eggOnMarket = infoEgg.filter((egg) => egg.seller !== userAddress);
  const [show, setShow] = useState(false);
  let amountBuy = 0;
  console.log(infoEgg);

  return (
    <Container>
      <Row>
        {eggOnMarket.map((egg) => {
          console.log(egg);

          return (
            <Col
              key={`${Math.random()}`}
              className="d-flex justify-content-center"
            >
              {egg.itemId === normalEggId.toString() ? (
                <img
                  alt="common egg amount"
                  style={{ height: "150px", width: "150px" }}
                  src={`/eggs/2.png`}
                ></img>
              ) : (
                <img
                  alt="rare egg amount"
                  style={{ height: "150px", width: "150px" }}
                  src={`/eggs/1.png`}
                ></img>
              )}

              <div>
                <p style={{ color: "white" }}>
                  Price: {egg.price} -- Amount: {egg.amount}
                </p>
                <div>
                  <Button
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    Buy
                  </Button>
                  <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Sell</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Amount</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="1"
                          step="1"
                          max={egg.amount}
                          onChange={(e) => {
                            amountBuy = Number(e.target.value);
                          }}
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
                        onClick={async () => {
                          await marketplaceService.methods
                            ._buyItem(egg.itemId, amountBuy)
                            .send({
                              from: userAddress,
                              value: egg.price * 1e18 * amountBuy,
                            });
                          window.location.reload();
                        }}
                      >
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
