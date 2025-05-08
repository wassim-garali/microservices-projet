// Importer Express et http-proxy-middleware
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Initialiser Express
const app = express();

// Configurer le proxy pour le service REST
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  })
);

// Configurer le proxy pour le service GraphQL
app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/graphql': '' },
  })
);

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});