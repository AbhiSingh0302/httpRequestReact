import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchRequestInterval, setFetchRequestInterval] = useState(null);

  const fetchMoviesHandler = useCallback(async function(){
    try { 
      setIsLoading(true);
      const reponse = await fetch('https://react-http-36281-default-rtdb.firebaseio.com/movies.json');
      if(!reponse.ok){
        throw new Error("Something went wrong ....Retrying")
      }
      const resultToJSON = await reponse.json();
      const tranformedMovies = [];
      for(let key in resultToJSON){
        tranformedMovies.push({
          id: key,
          title: resultToJSON[key].title,
          openingText: resultToJSON[key].openingText,
          releaseDate: resultToJSON[key].releaseDate
        })
      }
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

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-36281-default-rtdb.firebaseio.com/movies.json',{
      method: 'POST',
      body: JSON.stringify(movie),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies</p>;
  let cancelButton = "";

  if(movies.length > 0){
    content = <MoviesList movies={movies} />;
  }

  if(error){
    content = <p>{error}</p>;
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
      <AddMovie onAddMovie={addMovieHandler} />
    </section>
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
