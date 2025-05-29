// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Enable CORS for requests from the front-end development server
app.use(cors({ origin: 'http://localhost:3000' }));

// Log incoming API requests for debugging proxy
app.use('/api', (req, res, next) => {
  console.log(`→ Express reçu: ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 4000;

// ----- Products Routes -----

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

// ----- Carousel Routes -----

// GET /api/carousel → renvoie la configuration du carrousel
app.get('/api/carousel', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  // Pour s'assurer de toujours renvoyer la version à jour
  res.set('Cache-Control', 'no-store');
  res.json(carousel);
});

// POST /api/carousel → ajoute un nouvel élément au carousel
app.post('/api/carousel', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const newItem = req.body;
  console.log('🛠️ Backend a reçu:', newItem); 

  // Destructure expected fields and validate
  const { item_id, type } = newItem;
  if (!item_id || !type) {
    return res.status(400).json({ error: 'item_id et type sont requis' });
  }

  // Parse order as integer
  const order = parseInt(newItem.order, 10);

  // Validate unique order
  if (carousel.some(item => item.order === order)) {
    return res.status(400).json({ error: 'order doit être unique' });
  }

  const carouselItem = { item_id, type, order };

  carousel.push(carouselItem);
  fs.writeFileSync(filePath, JSON.stringify(carousel, null, 2), 'utf-8');
  res.status(201).json(carouselItem);
});

// PUT /api/carousel/:item_id → met à jour l’ordre dans carousel.json
app.put('/api/carousel/:item_id', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const item_id = +req.params.item_id;
  const type = req.query.type;

  // Find matching items
  const matchedItems = carousel.filter(item => item.item_id === item_id && item.type === type);
  if (matchedItems.length === 0) {
    return res.status(404).json({ error: 'Carousel item not found' });
  }
  if (matchedItems.length > 1) {
    return res.status(400).json({ error: 'Multiple carousel items found, specify type to disambiguate' });
  }
  const idx = carousel.findIndex(item => item.item_id === item_id && item.type === type);

  // Mise à jour de l'ordre
  const newOrder = parseInt(req.body.order, 10);
  if (carousel.some((it, i) => i !== idx && it.order === newOrder)) {
    return res.status(400).json({ error: 'order doit être unique' });
  }
  carousel[idx].order = newOrder;
  fs.writeFileSync(filePath, JSON.stringify(carousel, null, 2), 'utf-8');
  res.json(carousel[idx]);
});

// DELETE /api/carousel/:item_id → supprime un élément du carousel
app.delete('/api/carousel/:item_id', (req, res) => {
  const filePath = path.join(__dirname, 'carousel.json');
  const carousel = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const item_id = +req.params.item_id;
  const type = req.query.type;

  const filtered = carousel.filter(item => !(item.item_id === item_id && item.type === type));
  if (filtered.length === carousel.length) {
    return res.status(404).json({ error: 'Carousel item not found' });
  }
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  res.status(204).end();
});

// ----- Services Routes -----

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

// ----- Team Routes -----

// GET /api/team → renvoie tout team.json
app.get('/api/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'team.json'));
});

// PUT /api/team/:id → met à jour un membre dans team.json

app.put('/api/team/:id', (req, res) => {
  const filePath = path.join(__dirname, 'team.json');
  const team = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const idx = team.findIndex(m => m.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Membre non trouvé' });

  team[idx] = { ...team[idx], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(team, null, 2), 'utf-8');
  res.json(team[idx]);
});

// DELETE /api/team/:id → supprime un membre dans team.json
app.delete('/api/team/:id', (req, res) => {
  const filePath = path.join(__dirname, 'team.json');
  let team = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const id = +req.params.id;
  const newTeam = team.filter(m => m.id !== id);
  if (newTeam.length === team.length) {
    return res.status(404).json({ error: 'Membre non trouvé' });
  }
  fs.writeFileSync(filePath, JSON.stringify(newTeam, null, 2), 'utf-8');
  res.status(204).end();
});

// POST /api/team → ajoute un nouveau membre dans team.json
app.post('/api/team', (req, res) => {
  const filePath = path.join(__dirname, 'team.json');
  const team = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  // Calculer le prochain id
  const nextId = team.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  const newMember = { id: nextId, ...req.body };
  team.push(newMember);
  fs.writeFileSync(filePath, JSON.stringify(team, null, 2), 'utf-8');
  res.status(201).json(newMember);
});

// ----- Client Routes -----

app.get('/api/client/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.json'));
});

app.get('/api/client/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.json'));
});

// GET /api/orders → assemble orders from separate JSON files
app.get('/api/orders', (req, res) => {
  try {
    const orderItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'orderItems.json'), 'utf-8'));
    const assoProducts = JSON.parse(fs.readFileSync(path.join(__dirname, 'assoOrderItemsProducts.json'), 'utf-8'));
    const assoServices = JSON.parse(fs.readFileSync(path.join(__dirname, 'assoOrderItemsServices.json'), 'utf-8'));
    
    // Group items by order_id
    const ordersMap = {};
    orderItems.forEach(item => {
      const { id, order_id, Quantity, Price } = item;
      const productAssoc = assoProducts.find(ap => ap.order_item_id === id);
      const serviceAssoc = assoServices.find(asrv => asrv.order_item_id === id);
      const entry = { id, order_id, Quantity, Price };
      if (productAssoc) {
        entry.product_id = productAssoc.product_id;
      } else if (serviceAssoc) {
        entry.service_id = serviceAssoc.service_id;
      }
      if (!ordersMap[order_id]) {
        ordersMap[order_id] = { id: order_id, items: [] };
      }
      ordersMap[order_id].items.push(entry);
    });

    // Convert map to array
    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error('Error assembling orders:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// ----- Payment Methods Routes -----

// GET /api/payment-methods → liste tous les moyens
app.get('/api/payment-methods', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'paymentMethods.json'), 'utf-8'));
  res.json(data);
});

// POST /api/payment-methods → ajoute un moyen
app.post('/api/payment-methods', (req, res) => {
  const file = path.join(__dirname, 'paymentMethods.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Si le nouveau moyen est défini par défaut, retirer le statut par défaut des autres
  if (req.body.isDefault) {
    arr.forEach(m => { m.isDefault = false; });
  }
  const nextId = arr.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  const newMethod = { id: nextId, ...req.body };
  arr.push(newMethod);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.status(201).json(newMethod);
});

// PUT /api/payment-methods/:id → modifie un moyen
app.put('/api/payment-methods/:id', (req, res) => {
  console.log('Debug PUT /api/payment-methods/:id → id:', req.params.id, 'body:', req.body);
  const file = path.join(__dirname, 'paymentMethods.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Si on met à jour pour définir ce moyen par défaut, retirer le statut par défaut des autres
  if (req.body.isDefault) {
    arr.forEach(m => { m.isDefault = false; });
  }
  const idx = arr.findIndex(m => m.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Non trouvé' });
  arr[idx] = { ...arr[idx], ...req.body };
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.json(arr[idx]);
});

// DELETE /api/payment-methods/:id → supprime un moyen
app.delete('/api/payment-methods/:id', (req, res) => {
  const file = path.join(__dirname, 'paymentMethods.json');
  let arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  arr = arr.filter(m => m.id !== +req.params.id);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.status(204).end();
});

// ----- Addresses Routes -----

// GET /api/addresses → liste toutes les adresses
app.get('/api/addresses', (req, res) => {
  const file = path.join(__dirname, 'addresses.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  res.json(arr);
});

// POST /api/addresses → ajoute une adresse
app.post('/api/addresses', (req, res) => {
  const file = path.join(__dirname, 'addresses.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Si la nouvelle adresse est définie par défaut, retirer le statut des autres
  if (req.body.isDefault) arr.forEach(a => a.isDefault = false);
  const nextId = arr.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const newAddress = { id: nextId, ...req.body };
  arr.push(newAddress);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.status(201).json(newAddress);
});

// PUT /api/addresses/:id → modifie une adresse
app.put('/api/addresses/:id', (req, res) => {
  const file = path.join(__dirname, 'addresses.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Si on définit par défaut, retirer le statut des autres
  if (req.body.isDefault) arr.forEach(a => a.isDefault = false);
  const idx = arr.findIndex(a => a.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Adresse non trouvée' });
  arr[idx] = { ...arr[idx], ...req.body };
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.json(arr[idx]);
});

// DELETE /api/addresses/:id → supprime une adresse

app.delete('/api/addresses/:id', (req, res) => {
  const file = path.join(__dirname, 'addresses.json');
  let arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  arr = arr.filter(a => a.id !== +req.params.id);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.status(204).end();
});

// ----- Product Categories Routes -----

// GET /api/product-categories → liste toutes les catégories
app.get('/api/product-categories', (req, res) => {
  const file = path.join(__dirname, 'productCategories.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  res.json(arr);
});

// POST /api/product-categories → crée une nouvelle catégorie
app.post('/api/product-categories', (req, res) => {
  const file = path.join(__dirname, 'productCategories.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const nextId = arr.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const newCategory = { id: nextId, ...req.body };
  arr.push(newCategory);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.status(201).json(newCategory);
});

// PUT /api/product-categories/:id → met à jour une catégorie
app.put('/api/product-categories/:id', (req, res) => {
  const file = path.join(__dirname, 'productCategories.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const idx = arr.findIndex(c => c.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Catégorie non trouvée' });
  arr[idx] = { ...arr[idx], ...req.body };
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.json(arr[idx]);
});

// DELETE /api/product-categories/:id → supprime une catégorie
app.delete('/api/product-categories/:id', (req, res) => {
  const file = path.join(__dirname, 'productCategories.json');
  let arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  arr = arr.filter(c => c.id !== +req.params.id);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.status(204).end();
});

// ----- Service Types Routes -----

// GET /api/service-types → list all service types
app.get('/api/service-types', (req, res) => {
  const file = path.join(__dirname, 'serviceTypes.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  res.json(arr);
});

// POST /api/service-types → create a new service type
app.post('/api/service-types', (req, res) => {
  const file = path.join(__dirname, 'serviceTypes.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const nextId = arr.reduce((max, st) => Math.max(max, st.id), 0) + 1;
  const newType = { id: nextId, ...req.body };
  arr.push(newType);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.status(201).json(newType);
});

// PUT /api/service-types/:id → update a service type
app.put('/api/service-types/:id', (req, res) => {
  const file = path.join(__dirname, 'serviceTypes.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const idx = arr.findIndex(st => st.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service type not found' });
  arr[idx] = { ...arr[idx], ...req.body };
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.json(arr[idx]);
});

// DELETE /api/service-types/:id → delete a service type
app.delete('/api/service-types/:id', (req, res) => {
  const file = path.join(__dirname, 'serviceTypes.json');
  let arr = JSON.parse(fs.readFileSync(file, 'utf-8'));
  arr = arr.filter(st => st.id !== +req.params.id);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf-8');
  res.status(204).end();
});

// ----- Auth Routes -----

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