const express = require('express');
const router = express.Router();
const { Language } = require('../models/Notes');
const { Article } = require('../models/Notes');

/* ------ Get All Languages ------ */
router.get('/language', async (req, res) => {
    try {
        const data = await Language.find();
        console.log(data)
        res.json(data);
    } catch (error) {
        console.error('Error fetching Languages:', error);
        res.status(500).json({ error: 'Internal server error', message: 'Error getting Languages' });
    }
});

/* ------ Get Language by ID ------ */
router.get('/language/:id', async (req, res) => {
    try {
        const data = await Language.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Language not found', message: 'Error finding Language by ID' });
        }
        res.json(data);
    } catch (err) {
        console.error('Error fetching language by ID:', err);
        res.status(500).json({ error: 'Internal server error', message: 'Error getting Language by ID' });
    }
});
/* ------ Get Articles by Language ------ */

router.get('/language/:id/article', async (req, res) => {

    const data = await Language.findById(req.params.id)
        .populate('articles')
        .then(language => {
            res.json(language)
        })
        .catch(err => {
            console.error(err);
        });



});

/* ------ Get Article by ID ------ */
router.get('/article/:id', async (req, res) => {
    try {
        const data = await Article.findById(req.params.id);
        console.log(data)

        if (!data) {
            return res.status(404).json({ error: 'Article not found', message: 'Error finding Article by ID' });
        }
        res.json(data);
    } catch (err) {
        console.error('Error fetching Article by ID: ', err);
        res.status(500).json({
            error: 'Internal server error', message: 'Error getting Article by ID'
        });
    }
});

/* ------ Delete Language by ID ------ */
router.delete('/language/:id', async (req, res) => {
    try {
        const data = await Language.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ error: 'Language post not found', message: 'Error finding language by ID' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ error: 'Internal server error', message: 'Error deleting language by ID' });
    }
});

/* ------ Update Article by ID ------ */
router.put('/article/:id', async (req, res) => {
    try {
        console.log(req.body)
        const updatedArticle = await Article.findById(req.params.id);
        if (!updatedArticle) {
            return res.status(404).json({ error: 'Article  not found', message: 'Error finding article  by ID' });
        }
        const { title, body } = req.body;
        updatedArticle.title = title;
        updatedArticle.body = body;
        await updatedArticle.save();
        res.status(200).json(updatedArticle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', message: 'Error updating article by ID' });
    }
});

module.exports = router;