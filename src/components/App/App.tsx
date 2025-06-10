import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const handleSubmit = (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (trimmed) {
      setQuery(trimmed);
      setPage(1);
    }
  };

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  return (
    <div className={css.app}>
      <div>
        <Toaster />
      </div>
      <SearchBar onSubmit={handleSubmit} />
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages ?? 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleMovieClick} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
