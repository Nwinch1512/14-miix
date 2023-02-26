function getPlaylist() {
  let playlist = JSON.parse(localStorage.getItem("playlist"));
  if (playlist) {
    return playlist;
  } else {
    return [];
  }
}

function savePlaylist(playlist) {
  localStorage.setItem("playlist", JSON.stringify(playlist));
}

function getUserId() {
  let userId = JSON.parse(localStorage.getItem("userId"));
  if (userId) {
    return userId;
  } else {
    return "";
  }
}

function getToken() {
  let token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    return token;
  } else {
    return "";
  }
}

export { getPlaylist, savePlaylist, getUserId, getToken };
