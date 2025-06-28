// Yeh humara personal secretary hai (The FINAL version)

export default async function handler(request, response) {
    const { videoId } = request.query;

    if (!videoId) {
        return response.status(400).json({ error: 'Video ID is required' });
    }

    // Humne ek naya, aur bhi reliable server ka address daala hai
    const invidiousInstance = "https://invidious.slipfox.xyz"; 

    try {
        const apiResponse = await fetch(`${invidiousInstance}/api/v1/videos/${videoId}`);
        if (!apiResponse.ok) {
            // Agar yeh server bhi fail ho, toh error message bhej do
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
        // Koi bhi error ho, yahan pakad lo
        console.error('Error in serverless function:', error);
        response.status(500).json({ error: 'Could not get audio stream. The service might be down.' });
    }
}
