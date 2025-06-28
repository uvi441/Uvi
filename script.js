// --- UVI APP - FINAL VERSION 1.1 ---

// --- Step 1: HTML elements ko JavaScript mein pakadna ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const playerContainer = document.querySelector('.player-container');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playPauseButton = document.getElementById('play-pause-button');

// --- Step 2: API Key ---
// YAHAN APNI KEY DAALEIN
const API_KEY = 'AIzaSyClC0bpP1RJkJD4FWFu8JqmillmOUBhegc';

// --- Step 3: Event Listeners ---
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() !== '') {
        searchSongs(searchTerm);
    }
});

playPauseButton.addEventListener('click', togglePlayPause);
audioPlayer.addEventListener('ended', () => { playPauseButton.textContent = 'Play'; }); // Gaana khatam hone par button theek karna

// --- Step 4: Search Function ---
async function searchSongs(query) {
    resultsContainer.innerHTML = '<p class="placeholder-text">Searching for songs...</p>';
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}&maxResults=20`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.error) { throw new Error(data.error.message); }
        displayResults(data.items);
    } catch (error) {
        resultsContainer.innerHTML = `<p class="placeholder-text">Error: ${error.message}.</p>`;
    }
}

// --- Step 5: Display Results Function ---
function displayResults(songs) {
    resultsContainer.innerHTML = '';
    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">No results found.</p>';
        return;
    }
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <img src="${song.snippet.thumbnails.default.url}" alt="thumbnail">
            <div class="song-item-info">
                <h4>${song.snippet.title.replace(/&/g, '&').replace(/"/g, '"')}</h4>
                <p>${song.snippet.channelTitle}</p>
            </div>
        `;
        songElement.addEventListener('click', () => {
            playSong(song.id.videoId, song.snippet.title, song.snippet.thumbnails.high.url);
        });
        resultsContainer.appendChild(songElement);
    });
}

// --- Step 6: Play Song Function (with a NEW, better Proxy) ---
async function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = "Loading...";
    playerThumbnail.src = thumbnailUrl;
    playPauseButton.textContent = '...';

    // *** YEH HAI NAYA, POWERFUL PROXY SERVER ***
    const proxyUrl = `https://yt-stream.vopp.top/audio/${videoId}`;

    try {
        audioPlayer.src = proxyUrl;
        audioPlayer.play();
        playerTitle.textContent = title;
        playPauseButton.textContent = 'Pause';
    } catch (error) {
        playerTitle.textContent = "Failed to load song.";
    }
}

// --- Step 7: Play/Pause Toggle Function ---
function togglePlayPause() {
    if (!audioPlayer.src) return;

    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = 'Play';
    }
}
