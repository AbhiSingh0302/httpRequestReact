import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  async function fetchMoviesHandler(){
    try { 
      const reponse = await fetch('https://swapi.dev/api/films/');
      const resultToJSON = await reponse.json();
      const tranformedMovies = resultToJSON.results.map(movie => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date
        }
      })
      setMovies(tranformedMovies);
    } catch (error) {
      console.log(error);
      alert("Something went wrong!!");
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
