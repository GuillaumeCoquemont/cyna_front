// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models');  // Sequelize models
const router = express.Router();

// --- Helpers JWT ---
const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

// --- Inscription ---
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Créer ou trouver le rôle "user"
    const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });

    // Créer l’utilisateur
    const user = await User.create({
      name,
      email,
      password: hash,
      phone,
      role_id: userRole.id
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Échec de l’inscription' });
  }
});

// --- Connexion ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Récupérer l’utilisateur
    const user = await User.findOne({ where: { email }, include: 'role' });
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    // Vérifier le mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    // Générer tokens
    const token = signToken(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '1h'
    );
    const refreshToken = signToken(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    );

    res.json({ token, refreshToken, user: { id: user.id, email: user.email, role: user.role.name } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// --- Rafraîchissement du token ---
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.userId, { include: 'role' });
    if (!user) return res.status(401).json({ error: 'Refresh token invalide' });

    const token = signToken(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '1h'
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role.name } });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Refresh token invalide' });
  }
});

// --- Endpoint de dev pour créer ou obtenir l’admin ---
router.get('/dev-admin', async (req, res) => {
  try {
    // Créer/Récupérer le rôle admin
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
    // Créer/Récupérer l’utilisateur admin
    const [user] = await User.findOrCreate({
      where: { email: 'admin@cyna.dev' },
      defaults: { name: 'Admin Dev', password: await bcrypt.hash('azerty123', 10), phone: '', role_id: adminRole.id }
    });
    // Générer token
    const token = signToken(
      { userId: user.id, role: adminRole.name },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN || '365d'
    );
    const refreshToken = signToken(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      process.env.JWT_REFRESH_EXPIRES_IN || '365d'
    );
    res.json({ token, refreshToken, user: { id: user.id, email: user.email, role: adminRole.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création admin' });
  }
});

module.exports = router;