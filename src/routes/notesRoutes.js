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

/* ------ Post Article by ID ------ */
router.post('/article', async (req, res) => {
    try {
        const { languageId, articles: [{ title, body }] } = req.body;
        
        const newArticle = new Article({ title, body });
        newArticle.save()
            .then(article => {
                // 将新文章的ID添加到所选择的语言的文章数组中
                return Language.findByIdAndUpdate(
                    languageId,
                    { $push: { articles: article._id } },
                    { new: true }
                );
            })
            .then(updatedLanguage => {
                console.log("Article ID added to language:", updatedLanguage);
            })
            .catch(error => {
                console.error("Error:", error);
            });

    } catch (err) {
        console.error('Error creating new article:', err);
        res.status(500).json({ error: 'Internal server error', message: 'Error creating new article' });
    }
});

/* ------ Delete Language by ID ------ */
router.delete('/article/:id', async (req, res) => {
    try {
        const data = await Article.findByIdAndDelete(req.params.id);
        await Language.updateMany({}, { $pull: { articles: req.params.id } });

        if (!data) {
            return res.status(404).json({ error: 'Article not found', message: 'Error finding Article by ID' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error deleting article:', error);
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