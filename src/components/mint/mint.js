import React, { useState } from 'react';
import { ethers } from 'ethers';
import gif from './eth.gif';
import './mint.css';
import { addresses, AI_ART_ABI } from '../../constants/contracts';
import jsonFile from '../../data/hashed.json';

const Mint = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [miningAnimation, setMiningAnimation] = useState(false);
  const [allMintedAnimation, setAllMintedAnimation] = useState(false);
  const connectToWallet = async () => {
    let provider;
    try {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await window.ethereum.enable();
      } else if (window.web3) {
        provider = new ethers.providers.Web3Provider(window.web3.currentProvider, 'any');
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        return 0;
      }

      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const network = await provider.getNetwork();
      const networkChainId = network.chainId;

      if (networkChainId === 4) {
        setCurrentAccount(signerAddress);
      } else {
        alert('Change to Rinkeby Network');
      }
    } catch (error) {
      throw new Error('An error happened in the ethereum checker.', { cause: error });
    }
  };

  const mintHandler = async () => {
    let provider;

    try {
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await window.ethereum.enable();
      } else if (window.web3) {
        provider = new ethers.providers.Web3Provider(window.web3.currentProvider, 'any');
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        return 0;
      }

      try {
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        const networkChainId = network.chainId;

        if (networkChainId === 4) {
          let contract = new ethers.Contract(addresses[networkChainId].AI_ART, AI_ART_ABI, signer);

          let totalSupply = await contract.totalSupply();
          let currentTotalSupply = parseInt(totalSupply);

          if (currentTotalSupply === 100) {
            setAllMintedAnimation(true);
          } else {
            const fees = await contract.mintFees();

            const rawTx = {
              value: fees,
              gasLimit: ethers.BigNumber.from('400000')
            };

            try {
              let tx = await contract
                .connect(signer)
                .mintItem(
                  currentAccount,
                  jsonFile[currentTotalSupply + 1],
                  currentTotalSupply + 1,
                  rawTx
                );

              setMiningAnimation(true);
              await tx.wait();

              alert(`Mined, see transaction at: https://rinkeby.etherscan.io/tx/${tx.hash}`);
              setMiningAnimation(false);
            } catch (error) {
              throw new Error('An error happened in the ethereum checker.', { cause: error });
            }
          }
        } else {
          alert('Change to Rinkeby Network');
        }
      } catch (error) {
        throw new Error('An error happened in the ethereum checker.', { cause: error });
      }
    } catch (error) {
      throw new Error('An error happened in the ethereum checker.', { cause: error });
    }
  };

  const renderNotConnectedContainer = () => (
    <button onClick={connectToWallet} className="connectBttn">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button className="mintBttn" onClick={mintHandler}>
      Mint NFT
    </button>
  );

  if (allMintedAnimation === true) {
    return (
      <div id="mint" className="mint">
        <div className="gif">
          <img src={gif} alt="gif" />
        </div>
        <div className="allMintedAction">
          <p>
            All NFTs are minted! <br />
            <span className="viewUs">View collection on</span>
          </p>
          <button className="openSeaBttn">
            <a href="https://opensea.io/" target="_blank" rel="noreferrer">
              OpenSea
            </a>
          </button>
        </div>
      </div>
    );
  } else {
    if (miningAnimation === false) {
      return (
        <div id="mint" className="mint">
          <div className="gif">
            <img src={gif} alt="gif" />
          </div>
          <div className="action">
            <p>Mint your generated NFT among 1000+ ones</p>
            {currentAccount === '' ? renderNotConnectedContainer() : renderMintUI()}
          </div>
        </div>
      );
    }
    return (
      <div id="mint" className="mint">
        <div className="gif">
          <img src={gif} alt="gif" />
        </div>
        <div className="action">
          <p>Mint your generated NFT among 1000+ ones</p>
          <button className="mintingBttn mintBttn">
            Minting
            <div className="dot-elastic"></div>
          </button>
        </div>
      </div>
    );
  }
};
export default Mint;
