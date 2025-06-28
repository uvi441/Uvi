// --- UVI APP - THE BULLETPROOF PLAYER VERSION ---

// --- Step 1: HTML elements ko JavaScript mein pakadna ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playPauseButton = document.getElementById('play-pause-button');

// --- Step 2: API Key ---
const API_KEY = 'AIzaSyClC0bpP1RJkJD4FWFu8JqmillmOUBhegc';

// --- Step 3: Event Listeners ---
searchButton.addEventListener('click', () => searchSongs(searchInput.value));
playPauseButton.addEventListener('click', togglePlayPause);

// Player ke events ko handle karna
audioPlayer.addEventListener('ended', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('playing', () => { playPauseButton.textContent = 'Pause'; });
audioPlayer.addEventListener('pause', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('loadstart', () => { playPauseButton.textContent = '...'; playerTitle.textContent = "Loading..."; });
audioPlayer.addEventListener('error', () => { playerTitle.textContent = "Error: Failed to load audio."; });


// NAYA, ZYADA RELIABLE TAREEKA: JAB BROWSER TAIYAAR HO, TABHI PLAY KARO
audioPlayer.addEventListener('canplay', () => {
    audioPlayer.play();
});


// --- Step 4: Search Function ---
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
        resultsContainer.innerHTML = `<p class="placeholder-text">Error: ${error.message}</p>`;
    }
}

// --- Step 5: Display Results ---
function displayResults(songs) {
    resultsContainer.innerHTML = '';
    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">No results found.</p>';
        return;
    }
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `<img src="${song.snippet.thumbnails.default.url}" alt="t"><div class="song-item-info"><h4>${song.snippet.title.replace(/&/g, '&')}</h4><p>${song.snippet.channelTitle}</p></div>`;
        songElement.addEventListener('click', () => playSong(song.id.videoId, song.snippet.title, song.snippet.thumbnails.high.url));
        resultsContainer.appendChild(songElement);
    });
}

// --- Step 6: Play Song Function ---
function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = title;
    playerThumbnail.src = thumbnailUrl;

    // Reliable public proxy
    const audioSource = `https://yt-stream.koneko.workers.dev/stream/${videoId}`;
    
    // Sirf source set karo aur browser ko load karne do.
    audioPlayer.src = audioSource;
    audioPlayer.load(); // Browser ko bolo ki naya gaana load karna shuru kare
}

// --- Step 7: Play/Pause Toggle ---
function togglePlayPause() {
    if (!audioPlayer.src) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}
