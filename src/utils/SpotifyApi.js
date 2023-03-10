import axios from "axios";
import shuffleArray from "./shuffleArray";

// Retrieves full information of the logged in user
const getUser = async (token) => {
  const { data } = await axios
    .get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch(function (error) {
      if (error.response && error.response.status === 401) {
        return false;
      }
    });

  return data;
};

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

// API call to post data to spotify
const createPlaylist = async (token, userId, name, playlist) => {
  const playlistIds = playlist.map((song) => `spotify:track:${song.id}`);

  const { data: playlistData } = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    { name: name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("playlistData");
  console.log(playlistData);

  const playlistId = playlistData.id;

  const { data: playlistTracksData } = await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
    { uris: playlistIds },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log("playlistTracksData");
  console.log(playlistTracksData);

  return playlistId;
};

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

export { getUser, getTopSongs, getRecommendedSongs, createPlaylist };
