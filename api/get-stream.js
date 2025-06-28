// Yeh humari 100% powerful service hai (Streaming Version)
import play from 'play-dl';

export default async function handler(request, response) {
    try {
        const { videoId } = request.query;

        if (!videoId) {
            return response.status(400).send('Video ID is required');
        }

        // play-dl tool se video ki stream banana
        const stream = await play.stream(videoId, {
            quality: 1, // 0: low, 1: medium, 2: high
            discordPlayerCompatibility: true // Compatibility badhane ke liye
        });

        // Browser ko batana ki audio aa raha hai
        response.setHeader('Content-Type', stream.type);
        response.setHeader('Cache-Control', 'no-cache');

        // Pipe se stream ko direct browser mein bhejna
        stream.stream.pipe(response);

    } catch (error) {
        console.error('STREAMING SERVICE ERROR:', error);
        // Agar koi bhi error aaye, toh browser ko batao
        response.status(500).send('Failed to stream audio.');
    }
}
