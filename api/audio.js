const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  try {
    const videoId = req.query.videoId;
    if (!videoId) {
      return res.status(400).send("Video ID is required");
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    res.setHeader('Content-Type', 'audio/mpeg');
    ytdl(videoUrl, { format: audioFormat }).pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch audio stream.");
  }
};
