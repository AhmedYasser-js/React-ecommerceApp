import React, { useContext, useEffect } from 'react';
import Style from './Home.module.css';
import { UserContext } from '../../Context/UserContext.jsx';
import RecentProducts from '../RecentProducts/RecentProducts.jsx';
import CategoriesSlider from '../categoriesSlider/categoriesSlider.jsx';
import MainSlider from '../MainSlider/MainSlider.jsx';
import Categories from '../Categories/Categories.jsx';

export default function Home() {

  let { userLogin } = useContext(UserContext);
  useEffect(() => {
    return () => {
    };
  }, [])

  console.log(userLogin);


  return (
    <>
    <MainSlider />
      <Categories />
      <RecentProducts />
    </>
  );
}
