import React from 'react'
import './info.css'
import nft from './nft.jpg'

function info() {
  return (
    <>
    <div className='info' id='info'>
      <div className='info-wrapper'>
          <h1 className='head'>What are NFTs?</h1>
          <p className='paragraph'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br/>
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,<br/>
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.<br/>
              It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.<br/>
              It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
      </div>
      <div className="image-wrapper">
          <img className="image-1" src={nft} alt='nft'/>
          <img className="image-2" src={nft} alt='nft'/>
          <img className="image-3" src={nft} alt='nft'/>
          <img className="image-4" src={nft} alt='nft'/>
      </div>
      <div className="mobile-img">
          <img className="image" src={nft} alt='nft'/>
      </div>
    </div>
    </>
  );
}

export default info