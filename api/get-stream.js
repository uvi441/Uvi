// Yeh file Vercel ke SERVER par chalegi, phone par nahi.

export default async function handler(req, res) {
    // Step 1: Phone se videoId lena
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
    }

    // Step 2: Wahi "Tank" wali logic server par chalana
    const audioProxies = [
        `https://pipedapi.kavin.rocks/streams/${videoId}`,
        `https://pipedapi.in.projectsegfau.lt/streams/${videoId}`
    ];

    let streamUrl = null;

    for (const proxyUrl of audioProxies) {
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) continue; // Agar response theek nahi, agla try karo

            const data = await response.json();

            if (data && data.audioStreams && data.audioStreams.length > 0) {
                const audioStream = data.audioStreams.find(s => s.mimeType === "audio/webm") || data.audioStreams[0];
                if (audioStream && audioStream.url) {
                    streamUrl = audioStream.url;
                    break; // URL mil gaya, loop band karo
                }
            }
        } catch (error) {
            // Ek service fail hui, aage badho
        }
    }

    // Step 3: Phone ko final URL bhejna
    if (streamUrl) {
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({ streamUrl: streamUrl });
    } else {
        res.status(500).json({ error: "All proxies failed to fetch the audio stream." });
    }
}
