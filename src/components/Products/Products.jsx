import React, { useEffect } from 'react';
import Style from './Products.module.css';
import RecentProducts from '../RecentProducts/RecentProducts.jsx';

export default function Products() {

    useEffect(() => {
      return () => {
      };
    }, [])

  return (
    <>
      <RecentProducts />
    </>
  );
}
