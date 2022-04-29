// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract NFTMarketplace is  BaseRelayRecipient, ERC721URIStorage,  IERC2981, Pausable 
    {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsListed;

    uint256 listingPrice = 0 ether;
    address payable owner;
    address private _recipient;
    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      address payable creator;
      uint256 price;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      address creator,
      uint256 price,
      bool sold
    );

    constructor( address forwarder_) ERC721("DBeats NFT", "DBEAT NFT") {
      owner = payable(_msgSender());
      _recipient = owner; 
     
    _setTrustedForwarder(forwarder_);
  }
    function _msgSender() internal view override(Context, BaseRelayRecipient)
      returns (address sender) {
      sender = BaseRelayRecipient._msgSender();
    }

    function _msgData() internal view override(Context, BaseRelayRecipient)
      returns (bytes memory) {
      return BaseRelayRecipient._msgData();
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) external   {
      require(owner == _msgSender(), "Only marketplace owner can update listing price.");
       listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
      function getListingPrice() public view returns (uint256) {
        return listingPrice;
      }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI ) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(_msgSender(), newTokenId);
      _setTokenURI(newTokenId, tokenURI);

      idToMarketItem[newTokenId].tokenId = newTokenId; 
      idToMarketItem[newTokenId].creator = payable(_msgSender()); 
      idToMarketItem[newTokenId].owner = payable(_msgSender()); 

      return newTokenId;
    }
 
     

    function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) public payable {
      require(price > 0, "Price must be at least 1 wei");
       idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(_msgSender()),
        payable(address(this)),
        idToMarketItem[tokenId].creator,
        price,
        false
      );

      _transfer(_msgSender(), address(this), tokenId);
      _itemsListed.increment();

      emit MarketItemCreated(
        tokenId,
        _msgSender(),
        address(this),
        idToMarketItem[tokenId].creator,
        price,
        false
      );
    }


    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == _msgSender(), "Only item owner can perform this operation");
      
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(_msgSender());
      idToMarketItem[tokenId].owner = payable(address(this));
      _transfer(_msgSender(), address(this), tokenId);
      _itemsSold.decrement();
      _itemsListed.increment();

      emit MarketItemCreated(
        tokenId,
        _msgSender(),
        address(this),
        idToMarketItem[tokenId].creator,
        price,
        false
      );
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;

      require(msg.value == price + listingPrice, "Please submit the asking price + Market Fees in order to complete the purchase");
      
      idToMarketItem[tokenId].owner = payable(_msgSender());
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      idToMarketItem[tokenId].price = 0;
      _transfer(address(this), _msgSender(), tokenId);
      _itemsSold.increment();
      _itemsListed.decrement();
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(price);
    }


    /* Function to Transfer contract ownership - Owner of the contract receives fees from Sales */
    function transferOwnershipTo(address newRecipient) external returns (address newOwner  ) { 
      require(owner == _msgSender(),"Not the owner of Contract");
      owner = payable(newRecipient);
      return newRecipient;
    }

    /* Fetch Contract Owner details */
      function  fetchContractOwner()  external  view   returns  (address payable contractOwner)  {
        return owner;
    }

    /*fetch Total minted supply of Tokens */
   function totalSupply()   public view returns  (uint256 _totalSupply) {
     _totalSupply = _tokenIds.current();
        return _totalSupply;
    }

     
    function cancelListing(
      uint256 tokenId
      ) public payable { 
      require(_msgSender() == idToMarketItem[tokenId].owner, "Only Token owner can cancel listing.");
      idToMarketItem[tokenId].owner = payable(_msgSender());
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].seller = payable(address(0));
      idToMarketItem[tokenId].price = 0;
      _transfer(address(this), _msgSender(), tokenId);
      _itemsListed.decrement();
    }



    /* Fetch Contract Owner details */
    function  fetchTotalMintedTokens()  external  view   returns  (MarketItem[] memory)  {

      uint itemCount =_tokenIds.current(); 
      uint currentIndex = 0; 
      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < itemCount; i++) { 
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1; 
      }
      return items; 
    }
        
    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount =_itemsListed.current();
      uint unsoldItemCount = _itemsListed.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == _msgSender()) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == _msgSender()) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == _msgSender()) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == _msgSender()) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
 

    /** @dev EIP2981 royalties implementation. */

    // Maintain flexibility to modify royalties recipient (could also add basis points).
    function _setRoyalties(address newRecipient) internal {
        require(
            newRecipient != address(0),
            "Royalties: new recipient is the zero address"
        );
        _recipient = newRecipient;
    }

    function setRoyalties(address newRecipient, uint256 tokenId) external  {
      
      require(idToMarketItem[tokenId].creator == _msgSender(),"Not the owner of Token");
      idToMarketItem[tokenId].creator = payable(newRecipient);
      _setRoyalties(newRecipient);
    }

    // EIP2981 standard royalties return.
    function royaltyInfo(uint256 tokenId, uint256 _salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (idToMarketItem[tokenId].creator, (idToMarketItem[tokenId].price * 1000) / 10000);
    }

    // EIP2981 standard Interface return. Adds to ERC721 and ERC165 Interface returns.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }


     function  versionRecipient()  external  view  override  returns  (string memory)  {
        return "1";
    }
}