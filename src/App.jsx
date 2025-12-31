/** @format */
import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },
}




const App = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debauncedSearchTerm, setDebauncedSearchTerm] = useState('')


  useDebounce(()=> setDebauncedSearchTerm(searchTerm),500, [searchTerm])


  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error("Could not find movie?");
      }
      const data = await response.json();
      if(data.Response === false){
        setErrorMessage(data.Error || 'Failed to fetch movie?');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);


    } catch (error) {
      console.error(`error fetching ${error}`);
      setErrorMessage(`this is an error`);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchMovies(debauncedSearchTerm)
  }, [debauncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="" />

          <h1>
            Find the <span className="text-gradient">Movies</span> you enjoy
            without a hussle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        </header>

        <section className='all-movies'>

          <h2 className='mt-8'>All movies</h2>
          {isLoading ?(
              <Spinner/>
          ) :errorMessage ?(
              <p className='text-red-500'>Error: {errorMessage}</p>
          ) : (
              <ul>
                {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
          )}
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </section>



      </div>
    </main>
  );
};

export default App;
