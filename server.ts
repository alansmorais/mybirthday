import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daddy2026';
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface types
interface RsvpRecord {
  id: string;
  status: 'YES' | 'MAYBE' | 'NO';
  name: string;
  guestCount: number;
  message: string;
  createdAt: string;
  checkedIn: boolean;
}

interface WishlistRecord {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  category: string;
  iconName: string;
  isReserved: boolean;
  reservedAt?: string;
}

interface DatabaseSchema {
  rsvps: RsvpRecord[];
  wishlist: WishlistRecord[];
}

const DEFAULT_WISHLIST: WishlistRecord[] = [
  {
    id: 'item-1',
    title: 'JACK REACHER / LEE CHILD',
    subtitle: 'Especially Killing Floor or any gripping Reacher paperback.',
    description: 'Paperback preferred for comfortable reading during quiet hours.',
    price: 'Approx. 30–60 zł • Paperback preferred',
    category: 'Literature',
    iconName: 'BookOpen',
    isReserved: false
  },
  {
    id: 'item-2',
    title: 'GUITAR TUNER',
    subtitle: 'Clip-on acoustic/electric chromatic tuner (e.g. Snark, TC Electronic, Boss).',
    description: 'Keep the riffs in tune without disturbing the neighbours.',
    price: 'Approx. 30–100 zł',
    category: 'Music Gear',
    iconName: 'Music',
    isReserved: false
  },
  {
    id: 'item-3',
    title: 'EDC / FOLDING KNIFE',
    subtitle: 'Classy pocket knife (Opinel No. 8, Victorinox Swiss Army, or sleek EDC folder).',
    description: 'Essential gentleman everyday carry for opening packages and artisanal cheese.',
    price: 'Approx. 50–150 zł',
    category: 'EDC & Utility',
    iconName: 'ShieldAlert',
    isReserved: false
  },
  {
    id: 'item-4',
    title: 'KNIFE SHARPENING GEAR',
    subtitle: 'Whetstone (1000/6000 grit), leather strop, or ceramic honing rod.',
    description: 'For that razor-sharp satisfying edge maintenance.',
    price: 'Approx. 30–150 zł',
    category: 'Craft & Maintenance',
    iconName: 'Sparkles',
    isReserved: false
  },
  {
    id: 'item-5',
    title: 'PUZZLES & BRAIN TEASERS',
    subtitle: 'Cast metal Hanayama puzzle, wooden Japanese secret puzzle box, or mechanical teaser.',
    description: 'Tactile mental gymnastics while pretending to listen on Zoom calls.',
    price: 'Approx. 30–150 zł',
    category: 'Puzzles & Novelties',
    iconName: 'Puzzle',
    isReserved: false
  },
  {
    id: 'item-6',
    title: 'DISCREET NOVELTY / ADULT ACCESSORIES',
    subtitle: 'Tasteful, cheeky, adult-appropriate intrigue. Surprise Daddy responsibly.',
    description: 'Discretion guaranteed. No questions asked.',
    price: 'Approx. 30–150 zł • Discretion guaranteed',
    category: 'Adult Cheeky',
    iconName: 'Flame',
    isReserved: false
  },
  {
    id: 'item-7',
    title: 'BOOK — SURPRISE ME',
    subtitle: 'History, biography, philosophy, espionage, or grim darkly funny fiction.',
    description: 'Feed Daddy’s voracious curiosity with a thoughtful, unexpected read.',
    price: 'Approx. 30–100 zł',
    category: 'Literature',
    iconName: 'BookMarked',
    isReserved: false
  },
  {
    id: 'item-8',
    title: 'SURPRISE DADDY',
    subtitle: 'Whisky miniature, fine ground coffee beans, or something completely absurd.',
    description: 'Let your creativity run wild with something memorable.',
    price: 'Any amount',
    category: 'Wildcard',
    iconName: 'Gift',
    isReserved: false
  }
];

