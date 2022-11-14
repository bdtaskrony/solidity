import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT Market", function () {
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
    const [nftOwner, marketOwner] = await ethers.getSigners();

    const market = await ethers.getContractFactory("NFTMarket");
    const marketDeploy = await market.connect(marketOwner).deploy();
    const deployed = await marketDeploy.connect(marketOwner).deployed();

    expect(await deployed.signer.getAddress()).to.equal(marketOwner.address);
  });

  it("should listed nft in the marketplace", async () => {
    const [ownerofNft, otherAccount] = await ethers.getSigners();
    const marketContract = "0x71C95911E9a5D330f4D621842EC243EE1343292e";
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenId = 0;
    const price = 2.5;
    const listingId = 0;
    const getMarketContract = await ethers.getContractAt(
      "NFTMarket",
      marketContract
    );
    //listing token id 0
    let ethersToWei = ethers.utils.parseUnits(price.toString(), "ether");
    console.log("ethersToWei", ethersToWei.toString());

    const transaction = await getMarketContract
      .connect(ownerofNft)
      .listNft(nftContract, tokenId, ethersToWei);
    const receipt = await transaction.wait();
    //listing token id 1
    const newListing = await getMarketContract
      .connect(ownerofNft)
      .listNft(nftContract, 1, ethersToWei);
    await newListing.wait();
    // const getListing = await getMarketContract.getListing(listingId);
    // console.log("getListing", getListing);
    const getListingsArray = await getMarketContract.getAllListing();
    console.log("getListingsArray", getListingsArray);

    //console.log("event", event(receipt.events).args);

    //console.log("receipt", await receipt.events);

    // const tokenId = await receipt.events[0].args.tokenId;
    // const contractOwnerBalances = await myContract.balanceOf(owner.address);

    // expect(contractOwnerBalances).to.equal(1);
    // expect(await myContract.ownerOf(tokenId)).to.equal(owner.address);
  });

  // it("should find the token URI", async () => {
  //   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  //   const tokenUri = "https://some-token.uri/";
  //   const tokenId = 0;
  //   const myContract = await ethers.getContractAt("Nft", contractAddress);
  //   expect(await myContract.tokenURI(tokenId)).to.equal(tokenUri);
  // });

  // it("should not mint nft by other than owner of the contract", async () => {
  //   const [owner,otherAccount] = await ethers.getSigners();
  //   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  //   const tokenUri = "https://some-token.uri/";
  //   const myContract = await ethers.getContractAt("Nft", contractAddress);

  //   await expect(myContract.connect(otherAccount).createNft(tokenUri)).to.be.revertedWith("Ownable: caller is not the owner");
  // });
});
