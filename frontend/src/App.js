import "./App.css";
import { useEffect, useState } from "react";
import Web3 from "web3";
import React from "react";
import CardService from "./component/Card/card";
import { Container } from "react-bootstrap";
import { Contract_address, Contract_abi } from "./contracts/CardService.js";

function App() {
  const [account, setAccount] = useState(""); // state variable to set account.
  const [cardService, setCardService] = useState(null);

  const web3Connect = new Web3(Web3.givenProvider || "http://localhost:7545");

  useEffect(() => {
    async function load() {
      const accounts = await web3Connect.eth.requestAccounts();
      const cardService = new web3Connect.eth.Contract(
        // @ts-ignore
        Contract_abi,
        Contract_address
      );
      setAccount(accounts[0]);
      setCardService(cardService);
    }

    load();
  }, []);

  return (
    <Container>
      <CardService
        userAddress={account}
        web3Connect={cardService}
      ></CardService>
    </Container>
  );
}

export default App;
