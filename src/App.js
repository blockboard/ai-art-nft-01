import Container from '@mui/material/Container';
import './App.css';
import Header from './components/header/header'
import Swiper from './components/swiper/swiper'
import Mint from './components/mint/mint'
import Info from './components/info/info'
import FAQ from './components/faq/faq'

const App = () => {
  return(
    <>
    <Container maxWidth="lg">
      <Header></Header>
      <Swiper></Swiper>
      <Mint></Mint>
      <Info></Info>
      <FAQ></FAQ>
      <hr className='hr'></hr>
      <div className='footer'>
        <div className='VCA'>Verified Contract Address 
          <a href='https://testnets.opensea.io/account' target="_blank" rel='noreferrer' className='address'>
            0xD2E9613489476bb08B782c56d41c4aDB660AB0Bc</a>
        </div>
      </div>
    </Container>
    
    </>
  );
}

export default App;
