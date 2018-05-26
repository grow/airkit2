const fs = require('fs');
const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');

const TEMPLATES_PATH = './src/';

const app = express();
nunjucks.configure(TEMPLATES_PATH, {
  autoescape: true,
  express: app,
  watch: true,
});

app.use('/dist/', express.static('dist'));

app.use('/', function(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  let templatePath = req.path.slice(1);
  if (path.extname(templatePath) !== '.html') {
    templatePath = path.join(templatePath, 'index.html');
  }

  const filePath = path.join(TEMPLATES_PATH, templatePath);
  if (!fs.existsSync(filePath)) {
    return next();
  }

  console.log(`serving ${templatePath}`);
  return res.render(templatePath);
});

app.use(function(req, res) {
  res.status(404).render('404.html');
});

app.listen(3000);
