const MarketplaceContract = artifacts.require("NftMarket");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceContract);
};
