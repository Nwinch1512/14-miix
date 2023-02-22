import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

import "./App.css";

function App() {
  const clientID = "a9911275aba546e082be4ac4a0704f39";
  const clientID2 = "e10e755a38684f539166d4cf33dde6cb";
  const redirectURI = "http://localhost:3000/callback1";
  const redirectURI2 = "http://localhost:3000/callback2";
  //Uncomment before deploying
  //const redirectURI = "https://deft-haupia-213070.netlify.app";
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";

  const [token, setToken] = useState("");
  const [token2, setToken2] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [tracks2, setTracks2] = useState([]);

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
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token2 = window.localStorage.getItem("token2");
    if (!token2 && hash) {
      token2 = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token2", token2);
    }

    setToken2(token2);
  }, []);

  const logout2 = () => {
    setToken2("");
    window.localStorage.removeItem("token2");
  };

  // const searchArtists = async (e) => {
  //   e.preventDefault();
  //   const { data } = await axios.get("https://api.spotify.com/v1/search", {
  //     headers: { Authorization: `Bearer ${token}` },
  //     params: { q: searchKey, type: "artist" },
  //   });

  //   console.log(data);

  // };

  // Making API call to get user top 50 tracks
  const getTopTracks = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(data);
    setTracks(data.items);
  };

  const getTopTracks2 = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: { Authorization: `Bearer ${token2}` },
      }
    );
    console.log(data);
    setTracks2(data.items);
  };

  const renderTracks = () => {
    return tracks.map((item) => (
      <div key={item.id}>
        <h4>{item.name}</h4>
        <h5>{item.artists[0].name}</h5>
        <button>
          <a href={`${item.preview_url}`} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faSpotify} />
          </a>
        </button>
      </div>
    ));
  };

  const renderTracks2 = () => {
    return tracks2.map((item) => (
      <div key={item.id}>
        <h4>{item.name}</h4>
        <h5>{item.artists[0].name}</h5>
        <button>
          <a href={`${item.preview_url}`} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faSpotify} />
          </a>
        </button>
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="Miix-header">
        <h1>Miix</h1>
        <FontAwesomeIcon icon={faSpotify} />
        {!token ? (
          <a
            href={`${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=user-top-read`}
          >
            Spotify login
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {!token2 ? (
          <a
            href={`${authEndpoint}?client_id=${clientID2}&redirect_uri=${redirectURI2}&response_type=${responseType}&scope=user-top-read`}
          >
            Spotify login
          </a>
        ) : (
          <button onClick={logout2}>Logout</button>
        )}

        {token ? (
          <form onSubmit={getTopTracks}>
            <button
              type={"submit"}
              // onClick={(e) => setSearchKey(e.target.value)}
            >
              Get tracks
            </button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}
        {renderTracks()}
        {token2 ? (
          <form onSubmit={getTopTracks2}>
            <button
              type={"submit"}
              // onClick={(e) => setSearchKey(e.target.value)}
            >
              Get tracks 2
            </button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderTracks2()}
      </header>
    </div>
  );
}

export default App;
