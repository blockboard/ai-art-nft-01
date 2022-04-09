//SPDX-License-Identifier: MIT

pragma solidity 0.7.5;
pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Kemosabe is ERC721, Ownable {  
  address payable public immutable treasury;
  
  uint256 public immutable totalAssetsSupply;

  uint256 public mintFees = 0.2 ether;

  mapping (bytes32 => bool) public minted;

  // This marks an item in IPFS as "forsale"
  mapping (uint256 => bool) public tokenIdMinted;

  // This lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (bytes32 => uint256) public uriToTokenId;

  // This is a packed array of booleans.
  mapping(uint256 => uint256) private _claimedBitMap;

  event Minted(address indexed user_, uint256 indexed tokenId_, string indexed tokenURI_);

  constructor() ERC721("Kemosabe", "KS") {
    _setBaseURI("https://ipfs.io/ipfs/");

    treasury = _msgSender();
    totalAssetsSupply = 100;
  }

  function mintItem(address user_, uint256 tokenId_, string memory tokenURI_) public payable returns (uint256) {
    bytes32 uriHash = keccak256(abi.encodePacked(tokenURI_));

    require(1 <= tokenId_ && tokenId_ <= totalAssetsSupply, "Kemosabe: Invalid tokenId_");    
    require(tokenIdMinted[tokenId_] == false, "Kemosabe: tokenId_ has been minted already");
    require(minted[uriHash] == false, "Kemosabe: tokenURI_ is minted already.");
    require(msg.value >= mintFees, "Kemosabe: Not sufficient amount of ETH.");
    
    treasury.transfer(msg.value);

    uint256 id = tokenId_;
    
    _mint(user_, id);
    _setTokenURI(id, tokenURI_);

    uriToTokenId[uriHash] = id;
    tokenIdMinted[id] = true;
    minted[uriHash] = true;

    emit Minted(user_, tokenId_, tokenURI_);

    return id;
  }
}