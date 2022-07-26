const CardService = artifacts.require("CardService.sol");

module.exports = function (deployer) {
  deployer.deploy(CardService);
};
