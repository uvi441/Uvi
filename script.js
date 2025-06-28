// --- UVI APP - THE FINAL SERVER-SIDE VERSION ---

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playPauseButton = document.getElementById('play-pause-button');

const API_KEY = 'AIzaSyClC0bpP1RJkJD4FWFu8JqmillmOUBhegc';

searchButton.addEventListener('click', () => searchSongs(searchInput.value));
playPauseButton.addEventListener('click', togglePlayPause);
audioPlayer.addEventListener('ended', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('playing', () => { playPauseButton.textContent = 'Pause'; });
audioPlayer.addEventListener('pause', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('loadstart', () => { playPauseButton.textContent = '...'; playerTitle.textContent = "Loading..."; });
audioPlayer.addEventListener('error', () => { playerTitle.textContent = "Error: This audio can't be played."; playPauseButton.textContent = 'Play'; });

async function searchSongs(query) {
    if (!query.trim()) return;
    resultsContainer.innerHTML = '<p class="placeholder-text">Searching...</p>';
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}&maxResults=25`;
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        displayResults(data.items);
    } catch (error) {
        resultsContainer.innerHTML = `<p class="placeholder-text">Error: ${error.message}. Check API Key.</p>`;
    }
}

function displayResults(songs) {
    resultsContainer.innerHTML = '';
    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">No results found.</p>';
        return;
    }
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `<img src="${song.snippet.thumbnails.default.url}" alt="t"><div class="song-item-info"><h4>${song.snippet.title.replace(/&/g, '&').replace(/"/g, '"')}</h4><p>${song.snippet.channelTitle}</p></div>`;
        songElement.addEventListener('click', () => playSong(song.id.videoId, song.snippet.title, song.snippet.thumbnails.high.url));
        resultsContainer.appendChild(songElement);
    });
}

// --- YAHAN BADLAV KIYA GAYA HAI ---
async function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = title.replace(/&/g, '&').replace(/"/g, '"');
    playerThumbnail.src = thumbnailUrl;

    try {
        // Ab hum bahar nahi, apne hi server par /api/get-stream ko call kar rahe hain
        const response = await fetch(`/api/get-stream?videoId=${videoId}`);
        const data = await response.json();

        if (response.ok && data.streamUrl) {
            audioPlayer.src = data.streamUrl;
            audioPlayer.play();
        } else {
            throw new Error(data.error || "Failed to get stream URL from server.");
        }
    } catch (error) {
        console.error("Error in playSong:", error);
        playerTitle.textContent = "Error: Can't play this song.";
    }
}

function togglePlayPause() {
    if (!audioPlayer.src) return; 
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}
