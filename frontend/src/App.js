import "./App.css";
import { useEffect, useState } from "react";
import Web3 from "web3";
import React from "react";
import { Container } from "react-bootstrap";
import { Contract_address_cardService, Contract_abi_cardService } from "./contracts/CardService.js";
import ShowTab from "./component/Tab/tab";
import CardService from "./component/Card/card";

function App() {
  const web3Connect = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [tab, setTab] = useState("card");
  const [account, setAccount] = useState("");
  const [cardService, setCardService] = useState(new web3Connect.eth.Contract(
    // @ts-ignore
    Contract_abi_cardService,
    Contract_address_cardService
  ));

  useEffect(() => {
    async function load() {
      const accounts = await web3Connect.eth.requestAccounts();
      setAccount(accounts[0]);
    }

    load();
  }, [web3Connect.eth]);

  return (
    <Container>
      <ShowTab setTab={setTab}></ShowTab>
      {(tab === "card" && account !== "") ? <CardService userAddress={account} web3Connect={cardService} /> : ""}
    </Container>
  );
}

export default App;
