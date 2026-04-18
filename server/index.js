import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Root route for health check and Render deployment validation
app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "VerseCanvas backend is running 🚀"
  });
});

app.get('/api/verse', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // Use bible-api.com
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(q)}`);
    if (!response.ok) {
      if (response.status === 404) {
         return res.status(404).json({ error: 'Verse not found' });
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format response
    res.json({
      reference: data.reference,
      text: data.text.trim(),
      translation: data.translation_id || 'WEB',
      verses: data.verses
    });
  } catch (error) {
    console.error('Error fetching verse:', error);
    res.status(500).json({ error: 'Failed to fetch verse data' });
  }
});

// Random verse endpoint ("Verse of the Day")
app.get('/api/verse/random', async (req, res) => {
  try {
    // There isn't a direct "random" endpoint on bible-api.com, so we'll pick a random popular verse
    const popularVerses = [
      'John 3:16', 'Jeremiah 29:11', 'Romans 8:28', 'Philippians 4:13', 
      'Genesis 1:1', 'Proverbs 3:5', 'Proverbs 3:6', 'Romans 12:2', 
      'Philippians 4:6', 'Matthew 28:19', 'Ephesians 2:8', 'Galatians 5:22',
      'Romans 8:38', 'Romans 8:39', 'John 14:6', 'Isaiah 41:10', 'Psalm 23:1'
    ];
    
    const randomReference = popularVerses[Math.floor(Math.random() * popularVerses.length)];
    
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(randomReference)}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({
      reference: data.reference,
      text: data.text.trim(),
      translation: data.translation_id || 'WEB',
      verses: data.verses
    });
  } catch (error) {
    console.error('Error fetching random verse:', error);
    res.status(500).json({ error: 'Failed to fetch random verse' });
  }
});

app.post('/api/verse/backgrounds', async (req, res) => {
  try {
    const CURATED_BACKGROUNDS = [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', // Nature
      'https://images.unsplash.com/photo-1513002749550-c59d220b8e42', // Sky
      'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4', // Cross
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', // Mountains
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Ocean sunset
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1', // Sunrise nature
      'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e', // Forest sunlight
      'https://images.unsplash.com/photo-1532274402911-5a36d10d14d0', // Hills
      'https://images.unsplash.com/photo-1511884641892-0f6695b1dc47', // Stars
      'https://images.unsplash.com/photo-1494548162464-71912852a514', // Cloudy mountain
      'https://images.unsplash.com/photo-1444464666168-e314d3a2416b', // Serene lake
      'https://images.unsplash.com/photo-1507608616769-83861298415d', // Aesthetic clouds
      'https://images.unsplash.com/photo-1436891620584-47fd0e565afb', // Open road / Journey
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', // Green valley
    ];

    // Shuffle and pick 4
    const shuffled = [...CURATED_BACKGROUNDS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4).map(url => `${url}?auto=format&fit=crop&q=80&w=800&h=1000`);

    // Add a tiny delay to simulate network so the loading spinner shows briefly (looks premium)
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({ backgrounds: selected });
  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    res.status(500).json({ error: 'Failed to fetch backgrounds' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
