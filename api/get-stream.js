// Yeh humari apni khud ki service hai
import ytdl from 'ytdl-core';

export default async function handler(request, response) {
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID is required' });
    }

    try {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // ytdl-core tool ka istemal karke video ki info nikalna
        const info = await ytdl.getInfo(youtubeUrl);
        
        // Sirf audio wale formats ko filter karna
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        
        // Sabse aachi quality wali audio lena
        const bestAudio = audioFormats.sort((a, b) => b.bitrate - a.bitrate)[0];

        if (bestAudio && bestAudio.url) {
            // Kaam ho gaya, app ko audio ka link bhej do
            response.status(200).json({ streamUrl: bestAudio.url });
        } else {
            throw new Error('No audio formats found for this video.');
        }
    } catch (error) {
        console.error('YTDL-CORE aError:', error);
        response.status(500).json({ error: 'Failed to get audio stream using ytdl-core.' });
    }
}
