// Yeh humara personal secretary (Serverless Function) hai

export default async function handler(request, response) {
    // 1. App se videoId lena
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID is required' });
    }

    try {
        // 2. Parde ke peeche se Invidious service ko call karna
        const apiResponse = await fetch(`https://invidious.io.projectsegfau.lt/api/v1/videos/${videoId}`);
        if (!apiResponse.ok) {
            throw new Error('Failed to fetch from Invidious API');
        }
        const data = await apiResponse.json();

        // 3. Audio stream ka URL dhoondhna
        const audioStream = data.adaptiveFormats.find(
            (format) => format.type === "audio/webm"
        );

        if (audioStream && audioStream.url) {
            // 4. Agar URL mil gaya, toh app ko wapas bhej dena
            response.status(200).json({ streamUrl: audioStream.url });
        } else {
            throw new Error('Audio stream not found');
        }
    } catch (error) {
        console.error('Error in serverless function:', error);
        response.status(500).json({ error: 'Could not get audio stream.' });
    }
}
