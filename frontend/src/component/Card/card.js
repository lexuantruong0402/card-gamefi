import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

async function getAllCardOfUser(userAddress, web3Connect) {
  const rs = await web3Connect.methods.getAllCardOfUser(userAddress).call();
  return rs;
}

function CardService({ userAddress, web3Connect }) {
  const [listCard, setListCard] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (isLoading) {
        // getAllCardOfUser().then(() => {
        //   setLoading(false);
        // });
        setListCard(await getAllCardOfUser(userAddress, web3Connect));
        setLoading(false);
      }
    }

    load();
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <>
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? "Loading…" : "Click to load"}
      </Button>
      {JSON.stringify(listCard)}
    </>
  );
}
export default CardService;
