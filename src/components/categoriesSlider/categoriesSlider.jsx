import React, { useEffect, useState } from 'react';
import Style from './CategoriesSlider.module.css';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

export default function CategoriesSlider() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('https://ecommerce.routemisr.com/api/v1/categories')
      .then((res) => {
        console.log(res);
        setCategories(res.data.data);
      });
  }, []);

  return (
    <div className={` p-0 ${Style.categoriesSliderContainer}`}>
      <h2 className="text-2xl font-extralight mb-6">Shop Popular Cateaories</h2>
      <Swiper
        slidesPerView={8}
        spaceBetween={0}
        freeMode={true}
        pagination={{ clickable: true  }}
        modules={[FreeMode, Pagination, Autoplay  ]}
        autoplay={{ delay: 2000, disableOnInteraction: true }}
        className="mySwiper"
      >
        {
          categories.map((category) => (
            <SwiperSlide key={category._id} >
              <img src={category.image} alt={category.name} className="w-full h-56" />
              <p className="pb-8">{category.name}</p>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
}
