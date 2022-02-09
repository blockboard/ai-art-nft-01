import React from 'react';
import gif from './eth.gif'
import './mint.css'

function mint() {
  return(
      <div id='mint' className='mint'>
          <div className='gif'>
            <img src={gif} alt='gif'/>
          </div>
          <div className='action'>
            <p>Mint your generated NFT among 1000+ ones</p>
            <button>Mint</button>
          </div>
      </div>
  )
}

export default mint;
