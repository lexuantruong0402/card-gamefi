import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import React from 'react';
import CardService from './component/Card/card';
import { Container } from 'react-bootstrap';

function App() {
  const [account, setAccount] = useState(""); // state variable to set account.
  const web3Connect = new Web3(Web3.givenProvider || 'http://localhost:7545');

  useEffect(() => {
    async function load() {
      const accounts = await web3Connect.eth.requestAccounts();
      setAccount(accounts[0]);
    }
    
    load();
   }, []);
   
  return (
    <Container>
      <CardService userAddress={account} web3Connect={web3Connect} ></CardService>
    </Container>
  );
}

export default App;
