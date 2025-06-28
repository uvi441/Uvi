// --- UVI APP - THE REAL BULLETPROOF PLAYER VERSION ---

// --- Step 1: HTML elements ko JavaScript mein pakadna ---
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const audioPlayer = document.getElementById('audio-player');
const playerThumbnail = document.getElementById('player-thumbnail');
const playerTitle = document.getElementById('player-title');
const playPauseButton = document.getElementById('play-pause-button');

// --- Step 2: API Key ---
const API_KEY = 'AIzaSyClC0bpP1RJkJD4FWFu8JqmillmOUBhegc'; // Aapki key yahan hai

// --- Step 3: Event Listeners (Buttons aur Player ke) ---
searchButton.addEventListener('click', () => searchSongs(searchInput.value));
playPauseButton.addEventListener('click', togglePlayPause);

audioPlayer.addEventListener('ended', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('playing', () => { playPauseButton.textContent = 'Pause'; });
audioPlayer.addEventListener('pause', () => { playPauseButton.textContent = 'Play'; });
audioPlayer.addEventListener('loadstart', () => { playPauseButton.textContent = '...'; playerTitle.textContent = "Loading..."; });
audioPlayer.addEventListener('error', () => { playerTitle.textContent = "Error: This audio can't be played."; playPauseButton.textContent = 'Play'; });


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
        resultsContainer.innerHTML = `<p class="placeholder-text">Error: ${error.message}. Check API Key.</p>`;
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
        songElement.innerHTML = `<img src="${song.snippet.thumbnails.default.url}" alt="t"><div class="song-item-info"><h4>${song.snippet.title.replace(/&/g, '&').replace(/"/g, '"')}</h4><p>${song.snippet.channelTitle}</p></div>`;
        songElement.addEventListener('click', () => playSong(song.id.videoId, song.snippet.title, song.snippet.thumbnails.high.url));
        resultsContainer.appendChild(songElement);
    });
}

// --- Step 6: Play Song Function (YAHAN BADLAV KIYA GAYA HAI) ---
async function playSong(videoId, title, thumbnailUrl) {
    playerTitle.textContent = title.replace(/&/g, '&').replace(/"/g, '"');
    playerThumbnail.src = thumbnailUrl;
    
    // HUM AB EK NAYI, BEHTAR SERVICE ISTEMAL KAR RAHE HAIN
    try {
        const response = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const data = await response.json();
        
        // Sabse aachi quality wali audio stream dhoondo
        const audioStream = data.audioStreams.find(s => s.mimeType === "audio/webm") || data.audioStreams[0];
        
        if (audioStream && audioStream.url) {
            audioPlayer.src = audioStream.url;
            audioPlayer.play();
        } else {
            throw new Error("No playable audio stream found.");
        }
    } catch (error) {
        console.error('Error playing song:', error);
        playerTitle.textContent = "Error: Can't play this song.";
    }
}

// --- Step 7: Play/Pause Toggle Function ---
function togglePlayPause() {
    if (!audioPlayer.src) return; // Agar koi gaana loaded nahi hai toh kuch mat karo
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}
