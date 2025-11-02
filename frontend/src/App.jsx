import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [links, setLinks] = useState([]);
  const [newLongUrl, setNewLongUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");

  const [editingCode, setEditingCode] = useState(null);
  const [editingUrl, setEditingUrl] = useState("");

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/links`);
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreateLink = async (event) => {
    event.preventDefault();

    const payload = {
      long_url: newLongUrl,
      custom_short_code: customShortCode || null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
        return;
      }

      setNewLongUrl("");
      setCustomShortCode("");
      fetchLinks(); // Recargar la lista
    } catch (error) {
      console.error("Failed to create link:", error);
    }
  };

  const startEditing = (link) => {
    setEditingCode(link.short_code);
    setEditingUrl(link.long_url);
  };

  const cancelEditing = () => {
    setEditingCode(null);
    setEditingUrl("");
  };

  const handleUpdateLink = async (shortCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/links/${shortCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ long_url: editingUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update link");
      }

      cancelEditing();
      fetchLinks(); // Recargar la lista
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  const getFullShortUrl = (shortCode) => {
    return `${API_BASE_URL}/${shortCode}`;
  };

  return (
    <main className="container">
      <header>
        <h1>Acortador de URLs</h1>
      </header>

      <section className="form-section">
        <h2>Crear nuevo enlace</h2>
        <form onSubmit={handleCreateLink}>
          <div className="form-group">
            <label htmlFor="longUrl">URL Larga:</label>
            <input
              id="longUrl"
              type="url"
              value={newLongUrl}
              onChange={(e) => setNewLongUrl(e.target.value)}
              placeholder="https://mi-url-larga.com/..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="shortCode">Alias (Opcional):</label>
            <input
              id="shortCode"
              type="text"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              placeholder="mi-alias-genial"
            />
          </div>
          <button type="submit">Acortar</button>
        </form>
      </section>

      <section className="links-section">
        <h2>Enlaces existentes</h2>
        <ul>
          {links.map((link) => (
            <li key={link.short_code}>
              {editingCode === link.short_code ? (
                // --- Vista de Edición ---
                <div className="edit-view">
                  <strong>{getFullShortUrl(link.short_code)}</strong>
                  <input
                    type="url"
                    value={editingUrl}
                    onChange={(e) => setEditingUrl(e.target.value)}
                  />
                  <button onClick={() => handleUpdateLink(link.short_code)}>
                    Guardar
                  </button>
                  <button onClick={cancelEditing} className="secondary">
                    Cancelar
                  </button>
                </div>
              ) : (
                // --- Vista Normal ---
                <div className="display-view">
                  <div className="link-info">
                    <strong>
                      <a
                        href={getFullShortUrl(link.short_code)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getFullShortUrl(link.short_code)}
                      </a>
                    </strong>
                    <small>{link.long_url}</small>
                  </div>
                  <button onClick={() => startEditing(link)}>Editar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
