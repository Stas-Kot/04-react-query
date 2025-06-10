import axios from "axios";
import type { Movie } from "../types/movie";

interface GetMoviesRes {
  results: Movie[];
  total_pages: number;
}
const BASE_URL = "https://api.themoviedb.org/3/search/movie?query=";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get<GetMoviesRes>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
    return response.data;
}

export default fetchMovies;