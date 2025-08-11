import React, { useEffect, useState } from 'react';
import Style from './Notfound.module.css';

export default function Notfound() {

    const [state, setState] = useState();

    useEffect(() => {
      return () => {
      };
    }, [])


  return (
    <>
    <h1>Notfound</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam quas ipsum quo tempora consectetur, inventore architecto sint sapiente nihil veniam consequuntur. Aliquam quos dolorem quia reprehenderit veritatis debitis. Blanditiis, reprehenderit!</p>
    </>
  );
}
