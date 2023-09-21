import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchMoviesHandler(){
    try { 
      setIsLoading(true);
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
      setIsLoading(false);
      setMovies(tranformedMovies);
    } catch (error) {
      console.log(error);
      alert("Something went wrong!!");
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <><div className="spinner-container">
      <div className="loading-spinner"></div>
    </div></>}
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
