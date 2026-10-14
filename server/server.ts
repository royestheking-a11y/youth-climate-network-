import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import apiRoutes from './routes/api';
import { RobotsConfig } from './models';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
connectDB();

// Serve dynamic robots.txt at website root
app.get('/robots.txt', async (req, res) => {
  try {
    const config = await RobotsConfig.findOne().lean();
    res.type('text/plain');
    if (config?.content) {
      return res.send(config.content);
    }
    const fallbackPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(fallbackPath)) {
      return res.send(fs.readFileSync(fallbackPath, 'utf-8'));
    }
    res.send("User-agent: *\nAllow: /\n\nSitemap: https://ycnbd.org/sitemap.xml");
  } catch (e) {
    res.type('text/plain').send("User-agent: *\nAllow: /\n\nSitemap: https://ycnbd.org/sitemap.xml");
  }
});

// Routes
app.use('/api', apiRoutes);

app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Self-ping system to prevent Render from sleeping
  const pingUrl = process.env.RENDER_EXTERNAL_URL 
    ? `${process.env.RENDER_EXTERNAL_URL}/ping` 
    : `http://localhost:${PORT}/ping`;
    
  const pingInterval = 10 * 60 * 1000; // 10 minutes
  
  setInterval(async () => {
    console.log(`Sending self-ping to ${pingUrl}`);
    try {
      const response = await fetch(pingUrl);
      if (!response.ok) {
        console.error(`Self-ping failed with status: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Self-ping failed:', err.message);
    }
  }, pingInterval);
});
