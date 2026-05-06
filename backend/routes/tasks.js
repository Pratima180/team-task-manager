const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = await pool.query(
      `SELECT status, COUNT(*) FROM tasks WHERE assigned_to=$1 GROUP BY status`,
      [req.user.id]
    );
    const overdue = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to=$1 AND due_date < NOW() AND status != 'done'`,
      [req.user.id]
    );
    res.json({ stats: stats.rows, overdue: overdue.rows });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, due_date, project_id, assigned_to } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date, project_id, assigned_to, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, due_date, project_id, assigned_to, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name as assigned_name FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id=$1`,
      [req.params.projectId]
    );
    res.json(result.rows);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;