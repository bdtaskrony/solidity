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
    const price = 2;
    const getMarketContract = await ethers.getContractAt(
      "NFTMarket",
      marketContract
    );

    const transaction = await getMarketContract
      .connect(ownerofNft)
      .listNft(nftContract, tokenId, price);
    const receipt = await transaction.wait();
    const getListing = await getMarketContract.getListing(0);
    console.log("getListing", getListing);

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
