import React from 'react';
import './header.css';
import logo from './logo.jpg';
import twitter from './twitter.png';
import discord from './discord.png';
import { TWITTER_USERNAME, DISCORD_INVITATION } from '../../constants/contracts';

function header() {
  return (
    <>
      <div className="desktop-header">
        <div className="logo">
          <img src={logo} alt="logo" />
          <h4>Kemosabe</h4>
        </div>
        <div className="sections">
          <div className="parts">
            <a href="#mint" className="sectionsA mintB">
              Mint
            </a>
            <a href="#assets" className="sectionsA">
              Assets
            </a>
            <a href="#info" className="sectionsA">
              Info
            </a>
            <a href="#faq" className="sectionsA">
              FAQ
            </a>
          </div>
          <div className="socialMedia">
            <a
              href={`https://twitter.com/${TWITTER_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="socialMediaA">
              <img src={twitter} alt="twitter" />
            </a>
            <a
              href={`https://discord.gg/${DISCORD_INVITATION}`}
              target="_blank"
              rel="noreferrer"
              className="socialMediaA">
              <img src={discord} alt="discord" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default header;
