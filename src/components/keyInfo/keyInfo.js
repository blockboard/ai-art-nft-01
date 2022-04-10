import React from 'react';
import './keyInfo.css';

function keyInfo() {
  return (
    <>
      <div className="key-info">
        <h1 className="key-info-header">Key information</h1>
        <p className="key-info-paragraph">
          Release Date: 11th April 2022 <br />
          Total number of tokens: 100 <br />
          Price per token: 0.2 ETH <br />
          Token type: ERC-721 <br />
          Blockchain: Ethereum <br />
          File hosting: IPFS
        </p>
      </div>
    </>
  );
}

export default keyInfo;
