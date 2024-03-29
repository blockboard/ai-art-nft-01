import Container from '@mui/material/Container';
import './App.css';
import openSea from './openSea.png';
import Header from './components/header/header';
import Swiper from './components/swiper/swiper';
import Mint from './components/mint/mint';
import Info from './components/info/info';
import FAQ from './components/faq/faq';
import KeyInfo from './components/keyInfo/keyInfo';
import { addresses, OPENSEA_USERNAME } from '../src/constants/contracts';

const App = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Header></Header>
        <Swiper></Swiper>
        <Mint></Mint>
        <Info></Info>
        <FAQ></FAQ>
        <KeyInfo></KeyInfo>
        <hr className="hr"></hr>
        <div className="footer">
          <div className="VCA">
            <p>Verified Contract Address</p>
            <a
              href={`https://etherscan.io/address/${addresses[1].KEMOSABE}`}
              target="_blank"
              rel="noreferrer"
              className="address">
              {addresses[1].KEMOSABE}
            </a>
          </div>
          <a
            href={`https://opensea.io/collection/${OPENSEA_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="socialMediaA">
            <img src={openSea} alt="openSea" className="openSeaLogo"></img>
          </a>
        </div>
      </Container>
    </>
  );
};

export default App;
