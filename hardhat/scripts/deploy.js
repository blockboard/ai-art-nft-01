/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const glob = require("glob");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const axios = require("axios");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const merkleTree = require('../output.json');
const env = require("hardhat");

const { merkleRoot, claims } = merkleTree;

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");

  // read in all the assets to get their IPFS hash...
  let uploadedAssets = JSON.parse(fs.readFileSync("./uploaded.json"))
  let uploadedAssetsArray = Object.keys(uploadedAssets)

  let bytes32Array = [];

  for (const hash in claims) {
    let hashObject = claims[hash];
    let i = hashObject["index"];
    let hashProof = hashObject["proof"];
  
    console.log(" 📇 Minting Token ID:", i);
    console.log(" 🏷  IPFS:", hash);
    console.log(" \n")

    try {
      await axios({
        method: "POST",
        url: `${process.env.NODE_APP_BACKEND_API}/addToken`,
        params: {
          ipfsHash: hash,
          merkleIndex: i,
          merkleProof: hashProof
        }
      });
    } catch (error) {
      console.log(" ⛔ ERROR:", hash)
      //console.log(error);
    }

    // await MachineMask.claim(i, hash, hashProof, {
    //   value: mintFees
    // });
  }

  // for(let i = 0; i < uploadedAssetsArray.length; i++) {
  //   let hash = uploadedAssetsArray[i];

  //   console.log(" 📇 Item ID:", i + 1);
  //   delay(30000)
  //   console.log(" 🏷 IPFS:", hash);
  //   try {
  //     await axios({
  //       method: "POST",
  //       url: `${process.env.NODE_APP_BACKEND_API}/addToken`,
  //       params: {
  //         ipfsHash: hash,

  //       }
  //     });
  //   } catch (error) {
  //     console.log(" ⛔ ERROR:", hash)
  //     //console.log(error);
  //   }

  //   let bytes32 = utils.id(hash)
  //   console.log(" #️⃣ hashed:",bytes32)
  //   console.log(" \n")

  //   bytes32Array.push(bytes32)
  // }

  console.log(" \n");

  console.log("root is", merkleRoot);

  fs.writeFileSync(`./tree.json`, JSON.stringify(merkleTree));

  // deploy the contract with all the artworks forSale
  await deploy("MachineMask",[ "0x3c76f806Dd2F30F04448AF2d6626689452EFBcE0", merkleRoot ]) // <-- add in constructor args like line 19 vvvv

  //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

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


  //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
  /*
  await tenderlyVerify(
    {contractName: "YourContract",
     contractAddress: yourContract.address
  })
  */

  // If you want to verify your contract on etherscan
  /*
  console.log(chalk.blue('verifying on etherscan'))
  await run("verify:verify", {
    address: yourContract.address,
    // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
  })
  */

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName,{libraries: libraries});
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = ""
  if(deployed&&deployed.deployTransaction){
    const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );
  console.log(
    " ⛽",
    chalk.grey(extraGasInfo)
  );

  // TODO: fixing verification error
  // await tenderly.persistArtifacts({
  //   name: contractName,
  //   address: deployed.address
  // });

  // if (!encoded || encoded.length <= 2) return deployed;
  // fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};


// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0 && fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({contractName, contractAddress}) => {

  let tenderlyNetworks = ["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork

  if(tenderlyNetworks.includes(targetNetwork)) {
    console.log(chalk.blue(` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`))

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress
    });

    let verification = await tenderly.verify({
        name: contractName,
        address: contractAddress,
        network: targetNetwork
      })

    return verification
  } else {
      console.log(chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });