import { expect } from "chai";
import { ethers } from "hardhat";
import variables from "../variables";

describe("NFT", async () => {
  // const ownerBal = await ethers.provider.getBalance(owner.address);

  const nftContract = variables.nft_contract_address;
  const marketContract = variables.nft_market_contract_address;
  it("Should deploy Nft Contract", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const nftName = "testName";
    const nftSymbol = "testSymbol";
    const Nft = await ethers.getContractFactory("Nft");
    const nftDeploy = await Nft.deploy(nftName, nftSymbol);
    const deployed = await nftDeploy.deployed();

    expect(await deployed.name()).to.equal(nftName);
    expect(await deployed.symbol()).to.equal(nftSymbol);
    expect(await deployed.signer.getAddress()).to.equal(owner.address);
  });

  it("should mint nft by owner of the contract", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const tokenUri = "https://some-token.uri/";
    const myContract = await ethers.getContractAt("Nft", nftContract);
    const transaction = await myContract.createNft(tokenUri);
    const receipt = await transaction.wait();
    const tokenId = await receipt.events[0].args.tokenId;
    const contractOwnerBalances = await myContract.balanceOf(owner.address);

    expect(contractOwnerBalances).to.equal(1);
    expect(await myContract.ownerOf(tokenId)).to.equal(owner.address);
  });

  it("should mint another new nft by owner of the contract", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const tokenUri = "https://some-token.uri/new";
    const myContract = await ethers.getContractAt("Nft", nftContract);
    const transaction = await myContract.createNft(tokenUri);
    const receipt = await transaction.wait();
    const tokenId = await receipt.events[0].args.tokenId;

    const contractOwnerBalances = await myContract.balanceOf(owner.address);

    expect(contractOwnerBalances).to.equal(2);
    expect(await myContract.ownerOf(tokenId)).to.equal(owner.address);
  });

  it("should find the token URI", async () => {
    const tokenUri = "https://some-token.uri/";
    const tokenId = 0;
    const myContract = await ethers.getContractAt("Nft", nftContract);
    expect(await myContract.tokenURI(tokenId)).to.equal(tokenUri);
  });

  it("should not mint nft by other than owner of the contract", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const tokenUri = "https://some-token.uri/";
    const myContract = await ethers.getContractAt("Nft", nftContract);

    await expect(
      myContract.connect(otherAccount).createNft(tokenUri)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should approve market for transfer", async () => {
    let tokenId = 0;
    const myContract = await ethers.getContractAt("Nft", nftContract);
    //aprove for token id 0
    await myContract.approve(marketContract, tokenId);
    const getApprove = await myContract.getApproved(tokenId);
    expect(getApprove).to.equal(marketContract);
    //aprove for token id 1
    tokenId++;
    await myContract.approve(marketContract, tokenId);
    const getApproveNewToken = await myContract.getApproved(tokenId);
    expect(getApproveNewToken).to.equal(marketContract);
  });
});
