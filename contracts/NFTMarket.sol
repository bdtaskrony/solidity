// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarket {
    enum Status {
        Active,
        Sold,
        Cancelled
    }

    struct Listing {
        uint256 listingId;
        Status status;
        address seller;
        address contractAddress;
        uint256 tokenId;
        uint256 price;
    }

    event Listed(
        uint256 listingId,
        address seller,
        address contractAddress,
        uint256 tokenId,
        uint256 price
    );

    event Sale(
        uint256 listingId,
        address buyer,
        address contractAddress,
        uint256 tokenId,
        uint256 price
    );

    uint256 private listingId = 0;
    mapping(uint256 => Listing) private _listings;

    function listNft(
        address contractAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        IERC721(contractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        Listing memory listing = Listing(
            listingId,
            Status.Active,
            msg.sender,
            contractAddress,
            tokenId,
            price
        );
        _listings[listingId] = listing;
        emit Listed(listingId, msg.sender, contractAddress, tokenId, price);
        listingId++;
    }

    function getListing(uint256 _listingId)
        public
        view
        returns (Listing memory)
    {
        return _listings[_listingId];
    }

    function getAllListing() public view returns (Listing[] memory) {
        Listing[] memory getAll = new Listing[](listingId);
        for (uint256 i = 0; i < listingId; i++) {
            getAll[i] = _listings[i];
        }

        return getAll;
    }

    function buyNFT(uint256 _listingId) external payable {
        Listing storage listing = _listings[_listingId];
        require(msg.sender != listing.seller, "seller and buyer can not same");
        require(
            listing.status == Status.Active,
            "Listing status is not active"
        );
        require(msg.value >= listing.price, "Insufficient Price");
        listing.status = Status.Sold;
        IERC721(listing.contractAddress).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        payable(listing.seller).transfer(listing.price);
        emit Sale(
            _listingId,
            msg.sender,
            listing.contractAddress,
            listing.tokenId,
            listing.price
        );
    }
}
