import React, { useState } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import {
  dnaToPartOfImage,
  background,
  body,
  brows,
  eyes,
  mouth,
  accessories,
  wings,
} from "./handleCard";

export default function UpgradeCard({
  targetCard,
  listCard,
  cardService,
  userAddress,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button
        variant="outline-warning"
        style={{
          marginTop: "-12px",
          marginBottom: "50px",
          marginLeft: "45px",
        }}
        onClick={() => {
          setShow(true);
        }}
      >
        Upgrade
      </Button>

      <Modal show={show} size="xl" onHide={() => setShow(false)}>
        <Modal.Body>
          <Row>
            {listCard
              .filter(
                (e) =>
                  e.id !== targetCard.id && e.upgrade === targetCard.upgrade
              )
              .map((card) => {
                const parts = dnaToPartOfImage(Number(card.dna));
                return (
                  <Col
                    key={`${Math.random()}`}
                    className="d-flex justify-content-center"
                  >
                    <div>
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
                          src={`/images/background/${
                            parts[0] % background
                          }.png`}
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
                          src={`/images/accessories/${
                            parts[5] % accessories
                          }.png`}
                        ></img>
                        <img
                          alt="wings"
                          className="img-nft img-wings"
                          src={`/images/wings/${parts[6] % wings}.png`}
                        ></img>
                      </div>
                      <p
                        style={{
                          marginLeft: "10px",
                          marginBottom: "0px",
                        }}
                      >
                        dna: {card.dna}
                        <br></br>
                        upgrade: {card.upgrade} -- winrate: {card.winRate}
                        <br></br>
                      </p>
                      <Button
                        style={{
                          marginTop: "0px",
                          marginBottom: "30px",
                          marginLeft: "60px",
                        }}
                        onClick={async () => {
                          const result = await cardService.methods
                            .upgrade(targetCard.id, card.id)
                            .send({ from: userAddress });

                          Number(
                            result.events.UpgradeResult.returnValues.success
                          ) >= 50
                            ? alert("Success")
                            : alert("Fail");
                          setShow(false);
                          window.location.reload();
                        }}
                      >
                        Choose
                      </Button>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
