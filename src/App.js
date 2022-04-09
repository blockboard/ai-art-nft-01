import Container from '@mui/material/Container';
import './App.css';
import openSea from './openSea.png';
import Header from './components/header/header';
import Swiper from './components/swiper/swiper';
import Mint from './components/mint/mint';
import Info from './components/info/info';
import FAQ from './components/faq/faq';

const App = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Header></Header>
        <Swiper></Swiper>
        <Mint></Mint>
        <Info></Info>
        <FAQ></FAQ>
        <hr className="hr"></hr>
        <div className="footer">
          <div className="VCA">
            <p>Verified Contract Address</p>
            <a
              href="https://testnets.opensea.io/account"
              target="_blank"
              rel="noreferrer"
              className="address">
              0xD2E9613489476bb08B782c56d41c4aDB660AB0Bc
            </a>
          </div>
          <a href="https://opensea.io/" target="_blank" rel="noreferrer" className="socialMediaA">
            <img src={openSea} alt="openSea" className="openSeaLogo"></img>
          </a>
        </div>
      </Container>
    </>
  );
};

export default App;
