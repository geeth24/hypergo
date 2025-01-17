import express, { Request, Response, Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';

// Define interfaces
interface Shortcut {
  url: string;
  createdAt: string;
  clicks: number;
}

interface Shortcuts {
  [key: string]: Shortcut;
}

interface AddRedirectBody {
  shortcode: string;
  url: string;
}

const app = express();
const router = Router();

// Store shortcuts in memory
let shortcuts: Shortcuts = {};

async function loadShortcuts(): Promise<void> {
  try {
    const data = await fs.readFile(path.join(__dirname, '../shortcuts.json'), 'utf8');
    shortcuts = JSON.parse(data);
    console.log('Loaded shortcuts:', shortcuts);
  } catch (error) {
    shortcuts = {
      'firebase': {
        url: 'https://firebase.google.com',
        createdAt: new Date().toISOString(),
        clicks: 0
      },
      'appstore': {
        url: 'https://apps.apple.com',
        createdAt: new Date().toISOString(),
        clicks: 0
      }
    };
    await saveShortcuts();
  }
}

async function saveShortcuts(): Promise<void> {
  await fs.writeFile(
    path.join(__dirname, '../shortcuts.json'),
    JSON.stringify(shortcuts, null, 2)
  );
}

// Initialize
loadShortcuts();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

router.get('/shortcuts/:shortcode', async (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const shortcut = shortcuts[shortcode];
  
  if (shortcut) {
    shortcuts[shortcode].clicks++;
    await saveShortcuts();
    res.json({ url: shortcut.url });
  } else {
    res.status(404).json({ error: 'Shortcode not found' });
  }
});

router.post('/shortcuts', async (req: Request, res: Response) => {
  const { shortcode, url } = req.body as AddRedirectBody;
  
  if (!shortcode || !url) {
    return res.status(400).json({ error: 'Missing shortcode or url' });
  }

  try {
    shortcuts[shortcode] = {
      url,
      createdAt: new Date().toISOString(),
      clicks: 0
    };
    await saveShortcuts();
    res.status(201).json({ 
      message: 'Shortcut created',
      shortcut: shortcuts[shortcode]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/shortcuts', (_req: Request, res: Response) => {
  res.json(shortcuts);
});

router.get('/shortcuts/:shortcode/stats', (req: Request, res: Response) => {
  const { shortcode } = req.params;
  const shortcut = shortcuts[shortcode];
  
  if (shortcut) {
    res.json(shortcut);
  } else {
    res.status(404).json({ error: 'Shortcode not found' });
  }
});

// Use the router with /api prefix
app.use('/api', router);

const PORT = process.env.PORT || 8079;
const startServer = async () => {
  try {
    await app.listen(PORT);
    console.log(`✨ API Server running on port ${PORT}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      console.error(`⚠️  Port ${PORT} is in use. Trying ${Number(PORT) + 1}...`);
      process.env.PORT = String(Number(PORT) + 1);
      startServer();
    } else {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  }
};

startServer();

export default app;