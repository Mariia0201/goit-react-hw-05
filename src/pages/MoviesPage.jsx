import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Loader from "../components/Loader";
import MovieList from "../components/MovieList";

import toast, { Toaster } from "react-hot-toast";
import css from "../pages/MoviesPage.module.css";
import axios from "axios";
import SearchBar from "../components/SearchBar";

const MoviesPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjE2OTNmNGE4NTJmOGEyNzcxNjZmNzM3MTM3N2U4OSIsInN1YiI6IjY1ZmYwYzNmMDQ3MzNmMDE2NGU5YjFlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kXgZ5m9nP6YrMiJleI5mNHUAPDiUQQSY5BmeKcEjLWU";

 
  const getFilmsSearch = async (query, page = 1) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
    const params = {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.get(url, params);
      
      return response.data; 
    } catch (error) {

      toast.error("An error occurred while fetching movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchResults([]);
    const searchData = async (query, page) => {
      try {
        setLoading(true);
        const response = await getFilmsSearch(query, page);
        if (response && response.results) {
          setSearchResults(response.results);
          setTotalPages(response.total_pages);


        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      searchData(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className={css.container}>
      <section className={css.moviesSearch}>
        <SearchBar
          onSubmit={(query) => setSearchParams({ search: query })}
          initialValue={searchQuery || ""}
        />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: css.toastTextCenter,
          }}
        />
        {loading && <Loader />}
        {searchResults.length !== 0 && <MovieList movies={searchResults} />}
        {searchResults.length !== 0 && (
          <div className={css.btnPaginationThumb}>
            <button
              className={css.btnPagination}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>
            <button
              className={css.btnPagination}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next Page
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MoviesPage;

