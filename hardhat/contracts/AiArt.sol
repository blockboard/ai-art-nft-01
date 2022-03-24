//SPDX-License-Identifier: MIT

pragma solidity 0.7.5;
pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AiArt is ERC721, Ownable {
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIds;

  address payable public immutable treasury;
  
  uint256 public immutable totalAssetsSupply;

  // TODO: check the mitning fees
  uint256 public mintFees = 0.01 ether;

  mapping (bytes32 => bool) public minted;

  //this marks an item in IPFS as "forsale"
  mapping (uint256 => bool) public tokenIdMinted;

  //this lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (bytes32 => uint256) public uriToTokenId;

  // This is a packed array of booleans.
  mapping(uint256 => uint256) private _claimedBitMap;

  event Claimed(uint256 index_, string tokenURI_);

  constructor(address payable treasury_) ERC721("AiArt", "AA") {
    _setBaseURI("https://ipfs.io/ipfs/");

    treasury = treasury_;
    // TODO: Check the totalSupply
    totalAssetsSupply = 10000;
  }

  function mintItem(address user_, string memory tokenURI_, uint256 tokenId_) public payable returns (uint256) {
    // TODO: Check tokenID boundries
    require(tokenIdMinted[tokenId_] == false, 'AiArt: TokenID has been minted already');
    require(0 <= tokenId_ && tokenId_ < totalAssetsSupply, 'AiArt: TokenID is exceeding 10000');

    require(msg.value >= mintFees, "AiArt: Not sufficient amount of ETH.");
    treasury.transfer(msg.value);

    bytes32 uriHash = keccak256(abi.encodePacked(tokenURI_));

    // Check if uriHash is minted already.
    require(minted[uriHash] == false, "MachineMasks: tokenURI_ is minted already.");

    //minted[uriHash] = true;

    uint256 id = tokenId_;
    
    _mint(user_, id);
    _setTokenURI(id, tokenURI_);

    // TODO: Testing tokenID starting from zero
    _tokenIds.increment();

    uriToTokenId[uriHash] = id;
    tokenIdMinted[id] = true;
    minted[uriHash] = true;

    return id;
  }
}