const DEFAULT_RSVPS: RsvpRecord[] = [
  {
    id: 'rsvp-1',
    status: 'YES',
    name: 'Kasia & Mateusz',
    guestCount: 2,
    message: 'Bringing the best craft IPA from Warsaw. Happy 30+!',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    checkedIn: true
  },
  {
    id: 'rsvp-2',
    status: 'YES',
    name: 'Viktor K.',
    guestCount: 1,
    message: 'Will definitely look like I have my life together.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    checkedIn: false
  },
  {
    id: 'rsvp-3',
    status: 'MAYBE',
    name: 'Anna & Friends',
    guestCount: 2,
    message: 'Negotiating the train schedule from Wrocław. High probability!',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    checkedIn: false
  },
  {
    id: 'rsvp-4',
    status: 'YES',
    name: 'Tomek (The Architect)',
    guestCount: 1,
    message: 'Third beer milestone is where the real philosophy begins.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    checkedIn: false
  }
];

// Helper to ensure database file exists
function getDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        rsvps: DEFAULT_RSVPS,
        wishlist: DEFAULT_WISHLIST
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return { rsvps: DEFAULT_RSVPS, wishlist: DEFAULT_WISHLIST };
  }
}

function saveDb(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

// Authentication middleware for admin routes
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const customPass = req.headers['x-admin-password'];
  
  let suppliedPassword = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    suppliedPassword = authHeader.slice(7).trim();
  } else if (typeof customPass === 'string') {
    suppliedPassword = customPass.trim();
  } else if (typeof req.query.password === 'string') {
    suppliedPassword = req.query.password.trim();
  }

  if (suppliedPassword && suppliedPassword === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
}

// ================= API ROUTES =================

// 1. Submit RSVP (Public)
app.post('/api/rsvp', (req: Request, res: Response) => {
  const { status, name, guestCount, message } = req.body;
  if (!status || !name) {
    return res.status(400).json({ error: 'Status and name are required' });
  }

  const db = getDb();
  const newRsvp: RsvpRecord = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: status as 'YES' | 'MAYBE' | 'NO',
    name: String(name).trim(),
    guestCount: Math.max(1, Number(guestCount) || 1),
    message: String(message || '').trim(),
    createdAt: new Date().toISOString(),
    checkedIn: false
  };

  db.rsvps.unshift(newRsvp);
  saveDb(db);

  return res.status(201).json({
    success: true,
    message: 'Protocol successfully registered with Daddy!',
    rsvp: newRsvp
  });
});

// 2. Public RSVP stats summary (Count only, no personal data)
app.get('/api/rsvps/public-stats', (req: Request, res: Response) => {
  const db = getDb();
  const yesRsvps = db.rsvps.filter(r => r.status === 'YES');
  const totalHeadcount = yesRsvps.reduce((acc, curr) => acc + curr.guestCount, 0);

  return res.json({
    totalRsvps: db.rsvps.length,
    attendingCount: yesRsvps.length,
    totalHeadcount,
    maybeCount: db.rsvps.filter(r => r.status === 'MAYBE').length,
    noCount: db.rsvps.filter(r => r.status === 'NO').length
  });
});

// 3. Wishlist List (Public, anonymous reservation status)
app.get('/api/wishlist', (req: Request, res: Response) => {
  const db = getDb();
  // Return wishlist without identifying data
  const publicWishlist = db.wishlist.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    price: item.price,
    category: item.category,
    iconName: item.iconName,
    isReserved: !!item.isReserved
  }));
  return res.json(publicWishlist);
});

// 4. Reserve or Unreserve Wishlist Item (Public, zero-knowledge)
app.post('/api/wishlist/:id/reserve', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const itemIndex = db.wishlist.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Wishlist item not found' });
  }

  const item = db.wishlist[itemIndex];
  // Toggle reservation
  const willBeReserved = !item.isReserved;
  item.isReserved = willBeReserved;
  item.reservedAt = willBeReserved ? new Date().toISOString() : undefined;

  saveDb(db);
  return res.json({
    success: true,
    id: item.id,
    isReserved: item.isReserved,
    message: willBeReserved ? 'Item reserved anonymously!' : 'Item unreserved'
  });
});

