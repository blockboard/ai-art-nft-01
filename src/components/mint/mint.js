import React, { useState } from 'react';
import { ethers } from 'ethers'
import gif from './eth.gif'
import './mint.css'

const Mint = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectToWallet = async() => {
    let provider;

      try {
        if (window.ethereum) {
          provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          await window.ethereum.enable();
        } else if (window.web3) {
          provider = new ethers.providers.Web3Provider(
            window.web3.currentProvider,
            "any"
          );
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
          return 0;
        }

        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        setCurrentAccount(signerAddress);

      } catch (error) {
        throw new Error("An error happened in the ethereum checker.", { cause: error });
      }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectToWallet} className="connectBttn">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button className="mintBttn">
      Mint NFT
    </button>
  )

  return(
      <div id='mint' className='mint'>
          <div className='gif'>
            <img src={gif} alt='gif'/>
          </div>
          <div className='action'>
            <p>Mint your generated NFT among 1000+ ones</p>
            {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
          </div>
      </div>
  );
}

export default Mint;
