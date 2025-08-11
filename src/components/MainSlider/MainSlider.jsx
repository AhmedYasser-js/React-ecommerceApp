// import React, { useEffect, useState } from 'react';
import Style from './MainSlider.module.css';
import slide1 from '../../assets/images/slider-image-1.jpeg';
import slide2 from '../../assets/images/slider-image-2.jpeg';
import slide3 from '../../assets/images/slider-image-3.jpeg';

export default function MainSlider() {
  // const [counter, setCounter] = useState(0);

  // useEffect(() => {
  //   // يمكنك إضافة logic هنا لاحقًا لتغيير الصور تلقائيًا مثلاً
  // }, []);

  return (
    <>
      <div className='row flex flex-row'>
        <div className='w-3/4'>
          <img
            src={slide3}
            className='w-full h-[400px]'
            alt='Main Slide'
          />
        </div>
        <div className='w-1/4'>
          <img
            src={slide1}
            className='w-full h-[200px]'
            alt='Slide 1' 
          />
          <img
            src={slide2}
            className='w-full h-[200px]'
            alt='Slide 2'
          />
        </div>
      </div>
    </>
  );
}
