// Spotify API details
const CLIENT_ID = "15e39d732ca5498da24ababe1e828254";
const CLIENT_SECRET = "69c7a9f504ab422fa6a9364c09754265";

// Global variables
let playlists = [];
let accessToken = "";

// This part fetches the Spotify Access Token
const getSpotifyToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  accessToken = data.access_token;
};

// This is the part that Searches for Songs
const lookUpTracks = async (query) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  displaySearchResults(data.tracks.items);
};

// This part displays the search results
const displaySearchResults = (tracks) => {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";
  tracks.forEach((track) => {
    const songDiv = document.createElement("div");
    songDiv.className = "song";
    songDiv.innerHTML = `
      <span>${track.name} by ${track.artists[0].name}</span>
      <button onclick="addSongToPlaylist('${track.name}', '${track.artists[0].name}')">Add to Playlist</button>
    `;
    searchResults.appendChild(songDiv);
  });
};

// This part adds a song to a playlist
const addSongToPlaylist = (songName, artistName) => {
  const playlistContainer = document.getElementById("playlist-container");
  const selectedPlaylist = playlists[playlists.length - 1]; // Adding to the last playlist created
  if (!selectedPlaylist) {
    alert("Create a playlist first!");
    return;
  }
  selectedPlaylist.songs.push({ songName, artistName });
  renderPlaylists();
};

// This part creates a new playlist
const createPlaylist = () => {
  const playlistName = document.getElementById("playlist-name").value.trim();
  if (!playlistName) {
    alert("Playlist name cannot be empty!");
    return;
  }
  playlists.push({ name: playlistName, songs: [] });
  document.getElementById("playlist-name").value = "";
  renderPlaylists();
};

// This part renders the playlists
const renderPlaylists = () => {
  const playlistContainer = document.getElementById("playlist-container");
  playlistContainer.innerHTML = "";
  playlists.forEach((playlist, index) => {
    const playlistDiv = document.createElement("div");
    playlistDiv.className = "playlist";
    playlistDiv.innerHTML = `
      <div>
        <strong>${playlist.name}</strong>
        <ul>
          ${playlist.songs
            .map((song) => `<li>${song.songName} by ${song.artistName}</li>`)
            .join("")}
        </ul>
      </div>
      <button onclick="deletePlaylist(${index})">Delete</button>
    `;
    playlistContainer.appendChild(playlistDiv);
  });
};

// This is the part that deletes a playlist
const deletePlaylist = (index) => {
  playlists.splice(index, 1);
  renderPlaylists();
};

// Event listeners
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  if (query) searchSongs(query);
});

document
  .getElementById("create-playlist-button")
  .addEventListener("click", createPlaylist);

// Initialize App
fetchAccessToken();
