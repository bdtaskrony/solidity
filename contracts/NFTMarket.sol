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

    uint256 private listingId = 0;
    mapping(uint256 => Listing) private _listings;

    function listNft(
        address contractAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        console.log("address(this)", address(this));
        IERC721(contractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        Listing memory listing = Listing(
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
}
