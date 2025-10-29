const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/plans
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM planes ORDER BY orden ASC');
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al obtener planes' });
  }
});

module.exports = router;
