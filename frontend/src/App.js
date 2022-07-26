import "./App.css";
import { useEffect, useState } from "react";
import Web3 from "web3";
import React from "react";
import { Container } from "react-bootstrap";
import ShowTab from "./component/Tab/tab";
import CardService from "./component/Card/card";

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
      <ShowTab setTab={setTab}></ShowTab>
      {tab === "card" && account !== "" ? (
        <CardService userAddress={account} web3Connect={web3Connect} />
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
