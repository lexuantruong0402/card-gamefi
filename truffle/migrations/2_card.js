const CardContract = artifacts.require("EggService");

module.exports = function (deployer) {
  deployer.deploy(CardContract);
};
