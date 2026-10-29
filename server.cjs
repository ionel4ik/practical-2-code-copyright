// Походження: створено для цієї практичної роботи за допомогою Codex.
// Не скопійовано зі стороннього репозиторію. Умови та аналіз: README.md.
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const escapeHtml = require('./vendor.cjs'); // escape-html, MIT; див. LICENSE.
const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      return res.end('Метод не підтримується');
    }
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname !== '/') {
      res.writeHead(404);
      return res.end('Сторінку не знайдено');
    }
    const title = (url.searchParams.get('title') || '').trim();
    if (title.length > 200) {
      res.writeHead(400);
      return res.end('Назва має містити не більше 200 символів');
    }
    // Стороння функція використана саме в HTML-текстовому контексті.
    // Це не універсальний засіб очищення JavaScript, CSS або URL.
    const message = title ? `Завдання: ${escapeHtml(title)}` : 'Введіть назву завдання';
    res.writeHead(200);
    res.end(template.replace('<!-- TASK_PREVIEW -->', () => message));
  });
}

module.exports = { createServer };
if (require.main === module) {
  createServer().listen(3000, '127.0.0.1', () => {
    console.log('Відкрийте http://127.0.0.1:3000');
  });
}
