import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api"; // Make sure this function is implemented correctly
import "../css/MovieDetails.css";

function MovieDetails() {
  const { movieId } = useParams();  // Get movieId from URL params
  const navigate = useNavigate();  // For programmatic navigation
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(movieId);  // Get movie details using movieId
        setMovieDetails(data);
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();  // Fetch movie details when the component mounts or movieId changes
  }, [movieId]);  // Dependencies include movieId to reload details when it changes

  if (loading) return <div className="loading">Loading...</div>;
  if (error) 
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  return (
    <div className="movie-details">
      <button onClick={() => navigate("/")} className="back-button">
        &larr; Back to Home
      </button>
      <div className="details-container">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} 
          alt={movieDetails.title} 
          className="movie-poster"
        />
        <div className="details-info">
          <h2>{movieDetails.title}</h2>
          <p>{movieDetails.overview}</p>
          <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
          <p><strong>Rating:</strong> {movieDetails.vote_average}/10</p>
          <p><strong>Runtime:</strong> {movieDetails.runtime} minutes</p>
          <h4>Genres:</h4>
          <ul>
            {movieDetails.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
          <h4>Cast:</h4>
          <ul>
            {movieDetails.cast?.map((actor) => (
              <li key={actor.id}>{actor.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
