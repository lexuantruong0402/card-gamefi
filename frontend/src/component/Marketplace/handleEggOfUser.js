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

function UpdateButton({ marketId, marketplaceService, userAddress }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let newSellPrice = 0;
  let newAmount = 0;

  return (
    <div>
      <Button variant="warning" onClick={() => setShowUpdateModal(true)}>
        Update
      </Button>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Price</InputGroup.Text>
            <Form.Control
              type="number"
              min="0.1"
              onChange={(e) => {
                newSellPrice = Number(e.target.value);
              }}
            />
            <InputGroup.Text>Amount</InputGroup.Text>
            <Form.Control
              type="number"
              min="0.1"
              onChange={(e) => {
                newAmount = Number(e.target.value);
              }}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              console.log(marketId, newSellPrice, newAmount);
              await marketplaceService.methods
                ._update(marketId, newSellPrice, newAmount)
                .send({ from: userAddress });
              setShowUpdateModal(false);
              window.location.reload();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default function HandleEggOfUser({
  infoEgg,
  marketplaceService,
  userAddress,
}) {
  const eggOfUser = infoEgg.filter((egg) => egg.seller === userAddress);

  return (
    <Container>
      <Row>
        {eggOfUser.map((egg) => {
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
                  <UpdateButton
                    marketId={egg.marketId}
                    marketplaceService={marketplaceService}
                    userAddress={userAddress}
                  ></UpdateButton>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await marketplaceService.methods
                        ._cancelItemListed(egg.marketId)
                        .send({ from: userAddress });
                      window.location.reload();
                    }}
                  >
                    Cancel
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
