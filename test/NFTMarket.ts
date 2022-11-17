import { expect } from "chai";
import { ethers } from "hardhat";
import variables from "../variables";

describe("NFT Market", async () => {
  const nftContract = variables.nft_contract_address;
  const marketContract = variables.nft_market_contract_address;
  // const ownerBal = await ethers.provider.getBalance(owner.address);
  const event = (emiterArray = []) => {
    for (let i = 0; i < emiterArray.length; i++) {
      let test = Object.keys(emiterArray[i]).find((item) => item === "args");
      if (test === "args") {
        return emiterArray[i];
      }
    }
  };
  it("Should deploy Nft Market Contract", async function () {
    const [ownerofNft, marketOwner] = await ethers.getSigners();
    const market = await ethers.getContractFactory("NFTMarket");
    const marketDeploy = await market.connect(marketOwner).deploy();
    const deployed = await marketDeploy.connect(marketOwner).deployed();

    expect(await deployed.signer.getAddress()).to.equal(marketOwner.address);
  });

  it("should listed nft in the marketplace", async () => {
    const [ownerofNft, marketOwner] = await ethers.getSigners();
    const tokenId = 0;
    const price = 0.5;
    const listingId = 0;
    const getMarketContract = await ethers.getContractAt(
      "NFTMarket",
      marketContract
    );
    //listing token id 0
    let ethersToWei = ethers.utils.parseUnits(price.toString(), "ether");

    const transaction = await getMarketContract
      .connect(ownerofNft)
      .listNft(nftContract, tokenId, ethersToWei);
    const receipt = await transaction.wait();
    //listing token id 1
    const newListing = await getMarketContract
      .connect(ownerofNft)
      .listNft(nftContract, 1, ethersToWei);
    await newListing.wait();
    const getListing = await getMarketContract.getListing(listingId);
    expect(getListing.listingId).to.equal(listingId);
    //console.log("event", event(receipt.events).args);

    //console.log("receipt", await receipt.events);
  });

  it("should buy nft from listed", async () => {
    const [ownerofNft, marketOwner, buyerAddress] = await ethers.getSigners();
    const listingId = 0;
    const tokenId = 0;

    const getMarketContract = await ethers.getContractAt(
      "NFTMarket",
      marketContract
    );
    //lising id 0 buy
    let ethersToWei = ethers.utils.parseUnits("0.5", "ether");
    const transaction = await getMarketContract
      .connect(buyerAddress)
      .buyNFT(listingId, { value: ethersToWei });
    const receipt = await transaction.wait();
    //console.log("receipt", receipt);
    const getNftContract = await ethers.getContractAt("Nft", nftContract);
    expect(await getNftContract.ownerOf(tokenId)).to.equal(
      buyerAddress.address
    );
    //console.log("event", event(receipt.events).args);

    //console.log("receipt", await receipt.events);
  });
  it("should cancelled nft from listing", async () => {
    const [ownerofNft, marketOwner, buyerAddress] = await ethers.getSigners();
    const listingId = 1;
    const tokenId = 1;

    const getMarketContract = await ethers.getContractAt(
      "NFTMarket",
      marketContract
    );
    //lising id 0 buy
    let ethersToWei = ethers.utils.parseUnits("0.5", "ether");
    const transaction = await getMarketContract
      .connect(ownerofNft)
      .cancelledListing(listingId);
    const receipt = await transaction.wait();
    //console.log("receipt", receipt);
    const getList = await getMarketContract.getListing(listingId);
    expect(getList.status).to.equal(2);
    const getNftContract = await ethers.getContractAt("Nft", nftContract);
    expect(await getNftContract.ownerOf(tokenId)).to.equal(ownerofNft.address);

    //console.log("event", event(receipt.events).args);

    //console.log("receipt", await receipt.events);
  });
});
