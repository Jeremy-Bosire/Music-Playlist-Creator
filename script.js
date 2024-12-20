// Spotify API credentials
const CLIENT_ID = "15e39d732ca5498da24ababe1e828254";
const CLIENT_SECRET = "69c7a9f504ab422fa6a9364c09754265";

// Global variables
let playlists = [];
let accessToken = "";

// Fetch Spotify Access Token
const fetchAccessToken = async () => {
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

// Search for Songs
const searchSongs = async (query) => {
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

// Display Search Results
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

// Add Song to Playlist
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

// Create a New Playlist
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

// Render Playlists
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

// Delete a Playlist
const deletePlaylist = (index) => {
  playlists.splice(index, 1);
  renderPlaylists();
};

// Event Listeners
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  if (query) searchSongs(query);
});

document
  .getElementById("create-playlist-btn")
  .addEventListener("click", createPlaylist);

// Initialize App
fetchAccessToken();
