import express from 'express';

const router = express.Router();

// GET all notifications
router.get('/', (req, res) => {
    res.json([]);
});

export default router;
