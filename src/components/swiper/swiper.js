import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper'
import 'swiper/css';

import './swiper.css'
import slideOne from './slide1.jpg'
import slideTwo from './slide2.jpg'
import slideThree from './slide3.jpg'
import slideFour from './slide4.jpg'
import slideFive from './slide5.jpg'

function swiper() {
  return(
      <>
      <div id='assets' className='assets'>
        <Swiper
            className='swiper'
            modules={[Autoplay]}
            slidesPerView={1}
            speed={5000}
            loop="true"
            autoplay={{
                delay:1,
                disableOnInteraction: false                
            }}
            breakpoints={{
              // when window width is >= 768px
              768: {
                slidesPerView: 3,
                spaceBetween: 50
              },
            }}
            >
            <div className='swiper-wrapper'>
            <SwiperSlide className='slide'> <img src={slideOne} alt='one'/> </SwiperSlide>
            <SwiperSlide className='slide'> <img src={slideTwo} alt='one'/> </SwiperSlide>
            <SwiperSlide className='slide'> <img src={slideThree} alt='one'/> </SwiperSlide>
            <SwiperSlide className='slide'> <img src={slideFour} alt='one'/> </SwiperSlide>
            <SwiperSlide className='slide'> <img src={slideFive} alt='one'/> </SwiperSlide>
            </div>
        </Swiper>
      </div>
      </>
  );
}

export default swiper;
