// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Expose raw JSON for dashboard fetching
// app.use('/api', express.static(path.join(__dirname)));

// Log incoming API requests for debugging proxy
app.use('/api', (req, res, next) => {
  console.log(`→ Express reçu: ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = 4000;

// GET /api/products → renvoie tout products.json
app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.json'));
});

// GET /api/products/:id → renvoie un produit ou 404
app.get('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8'));
  const prod = products.find(p => p.id === +req.params.id);
  if (prod) res.json(prod);
  else res.status(404).json({ error: 'Produit non trouvé' });
});

// PUT /api/products/:id → met à jour un produit dans products.json
app.put('/api/products/:id', (req, res) => {
  const filePath = path.join(__dirname, 'products.json');
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = products.findIndex(p => p.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé' });

  products[idx] = { ...products[idx], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  res.json(products[idx]);
});

// GET /api/carousel → renvoie la configuration du carrousel
app.get('/api/carousel', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  // Pour s'assurer de toujours renvoyer la version à jour
  res.set('Cache-Control', 'no-store');
  res.json(carousel);
});


// PUT /api/carousel/:product_id → met à jour l’ordre dans carousel.json
app.put('/api/carousel/:product_id', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = carousel.findIndex(item => item.product_id === +req.params.product_id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Carousel item not found' });
  }
  // Mise à jour de l'ordre
  carousel[idx].order = req.body.order;
  fs.writeFileSync(filePath, JSON.stringify(carousel, null, 2), 'utf-8');
  res.json(carousel[idx]);
});

// GET /api/services → renvoie tout services.json
app.get('/api/services', (req, res) => {
  const filePath = path.join(__dirname, 'services.json');
  const services = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.set('Cache-Control', 'no-store');
  res.json(services);
});

// POST /api/services → ajoute un nouveau service
app.post('/api/services', (req, res) => {
  const filePath = path.join(__dirname, 'services.json');
  const services = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  services.push(req.body);
  fs.writeFileSync(filePath, JSON.stringify(services, null, 2), 'utf-8');
  res.status(201).json(req.body);
});

// PUT /api/services/:key → met à jour un service existant par sa clé
app.put('/api/services/:key', (req, res) => {
  const filePath = path.join(__dirname, 'services.json');
  const services = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = services.findIndex(s => s.key === req.params.key);
  if (idx === -1) return res.status(404).json({ error: 'Service non trouvé' });
  services[idx] = { ...services[idx], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(services, null, 2), 'utf-8');
  res.json(services[idx]);
});

// DELETE /api/services/:key → supprime un service par sa clé
app.delete('/api/services/:key', (req, res) => {
  const filePath = path.join(__dirname, 'services.json');
  let services = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  services = services.filter(s => s.key !== req.params.key);
  fs.writeFileSync(filePath, JSON.stringify(services, null, 2), 'utf-8');
  res.status(204).end();
});

// POST /api/products → ajoute un nouveau produit
app.post('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'products.json');
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  products.push(req.body);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  res.status(201).json(req.body);
});

// DELETE /api/products/:id → supprime un produit
app.delete('/api/products/:id', (req, res) => {
  const filePath = path.join(__dirname, 'products.json');
  let products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  products = products.filter(p => p.id !== +req.params.id);
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  res.status(204).end();
});

// POST /api/auth/login → vérifie les identifiants dans users.json
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const user = users.find(u => u.email === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  // Pour le mock, on renvoie juste le email comme "token"
  res.json({ token: user.email });
});

// GET /api/auth/me → renvoie les infos du user à partir du token
app.get('/api/auth/me', (req, res) => {
  // On attend un header Authorization: Bearer <email>
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const user = users.find(u => u.email === token);
  if (!user) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  // On renvoie juste le email et un rôle par exemple
  res.json({ email: user.email, role: user.role_id === 1 ? 'admin' : 'user' });
});

// POST /api/auth/signup → ajoute un nouvel utilisateur dans users.json
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name = '', phone = '' } = req.body;
  const filePath = path.join(__dirname, 'users.json');
  const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Utilisateur existant' });
  }
  // Détermine le nouvel ID
  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser = { id: nextId, name, email, password, phone, role_id: 2 };
  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  res.status(201).json({ id: newUser.id, email: newUser.email, role: 'user' });
});

// POST /api/auth/refresh → renvoie à nouveau le token si valide
app.post('/api/auth/refresh', (req, res) => {
  const { token } = req.body;
  const auth = `Bearer ${token}`;
  // Réutilise logique de /me
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const user = users.find(u => u.email === token);
  if (!user) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  // Pour le mock, on renvoie le même token
  res.json({ token, user: { email: user.email, role: user.role_id === 1 ? 'admin' : 'user' } });
});

// GET /api/auth/dev-admin → crée ou récupère un admin dans users.json
app.get('/api/auth/dev-admin', (req, res) => {
  const filePath = path.join(__dirname, 'users.json');
  const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  // Cherche ou crée le rôle admin (role_id = 1)
  let admin = users.find(u => u.email === 'admin@cyna.dev');
  if (!admin) {
    const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    admin = {
      id: nextId,
      name: 'Admin Dev',
      email: 'admin@cyna.dev',
      password: 'azerty123',
      phone: '',
      role_id: 1
    };
    users.push(admin);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  }
  // Renvoie token et info
  const token = admin.email;
  res.json({ token, user: { id: admin.id, email: admin.email, role: 'admin' } });
});

app.listen(PORT, () => {
  console.log(`Mock API server listening on http://localhost:${PORT}`);
});