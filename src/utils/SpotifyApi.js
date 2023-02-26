import axios from "axios";
import React, { useState, useEffect } from "react";
import shuffleArray from "./shuffleArray";
import { getUserId, getToken } from "./playlistRepository";

// Making API call to get user top 20 tracks
const getTopSongs = async (token) => {
  const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Response");
  console.log(data);

  const songs = mapSongs(data.items);
  console.log("Top songs");
  console.log(songs);

  return songs;
};

// Making API call to get recommended tracks based on seed tracks playlist
const getRecommendedSongs = async (playlist, token) => {
  const playlistIds = playlist.map((song) => song.id);
  // Shuffling playlist ID array to ensure the seeds are taken from a mixture of songs
  const shuffledPlaylist = shuffleArray(playlistIds);
  const shuffledPlaylistSeeds = shuffledPlaylist.slice(0, 5).join(",");

  const { data } = await axios.get(
    "https://api.spotify.com/v1/recommendations",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { seed_tracks: shuffledPlaylistSeeds, limit: 10 },
    }
  );
  console.log("Response");
  console.log(data);

  const songs = mapSongs(data.tracks);
  console.log("Recommended songs");
  console.log(songs);

  return songs;
};

//Thinking about post API call
// const postPlaylist = async () => {
//   const userId = getuserId();
//   const token = gettoken();
//   const { data } = await axios.get(
//     "https://api.spotify.com/v1/users/{userId}/playlists",
//     {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { name: "Miix recommendations" },
//     }
//   );
//   console.log("Response");
//   console.log(data);

//   const songs = mapSongs(data.items);
//   console.log("Top songs");
//   console.log(songs);

//   return songs;
// };

const mapSongs = (spotifyItems) => {
  return spotifyItems.map((spotifyItem) => {
    return {
      id: spotifyItem.id,
      name: spotifyItem.name,
      artist: spotifyItem.artists[0].name,
      imageURL: spotifyItem.album.images[0].url,
      songURL: spotifyItem.external_urls.spotify,
    };
  });
};

// Trying post request

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let accessToken = window.localStorage.getItem("token");
    // const endpoint = "https://api.spotify.com/v1/users/{user_id}/playlists";
    // const userId = getUserId();
    let userId = window.localStorage.getItem("userId");

    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },

          params: { name: playlistName, public: false },
        }
      );
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="playlistName">Playlist Name:</label>
        <input type="text" id="playlistName" onChange={handleNameChange} />

        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
};

export { getTopSongs, getRecommendedSongs };
export default CreatePlaylist;
