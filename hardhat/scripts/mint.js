/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const Web3 = require('web3');
const chalk = require("chalk");
//const { config, ethers, tenderly, run } = require("hardhat");
const { utils, BigNumber } = require("ethers");
const R = require("ramda");
const IpfsHttpClient = require("ipfs-http-client");

const ipfs = new IpfsHttpClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const web3 = new Web3(`https://rinkeby.infura.io/v3/13bd11d61782418e98dbb5170b8e19f0`);

const yourCollectibleABI = {
    "abi": [
        {
          "inputs": [
            {
              "internalType": "bytes32[]",
              "name": "assetsForSale",
              "type": "bytes32[]"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "baseURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "forSale",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "getApproved",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "tokenURI",
              "type": "string"
            }
          ],
          "name": "mintItem",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ownerOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "tokenByIndex",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "tokenOfOwnerByIndex",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "tokenURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalAssetsSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "uriToTokenId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
};

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");

  let receipt;

  const tokenContractAddress = '0xDF41423e46BD770645FdEa1AF3BAED426E46413e';
  const gas = 9000000;
  const networkId = await web3.eth.net.getId();
  const gasPrice = await web3.eth.getGasPrice();
  const gasPriceInEther = await web3.utils.fromWei(gasPrice);
  const address = '0xb12D87C03255050e0bd0dd72d748823fd385F4ab';
  const nonce = await web3.eth.getTransactionCount(address);
  

  const nftContract = new web3.eth.Contract(
    yourCollectibleABI.abi,
    tokenContractAddress
  );

  const tx = nftContract.methods.mintItem('QmZBd1Rg8VVsSVpHtTwVwjq9TES9ZCDhtDwjDmr2KpfU56');

  const data = tx.encodeABI();

  const signedTx = await web3.eth.accounts.signTransaction({
    "from": address,
    "to": tokenContractAddress,
    "chainId": networkId,
    gas,
    gasPrice,
    nonce,
    data,
    "value": 10000000000000000
  }, '0x2f19f31f479458b358051014553d3129d00f1b7b7b2f27160c199bc310ea0edd');

  try {
    receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (e) {
    console.log(`Blockchain Mint Error: ${e}`);
  }

  console.log(`Mint TransactionHash: ${receipt.transactionHash}`);

  const ethPaid = gasPriceInEther * receipt.gasUsed;

  console.log(`Mint ethPaid: ${ethPaid}`);
  // const tx2 = await nftContract.methods.tokenURI(1).call({
  //   from: address,
  //   to: '0xFEeC679B4E711C5EA60E2789BaA1933C9271Ab8c',
  //   chainId: networkId,
  // });

  // console.log(tx2);

  // const data = tx2.encodeABI();

  // const signedTx = await web3.eth.accounts.signTransaction({
  //   "from": address,
  //   "to": '0xFEeC679B4E711C5EA60E2789BaA1933C9271Ab8c',
  //   "chainId": networkId,
  //   gas,
  //   gasPrice,
  //   nonce,
  //   data
  // }, '0x2f19f31f479458b358051014553d3129d00f1b7b7b2f27160c199bc310ea0edd');

  // try {
  //   receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  //   console.log(tx2);
  //   console.log(receipt);
  // } catch (e) {
  //   console.log(`Blockchain Mint Error: ${e}`);
  // }

  // read in all the assets to get their IPFS hash...
//   const cid = 'QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11'

//   let bytes32Array = []
//   for await (const file of ipfs.get(cid)) {
//     if (!file.content) continue;
//     for await (const chunk of file.content) {}    
//     console.log(" #️⃣ hashed:",file.path)
//     let bytes32 = utils.id(file.path)
//     bytes32Array.push(bytes32);
//   }

//   let uploadedAssets = JSON.parse(fs.readFileSync("./uploaded.json"))
//   for(let a in uploadedAssets){
//     console.log(" 🏷 IPFS:",a)
//     let bytes32 = utils.id(a)
//     console.log(" #️⃣ hashed:",bytes32)
//     bytes32Array.push(bytes32)
//   }
//   console.log(" \n")
//   // An example Provider
//   const provider = ethers.getDefaultProvider();

//   // An example Signer
//   const signer = ethers.Wallet.createRandom().connect(provider);

//   // deploy the contract with all the artworks forSale
//   const yourCollectible = await deploy("YourCollectible",[ bytes32Array ]) // <-- add in constructor args like line 19 vvvv

  // const myNFTContract = new ethers.Contract('0xFEeC679B4E711C5EA60E2789BaA1933C9271Ab8c', yourCollectibleABI.abi, signer);
  // console.log(" 2 \n")
  // const sendTransactionPromise = await myNFTContract.mintItem('QmP8ZD7YrSyPWaU1UnTD9jFR6rwokncCCd3WK7f7eSJi11/0001.jpeg', {
  //   gasLimit: 10000000
  // });
  // console.log(" sendTransactionPromise \n")
  // console.log(sendTransactionPromise);
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

  // console.log(
  //   " 💾  Artifacts (address, abi, and args) saved to: ",
  //   chalk.blue("packages/hardhat/artifacts/"),
  //   "\n\n"
  // );
};

// const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
//   console.log(` 🛰  Deploying: ${contractName}`);

//   const contractArgs = _args || [];
//   const contractArtifacts = await ethers.getContractFactory(contractName,{libraries: libraries});
//   const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
//   const encoded = abiEncodeArgs(deployed, contractArgs);
//   fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

//   let extraGasInfo = ""
//   if(deployed&&deployed.deployTransaction){
//     const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice);
//     const tx = deployed.deployTransaction
//     extraGasInfo = `GAS USED: ${gasUsed}  // ${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
//   }

//   console.log(
//     " 📄",
//     chalk.cyan(contractName),
//     "deployed to:",
//     chalk.magenta(deployed.address)
//   );
//   console.log(
//     " ⛽",
//     chalk.grey(extraGasInfo)
//   );

//   await tenderly.persistArtifacts({
//     name: contractName,
//     address: deployed.address
//   });

//   if (!encoded || encoded.length <= 2) return deployed;
//   fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

//   return deployed;
// };


// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
// const abiEncodeArgs = (deployed, contractArgs) => {
//   // not writing abi encoded args if this does not pass
//   if (
//     !contractArgs ||
//     !deployed ||
//     !R.hasPath(["interface", "deploy"], deployed)
//   ) {
//     return "";
//   }
//   const encoded = utils.defaultAbiCoder.encode(
//     deployed.interface.deploy.inputs,
//     contractArgs
//   );
//   return encoded;
// };

// // checks if it is a Solidity file
// const isSolidity = (fileName) =>
//   fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0 && fileName.indexOf(".swap") < 0;

// const readArgsFile = (contractName) => {
//   let args = [];
//   try {
//     const argsFile = `./contracts/${contractName}.args`;
//     if (!fs.existsSync(argsFile)) return args;
//     args = JSON.parse(fs.readFileSync(argsFile));
//   } catch (e) {
//     console.log(e);
//   }
//   return args;
// };

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // If you want to verify on https://tenderly.co/
// const tenderlyVerify = async ({contractName, contractAddress}) => {

//   let tenderlyNetworks = ["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
//   let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork

//   if(tenderlyNetworks.includes(targetNetwork)) {
//     console.log(chalk.blue(` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`))

//     await tenderly.persistArtifacts({
//       name: contractName,
//       address: contractAddress
//     });

//     let verification = await tenderly.verify({
//         name: contractName,
//         address: contractAddress,
//         network: targetNetwork
//       })

//     return verification
//   } else {
//       console.log(chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`))
//   }
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });