// Yeh humara personal secretary hai (Final Version)

export default async function handler(request, response) {
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID is required' });
    }

    // Hum ek naye, zyada reliable server ka istemal kar rahe hain
    const invidiousInstance = "https://vid.puffyan.us";

    try {
        const apiResponse = await fetch(`${invidiousInstance}/api/v1/videos/${videoId}`);
        if (!apiResponse.ok) {
            throw new Error(`Failed to fetch from ${invidiousInstance}`);
        }
        const data = await apiResponse.json();

        // Sabse aachi quality wali audio stream dhoondho
        const audioStream = data.adaptiveFormats.find(
            (format) => format.type === "audio/webm" || format.type === "audio/mp4"
        );

        if (audioStream && audioStream.url) {
            // Kaam ho gaya, app ko stream ka URL bhej do
            response.status(200).json({ streamUrl: audioStream.url });
        } else {
            throw new Error('Audio stream not found in the response');
        }
    } catch (error) {
        console.error('Error in serverless function:', error);
        response.status(500).json({ error: 'Could not get audio stream. The service might be down.' });
    }
}
