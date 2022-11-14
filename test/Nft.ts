import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT", function () {
  // const ownerBal = await ethers.provider.getBalance(owner.address);
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
    const [owner] = await ethers.getSigners();
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
    const [owner] = await ethers.getSigners();
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenUri = "https://some-token.uri/";
    const tokenId = 0;
    const myContract = await ethers.getContractAt("Nft", nftContract);
    expect(await myContract.tokenURI(tokenId)).to.equal(tokenUri);
  });

  it("should not mint nft by other than owner of the contract", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenUri = "https://some-token.uri/";
    const myContract = await ethers.getContractAt("Nft", nftContract);

    await expect(
      myContract.connect(otherAccount).createNft(tokenUri)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should approve market for transfer", async () => {
    const nftContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const marketContract = "0x71C95911E9a5D330f4D621842EC243EE1343292e";
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

  //   describe("Deployment", function () {
  //     it("Should set the right unlockTime", async function () {
  //       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

  //       expect(await lock.unlockTime()).to.equal(unlockTime);
  //     });

  //     it("Should set the right owner", async function () {
  //       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

  //       expect(await lock.owner()).to.equal(owner.address);
  //     });

  //     it("Should receive and store the funds to lock", async function () {
  //       const { lock, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       expect(await ethers.provider.getBalance(lock.address)).to.equal(
  //         lockedAmount
  //       );
  //     });

  //     it("Should fail if the unlockTime is not in the future", async function () {
  //       // We don't use the fixture here because we want a different deployment
  //       const latestTime = await time.latest();
  //       const Lock = await ethers.getContractFactory("Lock");
  //       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //         "Unlock time should be in the future"
  //       );
  //     });
  //   });

  //   describe("Withdrawals", function () {
  //     describe("Validations", function () {
  //       it("Should revert with the right error if called too soon", async function () {
  //         const { lock } = await loadFixture(deployOneYearLockFixture);

  //         await expect(lock.withdraw()).to.be.revertedWith(
  //           "You can't withdraw yet"
  //         );
  //       });

  //       it("Should revert with the right error if called from another account", async function () {
  //         const { lock, unlockTime, otherAccount } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         // We can increase the time in Hardhat Network
  //         await time.increaseTo(unlockTime);

  //         // We use lock.connect() to send a transaction from another account
  //         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //           "You aren't the owner"
  //         );
  //       });

  //       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //         const { lock, unlockTime } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         // Transactions are sent using the first signer by default
  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw()).not.to.be.reverted;
  //       });
  //     });

  //     describe("Events", function () {
  //       it("Should emit an event on withdrawals", async function () {
  //         const { lock, unlockTime, lockedAmount } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw())
  //           .to.emit(lock, "Withdrawal")
  //           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //       });
  //     });

  //     describe("Transfers", function () {
  //       it("Should transfer the funds to the owner", async function () {
  //         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //           deployOneYearLockFixture
  //         );

  //         await time.increaseTo(unlockTime);

  //         await expect(lock.withdraw()).to.changeEtherBalances(
  //           [owner, lock],
  //           [lockedAmount, -lockedAmount]
  //         );
  //       });
  //     });
  //   });
});
