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

// Play song function (YAHAN NAYA LOGIC HAI)
async function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = "Loading...";
    playerThumbnail.src = thumbnailUrl;
    playPauseButton.textContent = '...';

    try {
        // Apne secretary (/api/get-stream) ko call kar rahe hain
        const response = await fetch(`/api/get-stream?videoId=${videoId}`);
        const data = await response.json();

        if (data.streamUrl) {
            audioPlayer.src = data.streamUrl;
            audioPlayer.play();
            playerTitle.textContent = title.replace(/&/g, '&');
            playPauseButton.textContent = 'Pause';
        } else {
            playerTitle.textContent = 'Could not play song.';
        }
    } catch (error) {
        playerTitle.textContent = 'Error. Please try another song.';
    }
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

audioPlayer.addEventListener('ended', () => { playPauseButton.textContent = 'Play'; });
