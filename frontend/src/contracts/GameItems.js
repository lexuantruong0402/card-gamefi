const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('../../../truffle/build/contracts/GameItems.json', 'utf8'));

export const Contract_address = '0xfAd567EBdCb36f49F3a509FEDF9e72E3ad75ca59';
export const Contract_abi = contract.abi;
