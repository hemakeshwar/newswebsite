import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./styles.css";

// Theme Context for Dark Mode
const ThemeContext = React.createContext();
const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? "dark-mode" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Navbar Component
const Navbar = () => {
  const { darkMode, setDarkMode } = React.useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h2 className="navbar-title" onClick={() => navigate("/")}>Chandra Gowtham News</h2>
      <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞" : "🌙"}
      </button>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <p onClick={() => navigate("/category/general")}>General</p>
      <p onClick={() => navigate("/category/technology")}>Technology</p>
      <p onClick={() => navigate("/category/politics")}>Politics</p>
      <p onClick={() => navigate("/category/health")}>Health</p>
      <p onClick={() => navigate("/category/business")}>Business</p>
      <p onClick={() => navigate("/category/entertainment")}>Entertainment</p>
      <p onClick={() => navigate("/category/science")}>Science</p>
      <p onClick={() => navigate("/category/sports")}>Sports</p>
    </div>
  );
};

// Home Page
const Home = () => {
  return (
    <div className="content">
      <h1>Welcome to Chandra Gowtham News</h1>
      <p>Select a category from the sidebar to explore the latest news.</p>
    </div>
  );
};

// Category Page
const CategoryPage = () => {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://newsdata.io/api/1/news?apikey=pub_7298498870d12ab91e51af3e2277e6fb8a017&category=${id}&language=en`)
      .then(response => setArticles(response.data.results || []))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="content">
      <h2>{id.toUpperCase()} News</h2>
      {loading ? <p>Loading...</p> : 
        articles.length > 0 ? (
          <div className="news-grid">
            {articles.map((news, index) => (
              <div key={index} className="news-card" onClick={() => window.open(news.link, "_blank")}>
                <img src={news.image_url || "https://via.placeholder.com/300"} alt="News" />
                <h4>{news.title}</h4>
                <p>{news.description}</p>
              </div>
            ))}
          </div>
        ) : <p>No news found.</p>}
    </div>
  );
};

// App Component
const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

// Export App as default
export default App;

// Render App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);