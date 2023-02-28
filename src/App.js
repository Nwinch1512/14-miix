import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SpotifyPlayer from "react-spotify-web-playback";

import Navigation from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import "./App.css";
import RenderPlaylist from "./components/RenderPlaylist";
import Footer from "./components/Footer";
import getRecommendedSongsFromCombinedTopTracks from "./utils/playlistService";

// const App = (props) => {
function App() {
  const clientID = "a9911275aba546e082be4ac4a0704f39";
  const redirectURI = "http://localhost:3000";
  //Uncomment before deploying
  //const redirectURI = "https://deft-haupia-213070.netlify.app";
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";
  const scope =
    "user-top-read playlist-modify-private streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-library-read user-library-modify";

  // Token needed for Oauth
  const [token, setToken] = useState("");
  //const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [playlist, setPlaylist] = useState([]);

  // Retrieves and stores the user's access token from the Spotify redirect URL after the user logs into Spotify
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    async function displayUser() {
      const user = await getUser(token);
      console.log(user);

      const userId = user.id;
      const userName = user.display_name;
      //setUserId(userId);
      setUserName(userName);
      window.localStorage.setItem("userId", userId);
      window.localStorage.setItem("userName", userName);
    }
    displayUser();
  }, []);

  // Removes the user's access token from local storage, logging them out
  const logout = () => {
    setToken("");
    //setUserId("");
    setUserName("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("playlist");
  };

  // Move to SpotifyApi
  const getUser = async (token) => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  };

  const getTracks = async (e) => {
    e.preventDefault();

    // Display recommended songs as the current playlist
    setPlaylist(await getRecommendedSongsFromCombinedTopTracks(token));
  };

  const playTrack = (trackId, token) => {
    console.log("Play track");
    console.log(trackId);
    ReactDOM.render(
      <React.Fragment>
        <SpotifyPlayer
          token={token}
          // Need to pass in a playlist id into context_url
          // context_uri={INSERT PLAYLIST ID}
          uris={`spotify:track:${trackId}`}
          autoPlay="true"
        />
      </React.Fragment>,
      document.querySelector("#player")
    );
  };

  return (
    <div className="App">
      <Navigation />
      <Hero />
      <About />
      <header className="Miix-header">
        {!token ? (
          <div>
            <h2 className="login">Please login</h2>
            <a
              href={`${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}&show_dialog=true`}
              className="login-link"
            >
              <FontAwesomeIcon icon={faSpotify} />
            </a>
          </div>
        ) : (
          <div className="btn-div col-lg-12 col-md-12 col-sm-12">
            <h1 className="user-greeting">Hello {userName}!</h1>
            <button onClick={logout} className="logoutBtn">
              Logout
            </button>
            {token ? (
              <button onClick={getTracks} className="get-tracks-btn">
                Get tracks
              </button>
            ) : (
              <p className="login">Please login</p>
            )}
            <div>
              <div id="player">
                {token && playlist && playlist.length > 0 ? (
                  <SpotifyPlayer
                    token={token}
                    uris={playlist.map((item) => `spotify:track:${item.id}`)}
                    autoPlay="true"
                  />
                ) : (
                  ""
                )}
              </div>
              {token ? RenderPlaylist(playlist, token) : ""}
            </div>
          </div>
        )}
      </header>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
