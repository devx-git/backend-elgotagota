const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/payments
router.post('/', async (req, res) => {
  const { userId, planId, metodo, monto, referencia } = req.body;
  if (!userId || !planId || !metodo || !monto) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO pagos (user_id, plan_id, plan_nombre, metodo, referencia, monto, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, planId, null, metodo, referencia || null, monto, 'pendiente']
    );
    res.json({ ok: true, data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error registrando pago' });
  }
});

module.exports = router;
