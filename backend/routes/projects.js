const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1,$2,$3) RETURNING *',
      [name, description, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT p.* FROM projects p
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.owner_id=$1 OR pm.user_id=$1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/:id/members', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await pool.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.params.id, req.body.user_id]
    );
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/users', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;