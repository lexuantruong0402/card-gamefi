import "./App.css";
import { useEffect, useState } from "react";
import Web3 from "web3";
import React from "react";
import { Container } from "react-bootstrap";
import ShowTab from "./component/Tab/tab";
import CardService from "./component/Card/card";
import ShowEgg from "./component/Egg/egg";
import ShowMarketPlace from "./component/Marketplace/marketplace";
import Init from "./Init";

function App() {
  const web3Connect = new Web3(Web3.givenProvider || "http://localhost:7545");
  const [tab, setTab] = useState("card");
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function load() {
      const accounts = await web3Connect.eth.requestAccounts();
      setAccount(accounts[0]);
    }

    load();
  }, [web3Connect.eth]);

  return (
    <Container>
      <Init userAddress={account} web3Connect={web3Connect}></Init>
      <ShowTab setTab={setTab}></ShowTab>
      {tab === "card" && account !== "" ? (
        <CardService userAddress={account} web3Connect={web3Connect} />
      ) : (
        ""
      )}
      {tab === "egg" && account !== "" ? (
        <ShowEgg userAddress={account} web3Connect={web3Connect} />
      ) : (
        ""
      )}
      {tab === "marketplace" && account !== "" ? (
        <ShowMarketPlace userAddress={account} web3Connect={web3Connect} />
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
