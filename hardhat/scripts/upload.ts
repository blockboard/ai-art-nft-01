/* eslint no-use-before-define: "warn" */
import * as fs from 'fs';
import { readFile } from 'node:fs/promises';
const path = require("path");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');

const ipfs = new ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const artitems = "./artitems";

const main = async () => {

  let allAssets: {[index: string]: string} = {}

  console.log("\n\n Loading artwork.json...\n");
  let directory_name = "artifactstxt";
  
  // Function to get current filenames
  // in directory
  let artwork = fs.readdirSync(directory_name);

  // //read image file
  // readFile(`${process.cwd()}/artitems/0001.jpeg`, (err, data)=>{
  //         console.log("Hlepp")
  //   //error handle
  //   if(err) console.log(err);
    
  //   //get image file extension name
  //   let extensionName = path.extname(`${process.cwd()}/artitems/0001.jpeg`);
    
  //   //convert image file to base64-encoded string
  //   let base64Image = new Buffer(data.toString(), 'binary').toString('base64');
    
  //   //combine all strings
  //   let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
    
  //   //send image src string into jade compiler
  //   console.log("Image string");
  //   console.log(imgSrcString);
  // });

  // console.log(__dirname);

  // fs.readFile('0001.jpeg', function(err: Error, data: any) { 
  //   if (err) console.log(err);
  //   console.log(data);
  // });


  // const uploaded = await ipfs.add({
  //     path: `/home/iskander/Projects/Blockboard/cryptofaces-contracts/artitems/0001.jpeg`,
  //     content: Blob
  // }, { wrapWithDirectory: true });

  // console.log("ipfs:",uploaded);
    
  // fs.readdir("../artitems", (err: Error, files: string[]) => {
  //   console.log("\n\n Loading artwork.json...\n");
  //   console.log(__dirname);
  //   if (err)
  //     console.log(err);
  //   else {
  //     console.log("\nCurrent directory filenames:");
  //     files.forEach(file => {
  //       console.log(file);
  //     })
  //   }
  // });
  
  // const artwork = await fs.readDir

  // console.log(artwork);
  
  for(let a in artwork){
    console.log("  Uploading "+artwork[a]+"...");

    //const stringJSON = JSON.stringify(artwork[a]);
    console.log(typeof artwork[a]);
    console.log(artwork[a]);
    const uploaded = await ipfs.add(artwork[a]);

    console.log("   "+a+" ipfs:",uploaded);
    allAssets[uploaded.path] = artwork[a];
  }

  console.log("\n Injecting assets into the frontend...")
  const finalAssetFile = "export default "+JSON.stringify(allAssets)+""
  //fs.writeFileSync("../react-app/src/assets.js",finalAssetFile)
  fs.writeFileSync("./uploaded.json",JSON.stringify(allAssets))



  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */


  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

};

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
