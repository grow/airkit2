#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const express = require('express');

const htmlMinifier = require('html-minifier');
const nunjucks = require('nunjucks');
const utils = require('./utils');


const DIST_PATH = 'dist/';
const STATIC_PATH = 'static/';
const TEMPLATES_PATH = 'src/';

const NUNJUCKS_LOADER = new nunjucks.FileSystemLoader(TEMPLATES_PATH, {
  watch: true,
});
const NUNJUCKS_ENV = new nunjucks.Environment(NUNJUCKS_LOADER);
NUNJUCKS_ENV.addFilter('fingerprint', fingerprint);
NUNJUCKS_ENV.addFilter('normalize_html', normalizeHtml);


/**
 * Runs the `dev` command. Starts the dev server.
 * @param {Object} argv
 */
function runDev(argv) {
  const app = express();
  NUNJUCKS_ENV.express(app);

  app.use('/airkit2/dist/', express.static(DIST_PATH));
  app.use('/airkit2/static/', express.static(STATIC_PATH));

  app.use('/airkit2/', function(req, res, next) {
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

  const port = argv.port;
  console.log(`starting dev server at http://localhost:${port}/airkit2/`);
  app.listen(port);
}


/**
 * Runs the `build` command. Builds the site and outputs to the /docs/ folder.
 * @param {Object} argv
 */
function runBuild(argv) {
  const outdir = argv.out;
  console.log(`outputting site to ${outdir}`);

  // Remove existing files.
  if (fs.existsSync(outdir)) {
    utils.rmdir(outdir);
  }

  // Create the directory.
  utils.mkdirp(outdir);

  // Add .nojekyll for GitHub Pages.
  utils.touch(path.join(outdir, '.nojekyll'));

  // Copy static files from dist/.
  utils.listFiles(DIST_PATH)
      .forEach((filepath) => {
        const outpath = path.join(outdir, filepath);

        const parentdir = path.dirname(outpath);
        if (!fs.existsSync(parentdir)) {
          utils.mkdirp(parentdir);
        }

        fs.copyFileSync(filepath, outpath);
        console.log(`saved ${outpath}`);
      });

  // Copy static files from static/.
  utils.listFiles(STATIC_PATH)
      .forEach((filepath) => {
        const outpath = path.join(outdir, filepath);

        const parentdir = path.dirname(outpath);
        if (!fs.existsSync(parentdir)) {
          utils.mkdirp(parentdir);
        }

        fs.copyFileSync(filepath, outpath);
        console.log(`saved ${outpath}`);
      });

  // Render HTML files.
  utils.listFiles(TEMPLATES_PATH)
      .filter((filepath) => {
        return filepath.endsWith('index.html') || filepath.endsWith('404.html');
      }).forEach((filepath) => {
        const relpath = filepath.slice(TEMPLATES_PATH.length);
        const outpath = path.join(outdir, relpath);

        const parentdir = path.dirname(outpath);
        if (!fs.existsSync(parentdir)) {
          utils.mkdirp(parentdir);
        }

        const html = NUNJUCKS_ENV.render(relpath);
        fs.writeFileSync(outpath, html);
        console.log(`saved ${outpath}`);
      });

  process.exit(0);
}


/**
 * Nunjucks filter to normalizes HTML.
 * @param {string} html
 * @return {string}
 */
function normalizeHtml(html) {
  let output = htmlMinifier.minify(html, {
    collapseWhitespace: true,
    preserveLineBreaks: true,
  }).trim();

  return new nunjucks.runtime.SafeString(output);
}


/**
 * Nunjucks filter to get the fingerprint (hash) of a dist/ file.
 * @param {string} name The name of the bundle, from [name].bundle.js.
 * @param {string} type
 * @return {string}
 */
function fingerprint(name, type) {
  const filepath = path.join(DIST_PATH, type, name, `${name}.min.${type}`);
  const data = fs.readFileSync(filepath);
  return utils.checksum(data);
}


require('yargs')
    .command('dev', 'starts the dev server', {
      'port': {
        'alias': 'p',
        'default': 3000,
        'type': 'number',
      },
    }, runDev)
    .command('build', 'builds the site', {
      'out': {
        'alias': 'o',
        'default': 'docs/',
        'type': 'string',
      },
    }, runBuild)
    .help()
    .argv;
