import React, { useState } from 'react';
// import { ethers } from 'ethers'
import gif from './eth.gif'
import './mint.css'

const Mint = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }
  
  const connectToWallet = async() => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
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
