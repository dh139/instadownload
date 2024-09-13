const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'Instagram URL is required.' });
    }

    const apiUrl = `https://instagram-media-downloader.p.rapidapi.com/rapid/post.php?url=${encodeURIComponent(url)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '97f843834cmshffef70e99794447p1a0af3jsna7e233f003b6',  // Replace with your actual key
            'x-rapidapi-host': 'instagram-media-downloader.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const result = await response.json();

        console.log('API Response:', result); // Log the API response

        if (result && result.video) {
            res.json({ success: true, mediaUrl: result.video });
        } else {
            res.status(404).json({ success: false, message: 'Failed to retrieve media.' });
        }
    } catch (error) {
        console.error('Error fetching Instagram media:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
