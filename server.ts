import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();

// Enable CORS for all origins (vital for static deployments like GitHub Pages)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'daddy2026';
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

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
    id: 'item-pix-livre',
    title: 'CONTRIBUIÇÃO PIX (VALOR LIVRE)',
    subtitle: 'Ajude os papais a comprarem o que as gêmeas mais precisam para o inverno.',
    description: 'A melhor opção! Como o inverno está chegando e espaço na mala é limitado, o PIX nos permite comprar roupinhas térmicas, casacos e itens no tamanho exato delas.',
    price: 'Qualquer valor com carinho • Chave PIX',
    category: 'PIX & Inverno',
    iconName: 'Sparkles',
    isReserved: false
  },
  {
    id: 'item-pix-patrulha',
    title: 'PIX MIMINHO PATRULHA CANINA',
    subtitle: 'Para um presentinho especial da Skye & Everest que elas escolherem!',
    description: 'Contribuição para brinquedos e livrinhos temáticos que elas mesmas possam escolher.',
    price: 'R$ 30, R$ 50 ou quanto desejar • PIX',
    category: 'PIX & Inverno',
    iconName: 'Heart',
    isReserved: false
  },
  {
    id: 'item-roupas-inverno',
    title: 'ROUPINHAS DE INVERNO INFANTIS',
    subtitle: 'O inverno está chegando! Casacos, meias quentinhas e peças térmicas.',
    description: 'Conjuntinhos quentinhos, blusas de frio, pijamas felpudos ou jaquetinhas infantis.',
    price: 'Tamanho infantil confortável',
    category: 'Inverno & Conforto',
    iconName: 'Shirt',
    isReserved: false
  },
  {
    id: 'item-livros-historinhas',
    title: 'LIVRINHOS DE HISTÓRIAS & ATIVIDADES',
    subtitle: 'Historinhas para antes de dormir, livros de colorir e adesivos.',
    description: 'Leves e perfeitos para a imaginação das meninas. Elas amam historinhas ilustradas e livrinhos com adesivos!',
    price: 'Item compacto • Fácil de levar',
    category: 'Leitura & Criatividade',
    iconName: 'BookOpen',
    isReserved: false
  },
  {
    id: 'item-acessorios-cabelo',
    title: 'LAÇOS & ACESSÓRIOS DE CABELO',
    subtitle: 'Laços cor-de-rosa, presilhas e tiaras fofas para as duas!',
    description: 'Pequenos, fofos e muito úteis no dia a dia das gêmeas.',
    price: 'Lembrancinha compacta',
    category: 'Mimos & Acessórios',
    iconName: 'Sparkles',
    isReserved: false
  },
  {
    id: 'item-lego-jogos',
    title: 'MINI JOGOS / QUEBRA-CABEÇA INFANTIL',
    subtitle: 'Jogos educativos compactos ou quebra-cabeças infantis.',
    description: 'Quebra-cabeças educativos, jogos de memória ou bloquinhos de montar compactos.',
    price: 'Item pequeno e educativo',
    category: 'Brincadeiras & Aprendizado',
    iconName: 'Puzzle',
    isReserved: false
  },
  {
    id: 'item-calcados-inverno',
    title: 'MEIAS TÉRMICAS / PANTUFAS (TAM. 25/26)',
    subtitle: 'Para manter os pezinhos aquecidos nos dias mais frios.',
    description: 'Meias antiderrapantes, meinhas térmicas ou pantufinhas macias e quentes.',
    price: 'Tamanho calçado 25/26',
    category: 'Inverno & Conforto',
    iconName: 'Shield',
    isReserved: false
  },
  {
    id: 'item-lembranca-afeto',
    title: 'CARTINHA COM DESENHO OU MENSAGEM',
    subtitle: 'O carinho e a presença de vocês é o nosso maior presente!',
    description: 'Um abraço apertado e uma mensagem cheia de amor para guardarmos de recordação.',
    price: 'Inestimável • Muito amor',
    category: 'Carinho & Afeto',
    iconName: 'Gift',
    isReserved: false
  }
];

// Initial RSVPs: strictly start empty - only real guests who RSVP are displayed
const DEFAULT_RSVPS: RsvpRecord[] = [];

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

// Passwords accepted for executive admin access
const VALID_ADMIN_PASSWORDS = Array.from(
  new Set([process.env.ADMIN_PASSWORD, 'daddy2026', 'Dupa1989%'].filter(Boolean) as string[])
);

