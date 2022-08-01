import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  Contract_abi_gameItems,
  Contract_address_gameItems,
} from "../../contracts/GameItems";
import {
  Contract_abi_eggService,
  Contract_address_eggService,
} from "../../contracts/EggService";
import {
  Contract_abi_marketplace,
  Contract_address_marketplace,
} from "../../contracts/NftMarketplace";
import "./egg.css";

export const normalEggId = 2 ** 10 - 2;
export const rareEggId = 2 ** 10 - 3;

async function openEgg(eggService, userAddress, eggType) {
  await eggService.methods._openEgg(eggType).send({ from: userAddress });
  window.location.reload();
}

function SellEgg({ userAddress, marketplaceService, eggType }) {
  const [sellPrice, setSellPrice] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

  const handleSubmitSellPrice = (e) => {
    setSellPrice(Number(e.target.value));
  };

  const handleSubmitSellAmount = (e) => {
    setSellAmount(Number(e.target.value));
  };
  const [show, setShow] = useState(false);
  return (
    <div style={{ textAlign: "center", marginTop: "2px" }}>
      <Button variant="warning" onClick={() => setShow(true)}>
        Sell
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sell Common Egg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Price</InputGroup.Text>
            <Form.Control
              type="number"
              min="1"
              step="1"
              onChange={handleSubmitSellPrice}
            />
            <InputGroup.Text>Amount</InputGroup.Text>
            <Form.Control
              type="number"
              min="1"
              step="1"
              onChange={handleSubmitSellAmount}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await marketplaceService.methods
                ._sellItem(eggType, sellPrice, sellAmount)
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
  );
}

function ShowEgg({ userAddress, web3Connect }) {
  const [amountEgg, setAmountEgg] = useState([]);

  const nftService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_gameItems,
    Contract_address_gameItems
  );
  const eggService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_eggService,
    Contract_address_eggService
  );
  const marketplaceService = new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_marketplace,
    Contract_address_marketplace
  );

  useEffect(() => {
    try {
      async function loadEgg() {
        const eggs = await nftService.methods
          .balanceOfBatch([userAddress, userAddress], [normalEggId, rareEggId])
          .call();

        setAmountEgg(eggs);
      }
      loadEgg();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Container style={{ marginTop: "50px" }}>
      <Row>
        <Col className="d-flex justify-content-center">
          <img
            alt="common egg amount"
            style={{ height: "150px", width: "150px" }}
            src={`/eggs/2.png`}
          ></img>
          <div>
            <p style={{ fontSize: "20px", color: "white", marginTop: "30px" }}>
              Commont Egg: {amountEgg[0]}
            </p>
            <Button
              variant="info"
              onClick={() => openEgg(eggService, userAddress, normalEggId)}
            >
              Open Common Egg
            </Button>
            <SellEgg
              userAddress={userAddress}
              marketplaceService={marketplaceService}
              eggType={normalEggId}
            ></SellEgg>
          </div>
        </Col>

        <Col className="d-flex justify-content-center">
          <img
            alt="rare egg amount"
            style={{ height: "150px", width: "150px" }}
            src={`/eggs/1.png`}
          ></img>
          <div>
            <p style={{ fontSize: "20px", color: "white", marginTop: "30px" }}>
              Rare Egg: {amountEgg[1]}
            </p>
            <Button
              variant="info"
              onClick={() => openEgg(eggService, userAddress, rareEggId)}
            >
              Open Rare Egg
            </Button>
            <SellEgg
              userAddress={userAddress}
              marketplaceService={marketplaceService}
              eggType={rareEggId}
            ></SellEgg>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default ShowEgg;
