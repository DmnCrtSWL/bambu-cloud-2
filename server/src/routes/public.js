const express = require('express');
const router = express.Router();

// Define public menu routes here
router.get('/menu', (req, res) => {
    // Placeholder for menu retrieval
    res.json({ message: 'Public menu data' });
});

module.exports = router;
