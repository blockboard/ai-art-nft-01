import IpfsHttpClient from 'ipfs-http-client';
import fs from 'fs';
import Web3 from 'web3';
import { utils } from 'ethers';
import { ethers } from 'hardhat';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { promisify } from 'util';
import { exec } from 'child_process';

import deploy from '../utils/deploy';
import { MachineMask } from '../typechain/MachineMask';
import { PayableOverrides } from '@ethersproject/contracts';
import { any, type } from 'ramda';
//import { ClientOptions} from 'ipfs-http-client/src/lib/core';

// const options : ClientOptions = {
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// };

// const ipfs = new (IpfsHttpClient(options) as any);

const merkleTree = require('../output.json');

const { merkleRoot, claims } = merkleTree;

chai.use(solidity);

const { expect } = chai;

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

describe("MachineMask", () => {
    let MachineMask : MachineMask;
    let owner : SignerWithAddress;
    let dev_1 : SignerWithAddress;
    let dev_2 : SignerWithAddress;
    let user : SignerWithAddress;

    beforeEach(async () => {
      const signers = await ethers.getSigners();
      owner = signers[0];
      dev_1 = signers[1];
      dev_2 = signers[2];
      user = signers[3];

      console.log("\n\n 📡 Deploying...\n");
      delay(10000)
      console.log(" 🧑 Treasury:", dev_1.address);
      console.log(" 💲 Treasury Balance (After):", await dev_1.getBalance());

      // read in all the assets to get their IPFS hash...
      let uploadedAssets = JSON.parse(fs.readFileSync("./uploaded.json").toString())
      let uploadedAssetsArray = Object.values(uploadedAssets)

      let bytes32Array = [];

      for(let i = 0; i < uploadedAssetsArray.length; i++) {
        let hash = uploadedAssetsArray[i];

        let bytes32 = utils.id(String(hash))
        bytes32Array.push(bytes32)

        // console.log(" 📇 Deploying Item Asset:", i + 1);
        // console.log(" 🏷 IPFS:", hash);
        // console.log(" #️⃣ hashed:", bytes32);
        // console.log(" \n")
      }

      console.log("root is", merkleRoot);

      fs.writeFileSync(`./tree.json`, JSON.stringify(merkleTree));

      //await deploy("MachineMaskContract",[ owner.address, merkleRoot ]);

      const machineMaskFacktory = await ethers.getContractFactory(
        "MachineMask",
        owner
      );

      console.log(" \n \n")
      delay(10000);
      console.log(" 🧑 Treasury:", dev_1.address);
      MachineMask = (await machineMaskFacktory.deploy(dev_1.address, merkleRoot)) as MachineMask;
      await MachineMask.deployed();

      console.log(" \n");
      console.log(" ✅ Contract deployed:", MachineMask.address);
      console.log(" \n");
      delay(10000)
    });

    describe("YourCollectible", () => {
      it("⚖️  Should be have an amount of totalSupply() & totalAssetSupply()", async () => {
        // Check the number of totalAssets supplied
        const totalAssetSupplyExpected = 10000;
        const totalAssetSupplyActual : Number = (await MachineMask.totalAssetsSupply()).toNumber();
        expect(totalAssetSupplyExpected).to.equal(totalAssetSupplyActual);

        // Check the totalSupply before minting
        const totalSupplyExpected = 0;
        const totalSupplyActual : Number = (await MachineMask.totalSupply()).toNumber();
        expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      });

      it("⚖️  Should revert when the fees are lower than mintFees()", async () => {
        const lowMintFees = "90000000000000000" // 0.09 ETH

        // First valid hash
        const hash = "QmNLhx4HPkkabauPCVATMcuy1yem2v5bdUUzncrSwLxS9e";
        const hashObject = claims[hash];
        const hashIndex = hashObject["index"];
        const hashProof = hashObject["proof"];

        await expect(MachineMask.claim(hashIndex, hash, hashProof, {
          value: lowMintFees
        })).to.be.revertedWith(
          "MachineMasks: Not sufficient amount of ETH."
        );
      });

      it("⚖️  Should revert when the hash is not for the 10,000 hashes", async () => {
        const mintFees = await MachineMask.mintFees();; 

        // First valid hash
        const wrongHash = "QmNLhx4HPkkabauPCVATMcuy1yem2v5bdUUzncrSwLx2u1hbnd";

        const rightHash = "QmNLhx4HPkkabauPCVATMcuy1yem2v5bdUUzncrSwLxS9e";
        const hashObject = claims[rightHash];
        const hashIndex = hashObject["index"];
        const hashProof = hashObject["proof"];

        await expect(MachineMask.claim(hashIndex, wrongHash, hashProof, {
          value: mintFees
        })).to.be.revertedWith(
          "MachineMasks: Invalid proof."
        );
      });

      it("⚖️  Should revert when the hash is claimed before already", async () => {
        const mintFees = await MachineMask.mintFees();; 

        // First valid hash
        const hash = "QmNLhx4HPkkabauPCVATMcuy1yem2v5bdUUzncrSwLxS9e";
        const hashObject = claims[hash];
        const hashIndex = hashObject["index"];
        const hashProof = hashObject["proof"];

        await MachineMask.claim(hashIndex, hash, hashProof, {
          value: mintFees
        });

        await expect(MachineMask.claim(hashIndex, hash, hashProof, {
          value: mintFees
        })).to.be.revertedWith(
          "MachineMasks: Drop already claimed."
        );
      });

      it("⚖️  Should mint all 10,000 tokens with expected fees", async () => {
        // Check the totalSupply before minting
        const totalSupplyBeforeExpected = 0;
        const totalSupplyBeforeActual : Number = (await MachineMask.totalSupply()).toNumber();
        expect(totalSupplyBeforeExpected).to.be.equal(totalSupplyBeforeActual);

        for (const hash in claims) {
          let hashObject = claims[hash];
          let i = hashObject["index"];
          let hashProof = hashObject["proof"];
        
          // Get the new price
          let mintFees = await MachineMask.mintFees();
          
          console.log(" 📇 Minting Token ID:", i);
          console.log(" 🏷  IPFS:", hash);
          console.log(" 💰 Mint Fees Ξ:", Web3.utils.fromWei(String(mintFees), 'ether'));
          console.log(" \n")


          await MachineMask.claim(i, hash, hashProof, {
            value: mintFees
          });
        }


        delay(8000);
        console.log(" \n \n")
        console.log(" 🧑 Treasury:", dev_1.address);
        console.log(" 💲 Treasury Balance (After):", await dev_1.getBalance());

        // Check the totalSupply after minting
        const totalSupplyAfterExpected = 10000;
        const totalSupplyAfterActual : Number = (await MachineMask.totalSupply()).toNumber();
        expect(totalSupplyAfterExpected).to.be.equal(totalSupplyAfterActual);
      });

      // it("⚖️ Should be able to mint the first 4 tokens with 0.1 ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0001.jpeg", {
      //     value: "100000000000000000"
      //   });
      // });

      // it("⚖️ Should revert a mint for any of the first 4 tokens with lower than 0.1 ETH", async () => {
      //   await expect(await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0001.jpeg", {
      //     value: "10000000000000000"
      //   })).to.be.reverted;
      // });

      // it("⚖️ Should be able to mint all 8 tokens with expected ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0001.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0002.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0003.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0004.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0005.jpeg", {
      //     value: "200000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0006.jpeg", {
      //     value: "200000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0007.jpeg", {
      //     value: "300000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0008.jpeg", {
      //     value: "400000000000000000"
      //   });

      //   const totalSupplyExpected = 8;
      //   const totalSupplyActual = await (await yourCollectible.totalSupply()).toNumber();
      //   expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      // });

      // it("⚖️ Should be able to mint the first 4 tokens with 0.1 ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0001.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0002.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0003.jpeg", {
      //     value: "100000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0004.jpeg", {
      //     value: "100000000000000000"
      //   });
    
      //   const totalSupplyExpected = 4;
      //   const totalSupplyActual = await (await yourCollectible.totalSupply()).toNumber();
      //   expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      // });

      // it("⚖️ Should be able to mint tokens [5, 6] with 0.2 ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0005.jpeg", {
      //     value: "200000000000000000"
      //   });
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0006.jpeg", {
      //     value: "200000000000000000"
      //   });
    
      //   const totalSupplyExpected = 6;
      //   const totalSupplyActual = await (await yourCollectible.totalSupply()).toNumber();
      //   expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      // });

      // it("⚖️ Should be able to mint token 7 with 0.3 ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0007.jpeg", {
      //     value: "300000000000000000"
      //   });
    
      //   const totalSupplyExpected = 7;
      //   const totalSupplyActual = await (await yourCollectible.totalSupply()).toNumber();
      //   expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      // });

      // it("⚖️ Should be able to mint token 8 with 0.4 ETH", async () => {
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0008.jpeg", {
      //     value: "400000000000000000"
      //   });
    
      //   const totalSupplyExpected = 8;
      //   const totalSupplyActual = await (await yourCollectible.totalSupply()).toNumber();
      //   expect(totalSupplyExpected).to.be.equal(totalSupplyActual);
      // });

      // it("Should be working as expected", async () => {        
   
      //   // console.log("\n\n ⚖️ Should not mint another token tokens\n");
      //   // await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0005.jpeg");

      //   console.log("\n\n ⚖️ Should not mint a new image token tokens\n");
      //   await yourCollectible.mintItem("QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0010.jpeg");
      // });
    });
});