// 5. Admin Login Verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Access granted to Daddy\'s executive vault',
      token: password // Safe session token representation for demo
    });
  }
  return res.status(401).json({ error: 'Incorrect backend admin password' });
});

// 6. Admin Get All Registrations & Full Stats
app.get('/api/admin/rsvps', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const yesRsvps = db.rsvps.filter(r => r.status === 'YES');
  const maybeRsvps = db.rsvps.filter(r => r.status === 'MAYBE');
  const noRsvps = db.rsvps.filter(r => r.status === 'NO');

  const stats = {
    totalRsvps: db.rsvps.length,
    totalHeadcount: yesRsvps.reduce((acc, curr) => acc + curr.guestCount, 0),
    yesCount: yesRsvps.length,
    yesHeadcount: yesRsvps.reduce((acc, curr) => acc + curr.guestCount, 0),
    maybeCount: maybeRsvps.length,
    noCount: noRsvps.length,
    reservedWishlistCount: db.wishlist.filter(w => w.isReserved).length,
    totalWishlistCount: db.wishlist.length
  };

  return res.json({
    stats,
    rsvps: db.rsvps,
    wishlist: db.wishlist
  });
});

// 7. Admin Add Manual RSVP
app.post('/api/admin/rsvps', requireAdmin, (req: Request, res: Response) => {
  const { status, name, guestCount, message, checkedIn } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const db = getDb();
  const newRsvp: RsvpRecord = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: (status || 'YES') as 'YES' | 'MAYBE' | 'NO',
    name: String(name).trim(),
    guestCount: Math.max(1, Number(guestCount) || 1),
    message: String(message || '').trim(),
    createdAt: new Date().toISOString(),
    checkedIn: Boolean(checkedIn)
  };

  db.rsvps.unshift(newRsvp);
  saveDb(db);
  return res.status(201).json({ success: true, rsvp: newRsvp });
});

// 8. Admin Update RSVP (Status, Check-in, Notes)
app.patch('/api/admin/rsvps/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, name, guestCount, message, checkedIn } = req.body;
  const db = getDb();
  const index = db.rsvps.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'RSVP not found' });
  }

  if (status !== undefined) db.rsvps[index].status = status;
  if (name !== undefined) db.rsvps[index].name = name;
  if (guestCount !== undefined) db.rsvps[index].guestCount = Math.max(1, Number(guestCount));
  if (message !== undefined) db.rsvps[index].message = message;
  if (checkedIn !== undefined) db.rsvps[index].checkedIn = Boolean(checkedIn);

  saveDb(db);
  return res.json({ success: true, rsvp: db.rsvps[index] });
});

// 9. Admin Delete RSVP
app.delete('/api/admin/rsvps/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.rsvps.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'RSVP not found' });
  }

  const removed = db.rsvps.splice(index, 1)[0];
  saveDb(db);
  return res.json({ success: true, removed });
});

// 10. Admin Reset Wishlist
app.post('/api/admin/wishlist/reset', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  db.wishlist = DEFAULT_WISHLIST.map(item => ({ ...item, isReserved: false }));
  saveDb(db);
  return res.json({ success: true, wishlist: db.wishlist });
});

// 11. Admin Export to CSV
app.get('/api/admin/export/csv', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const headers = ['ID', 'Name', 'Status', 'Guest Count', 'Checked In', 'Message', 'Created At'];
  const rows = db.rsvps.map(r => [
    r.id,
    `"${r.name.replace(/"/g, '""')}"`,
    r.status,
    r.guestCount,
    r.checkedIn ? 'YES' : 'NO',
    `"${r.message.replace(/"/g, '""')}"`,
    r.createdAt
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="alans-30plus-rsvps.csv"');
  return res.send(csvContent);
});

// ================= VITE / STATIC SERVING =================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎂 Alan's Birthday Portal running on http://0.0.0.0:${PORT}`);
    console.log(`🔐 Admin Password: ${ADMIN_PASSWORD}`);
  });
}

startServer();
