// --- Step 1: HTML elements ko JavaScript mein pakadna ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playPauseButton = document.getElementById('play-pause-button');

// --- Step 2: API Key ---
// YAHAN PAR APNI KEY DAALEIN
const API_KEY = 'AIzaSyClC0bpP1RJkJD4FWFu8JqmillmOUBhegc';

// --- Functions ---

// Search function (Ismein koi badlaav nahi)
async function searchSongs(query) {
    resultsContainer.innerHTML = '<p class="placeholder-text">Searching...</p>';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoCategoryId=10&key=${API_KEY}&maxResults=20`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        resultsContainer.innerHTML = '<p class="placeholder-text">Error! Check API Key.</p>';
    }
}

// Display results function (Ismein koi badlaav nahi)
function displayResults(songs) {
    resultsContainer.innerHTML = '';
    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">No songs found.</p>';
        return;
    }
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `<img src="${song.snippet.thumbnails.default.url}" alt="thumbnail"><div class="song-item-info"><h4>${song.snippet.title.replace(/&/g, '&')}</h4><p>${song.snippet.channelTitle}</p></div>`;
        songElement.addEventListener('click', () => {
            playSong(song.id.videoId, song.snippet.title, song.snippet.thumbnails.high.url);
        });
        resultsContainer.appendChild(songElement);
    });
}

// Play song function (NEW and FINAL VERSION)
function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = title.replace(/&/g, '&');
    playerThumbnail.src = thumbnailUrl;
    playPauseButton.textContent = 'Pause';
    
    // Direct stream ka link banana
    // Yeh humari 100% powerful service ko call karega
    audioPlayer.src = `/api/get-stream?videoId=${videoId}`;
    audioPlayer.play();
}


// --- Event Listeners (Inmein koi badlaav nahi) ---
searchButton.addEventListener('click', () => {
    if (searchInput.value) searchSongs(searchInput.value);
});

playPauseButton.addEventListener('click', () => {
    if (audioPlayer.src) {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    }
});

// Gaana play hone par button ka text badlo
audioPlayer.addEventListener('playing', () => {
    playPauseButton.textContent = 'Pause';
});

// Gaana pause hone par button ka text badlo
audioPlayer.addEventListener('pause', () => {
    playPauseButton.textContent = 'Play';
});

// Gaana khatam hone par button ka text badlo
audioPlayer.addEventListener('ended', () => {
    playPauseButton.textContent = 'Play';
});
