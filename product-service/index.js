 // Importer Express et Mongoose
const express = require('express');
const mongoose = require('mongoose');

// Initialiser Express
const app = express();

// Activer le parsing JSON pour les requêtes
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Définir le schéma du produit
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

// Créer le modèle Product
const Product = mongoose.model('Product', productSchema);

// Endpoint POST /products
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint GET /products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur sur le port 3001
app.listen(3001, () => console.log('REST Service running on port 3001'));
