// Yeh humari final service hai - Ek poora web server
import http from 'http';
import url from 'url';
import play from 'play-dl';

// Render humein batayega ki kis port par darwaza kholna hai
const PORT = process.env.PORT || 10000;

const server = http.createServer(async (req, res) => {
    // CORS headers taaki Vercel se request aa sake
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const { videoId } = parsedUrl.query;

    if (!videoId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Video ID is required' }));
        return;
    }

    try {
        const stream = await play.stream(videoId, { quality: 1 });
        res.writeHead(200, { 'Content-Type': stream.type });
        stream.stream.pipe(res);
    } catch (error) {
        console.error('STREAMING ERROR:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to stream audio.' }));
    }
});

// Server ko bolo ki darwaza (port) khol kar sunna shuru kare
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on port ${PORT}`);
});
