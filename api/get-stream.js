// --- SERVER WITH ITS OWN ENGINE (play-dl) ---

// Step 1: Engine ko import karna
const play = require('play-dl');

module.exports = async (req, res) => {
    // Step 2: Phone se videoId lena
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
    }

    try {
        // Step 3: Engine se direct stream maangna
        let stream = await play.stream(videoId, {
            discordPlayerCompatibility: true // Yeh behtar compatibility deta hai
        });

        // Step 4: Browser ko stream bhejna
        res.setHeader('Content-Type', stream.type);
        stream.stream.pipe(res);

    } catch (error) {
        console.error("play-dl error:", error);
        res.status(500).json({ error: "Failed to process the audio stream." });
    }
};
