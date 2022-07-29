import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import {
  Contract_abi_gameItems,
  Contract_address_gameItems,
} from "../../contracts/GameItems";
import {
  Contract_abi_eggService,
  Contract_address_eggService,
} from "../../contracts/EggService";
import "./egg.css";

const normalEggId = 2 ** 10 - 2;
const rareEggId = 2 ** 10 - 3;

async function openEgg(eggService, userAddress, eggType) {
  const response = await eggService.methods
    ._openEgg(eggType)
    .send({ from: userAddress });
  window.location.reload();
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
  }, [userAddress, nftService.methods]);

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
            <Button variant="info">Open Rare Egg</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default ShowEgg;
