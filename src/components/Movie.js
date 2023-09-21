import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  const clickHandler = async (e) => {
    try {
      const repsonse = await fetch(`https://react-http-36281-default-rtdb.firebaseio.com/movies/${props.id}.json`,{
        method: 'DELETE'
      });
      const data = await repsonse.json();
      e.target.parentElement.remove();
      console.log(data);
    } catch (error) {
      console.log(error);      
    }
  }

  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={clickHandler}>Delete Movie</button>
    </li>
  );
};

export default Movie;
