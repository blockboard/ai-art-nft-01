import React from 'react';
import './info.css';

function info() {
  return (
    <>
      <div className="info" id="info">
        <div className="info-wrapper">
          <h1 className="head">What is Kemosabe?</h1>
          <p className="paragraph">
            Kemosabe is AI generated Crypto art. It’s a collection of 100 unique digitally created
            NFT. It’s created using Machine Learning methods. Artwork collection is living on the
            Ethereum blockchain as ERC-721 tokens and hosted on IPFS.
          </p>
        </div>

        <div className="glitch">
          <div className="glitch__item"></div>
          <div className="glitch__item"></div>
          <div className="glitch__item"></div>
          <div className="glitch__item"></div>
          <div className="glitch__item"></div>
        </div>
      </div>
    </>
  );
}

export default info;
