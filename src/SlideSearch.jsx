import React, { useState } from "react";

const API_URL = "http://localhost:8000/api/query-slides";

export default function SlideSearch() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const params = new URLSearchParams({ prompt, limit: 10 });
      const response = await fetch(`${API_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Slide Semantic Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your search prompt"
          style={{ width: "70%", padding: "0.5rem" }}
          required
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {results.map(slide => (
          <li key={slide.id} style={{ margin: "1rem 0", borderBottom: "1px solid #ccc" }}>
            <strong>{slide.presentation_name} (Slide {slide.slide_number})</strong>
            <p>{slide.description}</p>
            {slide.image_url && (
              <img src={slide.image_url} alt="Slide" style={{ maxWidth: "100%" }} />
            )}
            <p>
              <small>Distance: {typeof slide.distance === 'number' ? slide.distance.toFixed(3) : (typeof slide.similarity === 'number' ? (1 - slide.similarity).toFixed(3) : 'N/A')} (lower is better)</small>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