function isAuthorizedAdmin(password?: string): boolean {
  if (!password) return false;
  const trimmed = password.trim();
  return VALID_ADMIN_PASSWORDS.some(valid => valid === trimmed);
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

  if (suppliedPassword && isAuthorizedAdmin(suppliedPassword)) {
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
    message: 'Presença confirmada com sucesso para o aniversário de Ada e Gabi!',
    rsvp: newRsvp
  });
});

// 2. Public RSVP stats summary + Confirmed Attendees Roll Call
app.get('/api/rsvps/public-stats', (req: Request, res: Response) => {
  const db = getDb();
  const yesRsvps = db.rsvps.filter(r => r.status === 'YES');
  const maybeRsvps = db.rsvps.filter(r => r.status === 'MAYBE');
  const totalHeadcount = yesRsvps.reduce((acc, curr) => acc + curr.guestCount, 0);

  const confirmedAttendees = yesRsvps.map(r => ({
    id: r.id,
    name: r.name,
    guestCount: r.guestCount,
    message: r.message,
    createdAt: r.createdAt
  }));

  const maybeAttendees = maybeRsvps.map(r => ({
    id: r.id,
    name: r.name,
    guestCount: r.guestCount,
    message: r.message,
    createdAt: r.createdAt
  }));

  return res.json({
    totalRsvps: db.rsvps.length,
    attendingCount: yesRsvps.length,
    totalHeadcount,
    maybeCount: maybeRsvps.length,
    noCount: db.rsvps.filter(r => r.status === 'NO').length,
    confirmedAttendees,
    maybeAttendees
  });
});

// 2b. Public Confirmed Attendees Roster Endpoint
app.get('/api/rsvps/confirmed', (req: Request, res: Response) => {
  const db = getDb();
  const yesRsvps = db.rsvps.filter(r => r.status === 'YES');
  const totalHeadcount = yesRsvps.reduce((acc, curr) => acc + curr.guestCount, 0);

  return res.json({
    totalHeadcount,
    attendingCount: yesRsvps.length,
    attendees: yesRsvps.map(r => ({
      id: r.id,
      name: r.name,
      guestCount: r.guestCount,
      message: r.message,
      createdAt: r.createdAt
    }))
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

// 4b. Get Twins Real Photos (Public)
app.get('/api/photos', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(PHOTOS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf-8'));
      return res.json({ success: true, photos: data });
    }
  } catch (err) {
    console.error('Error reading photos.json:', err);
  }
  return res.json({ success: true, photos: null });
});

// 4c. Save Twins Real Photos (Public/Admin sync)
app.post('/api/photos', (req: Request, res: Response) => {
  try {
    const { photoAda, photoGabi, photoJoint, photoViewMode } = req.body;
    let existing: Record<string, any> = {};
    if (fs.existsSync(PHOTOS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf-8'));
      } catch {}
    }
    const payload = {
      ...existing,
      photoAda: photoAda !== undefined ? photoAda : existing.photoAda || null,
      photoGabi: photoGabi !== undefined ? photoGabi : existing.photoGabi || null,
      photoJoint: photoJoint !== undefined ? photoJoint : existing.photoJoint || null,
      photoViewMode: photoViewMode || existing.photoViewMode || 'individual',
      updatedAt: new Date().toISOString()
    };
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return res.json({ success: true, photos: payload });
  } catch (err) {
    console.error('Error saving photos:', err);
    return res.status(500).json({ error: 'Failed to save photos' });
  }
});

// 5. Admin Login Verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }
  if (isAuthorizedAdmin(password)) {
    return res.json({
      success: true,
      message: 'Acesso liberado ao painel dos pais',
      token: password.trim() // Safe session token representation for demo
    });
  }
  return res.status(401).json({ error: 'Senha de administrador incorreta' });
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

// 10b. Admin Clear All RSVPs & Reset Wishlist (100% clean)
app.post('/api/admin/clear-all', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  db.rsvps = [];
  db.wishlist = DEFAULT_WISHLIST.map(item => ({ ...item, isReserved: false }));
  saveDb(db);
  return res.json({ success: true, message: 'Backend completamente limpo (100%)' });
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
  res.setHeader('Content-Disposition', 'attachment; filename="ada-e-gabi-rsvps.csv"');
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
    console.log(`🐾 Convite Ada & Gabi rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
