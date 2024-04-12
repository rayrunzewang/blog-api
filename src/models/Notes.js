const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Article = mongoose.model('Article', articleSchema);

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
});

const Language = mongoose.model('Language', languageSchema);

module.exports = { Language, Article };
