const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Connexion base de données
const bddConnection = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// ✅ Route inscription
app.post('/inscription', async (req, res) => {
    const { nom, email, mot_de_passe, id_role } = req.body;

    if (!nom || !email || !mot_de_passe || !id_role) {
        return res.status(400).json({ message: "Champs requis manquants" });
    }

    try {
        const [rows] = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "Email déjà utilisé" });
        }

        const hash = await bcrypt.hash(mot_de_passe, 10);
        await bddConnection.query(
            "INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)",
            [nom, email, hash, id_role]
        );

        res.status(201).json({ message: "Inscription réussie" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});

// ✅ Route connexion
app.post('/connexion', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        const [rows] = await bddConnection.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const utilisateur = rows[0];
        const estValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

        if (!estValide) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: utilisateur.id_utilisateur, role: utilisateur.id_role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '2h' }
        );

        res.json({ message: "Connexion réussie", token });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});

// ✅ Route pour récupérer les catégories de services : 
app.get('/categories', async (req, res) => {
    try {
        const [rows] = await bddConnection.query("SELECT * FROM categories_rendezvous");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});

// ✅ Route pour obtenir les prestataire pour une catégorie : 
app.get('/prestataires/:id_categorie', async (req, res) => {
    const { id_categorie } = req.params;

    try {
        const [rows] = await bddConnection.query(`
            SELECT DISTINCT u.id_utilisateur, u.nom, u.email
            FROM utilisateurs u
            JOIN services s ON u.id_utilisateur = s.id_prestataire
            WHERE s.id_categorie = ?
        `, [id_categorie]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});

// ✅ Route pour obtenir les disponibilités d'un prestataire :
app.get('/prestataire/:id_prestataire/disponibilites', async (req, res) => {
    const { id_prestataire } = req.params;

    try {
        const [rows] = await bddConnection.query(`
            SELECT d.date, d.heure_debut, d.heure_fin
            FROM disponibilites d
            WHERE d.id_prestataire = ?
        `, [id_prestataire]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});

// ✅ Route pour reserver un rendez-vous :
app.post('/rendezvous', async (req, res) => {
    const { id_client, id_prestataire, id_service, date_heure } = req.body;

    if (!id_client || !id_prestataire || !id_service || !date_heure) {
        return res.status(400).json({ message: "Champs requis manquants" });
    }

    try {
        // Vérifie si la disponibilité existe
        const [dispo] = await db.query(`
            SELECT * FROM disponibilites
            WHERE id_prestataire = ? AND debut <= ? AND fin >= ?
        `, [id_prestataire, date_heure, date_heure]);

        if (dispo.length === 0) {
            return res.status(400).json({ message: "Créneau indisponible" });
        }

        await db.query(`
            INSERT INTO rendezvous (id_client, id_prestataire, id_service, date_heure)
            VALUES (?, ?, ?, ?)
        `, [id_client, id_prestataire, id_service, date_heure]);

        res.status(201).json({ message: "Rendez-vous pris avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", erreur: err.message });
    }
});
// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});