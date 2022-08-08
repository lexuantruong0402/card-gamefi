import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import Countdown from "react-countdown";
import UpgradeCard from "./upgradeCard";

export function dnaToPartOfImage(dna) {
  const partArray = [];
  for (let i = 0; i < 7; i++) {
    partArray.push(dna % 100);
    dna = Math.floor(dna / 100);
  }

  return partArray.reverse();
}

export const background = 20;
export const body = 3;
export const brows = 2;
export const eyes = 17;
export const mouth = 2;
export const accessories = 12;
export const wings = 6;

const handleFight = async (
  cardService,
  idfight,
  userAddress,
  setShow,
  setWin,
  setNormalEgg
) => {
  const response = await cardService.methods
    ._battle(idfight)
    .send({ from: userAddress });
  const result = response.events.FightResult.returnValues;

  if (result[1] > 50) {
    setWin(true);
    if (result[2] > 30) setNormalEgg(true);
    else setNormalEgg(false);
  } else setWin(false);
  setShow(true);
};

export default function HandleCard({
  listCard,
  cardService,
  userAddress,
  marketplaceService,
}) {
  const [show, setShow] = useState(false);
  const [win, setWin] = useState(false);
  const [normalEgg, setNormalEgg] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [sellCard, setSellCard] = useState(0);
  let sellPrice;

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const handleSubmitSell = (e) => {
    sellPrice = e.target.value;
  };

  return (
    <Container className="d-flex justify-content-center">
      <Row>
        {listCard.map((card) => {
          const parts = dnaToPartOfImage(Number(card.dna));
          const coolDown = card.readyTime;
          const now = Date.now();

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
                  <img
                    alt="wings"
                    className="img-nft img-wings"
                    src={`/images/wings/${parts[6] % wings}.png`}
                  ></img>
                </div>
                <p
                  style={{
                    color: "white",
                    marginLeft: "10px",
                    marginBottom: "0px",
                  }}
                >
                  dna: {card.dna}
                  <br></br>
                  upgrade: {card.upgrade} -- winrate: {card.winRate}
                  <br></br>
                </p>
                {Number(coolDown) * 1000 > now ? (
                  <Countdown
                    className="countdown-battle"
                    date={Number(coolDown) * 1000}
                  >
                    <Button
                      variant="outline-danger"
                      style={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        marginLeft: "60px",
                      }}
                      onClick={() => {
                        handleFight(cardService, card.id, userAddress, setShow);
                      }}
                    >
                      Fight
                    </Button>
                  </Countdown>
                ) : (
                  <div>
                    <Button
                      variant="outline-danger"
                      style={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        marginLeft: "60px",
                      }}
                      onClick={() => {
                        handleFight(
                          cardService,
                          card.id,
                          userAddress,
                          setShow,
                          setWin,
                          setNormalEgg
                        );
                      }}
                    >
                      Fight
                    </Button>

                    <Modal show={show} onHide={handleClose}>
                      <Modal.Body>
                        {!win ? (
                          <>
                            <img
                              alt="loss"
                              style={{
                                width: "200px",
                                height: "100px",
                                marginLeft: "30%",
                              }}
                              src={`/winloss/2.png`}
                            ></img>
                            <p
                              style={{
                                marginLeft: "45%",
                              }}
                            >
                              No Reward
                            </p>
                          </>
                        ) : (
                          <>
                            <img
                              alt="win"
                              style={{
                                width: "200px",
                                height: "100px",
                                marginLeft: "30%",
                              }}
                              src={`/winloss/1.png`}
                            ></img>
                            <p
                              style={{
                                marginLeft: "45%",
                              }}
                            >
                              Reward
                            </p>
                            {normalEgg ? (
                              <>
                                <img
                                  alt="normal egg"
                                  style={{
                                    width: "200px",
                                    height: "200px",
                                    marginLeft: "10%",
                                  }}
                                  src={`/eggs/2.png`}
                                ></img>
                                1 Common Egg
                              </>
                            ) : (
                              <>
                                {" "}
                                <img
                                  alt="rare egg"
                                  style={{
                                    width: "200px",
                                    height: "200px",
                                    marginLeft: "10%",
                                  }}
                                  src={`/eggs/1.png`}
                                ></img>
                                1 Rare Egg
                              </>
                            )}
                          </>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={handleClose}>Confirm</Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
                <div>
                  <Button
                    variant="outline-light"
                    style={{ marginLeft: "30px", marginBottom: "20px" }}
                    onClick={() => {
                      setShowSell(true);
                      setSellCard(card.id);
                    }}
                  >
                    Sell this card
                  </Button>

                  <Modal
                    show={showSell}
                    onHide={() => {
                      setShowSell(false);
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Price</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          onChange={handleSubmitSell}
                        />
                      </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowSell(false);
                        }}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={async () => {
                          await marketplaceService.methods
                            ._sellItem(
                              sellCard,
                              (sellPrice * 1e18).toString(),
                              1
                            )
                            .send({ from: userAddress });
                          handleClose();
                        }}
                      >
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>

                <UpgradeCard
                  targetCard={card}
                  listCard={listCard}
                  cardService={cardService}
                  userAddress={userAddress}
                ></UpgradeCard>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
