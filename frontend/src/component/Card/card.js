import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Contract_address, Contract_abi } from '../../contracts/CardService.js';


function CardService({userAddress, web3Connect }) {

  const [cardService, setCardService] = useState();
  const [listCard, setListCard] = useState([]); 
  
  useEffect(() => {
    async function load() {
      const cardService = new web3Connect.eth.Contract(Contract_abi, Contract_address);
      const counter = await cardService.methods.getAllCardOfUser(userAddress).call();
      setListCard(counter);
    }
    
    load();
   }, []);
 
  return (
    <>
      <p>{userAddress}</p>
      <p>{listCard}</p>
    </>
  );
}
export default CardService;
  