// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow {
    address public nftAddress;
    address public seller;

    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => bool) public isSold;

    constructor(address _nftAddress, address _seller) {
        nftAddress = _nftAddress;
        seller = _seller;
    }

    // List property
    function list(
        uint256 _nftID,
        uint256 _price
    ) public {
        purchasePrice[_nftID] = _price;

        // Transfer NFT to contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
    }

    // BUY FUNCTION (MAIN FIX)
    function buy(uint256 _nftID) public payable {
        uint256 price = purchasePrice[_nftID];

        require(price > 0, "Not listed");
        require(msg.value >= price, "Not enough ETH");
        require(!isSold[_nftID], "Already sold");

        isSold[_nftID] = true;

        // Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(address(this), msg.sender, _nftID);

        // Transfer ETH to seller
        payable(seller).transfer(msg.value);
    }
}