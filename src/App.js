import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchRequestInterval, setFetchRequestInterval] = useState(null);

  const fetchMoviesHandler = useCallback(async function(){
    try { 
      setIsLoading(true);
      const reponse = await fetch('https://swapi.dev/api/films/');
      if(!reponse.ok){
        throw new Error("Something went wrong ....Retrying")
      }
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
      setError(error.message);
      setIsLoading(false);
    }
  },[])

  useEffect(() => {
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  useEffect(() => {
    if(error){

      const intervalId = setInterval(() => {
        fetchMoviesHandler();
      }, 5000);
      setFetchRequestInterval(intervalId);
      
      // Clean up the interval when the component unmounts
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [error,fetchMoviesHandler]);


  let content = <p>Found no movies</p>;
  let cancelButton = "";

  if(movies.length > 0){
    content = <MoviesList movies={movies} />;
  }

  if(error){
    content = <p>{error}</p>;
    // const fetchRequestInterval = setInterval(() => {
    //   // console.log("timeout");
    //   fetchMoviesHandler();
    //   clearInterval(fetchRequestInterval);
    // },5000)
    function stopTimer(){
      clearInterval(fetchRequestInterval);
    }
    cancelButton = <button onClick={stopTimer}>Cancel Request</button>
  }

  if(isLoading){
    content = <><div className="spinner-container">
    <div className="loading-spinner"></div>
  </div></>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        {cancelButton}
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
