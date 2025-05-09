const express = require('express');
     const mongoose = require('mongoose');
     const { Kafka } = require('kafkajs');

     const app = express();
     app.use(express.json());

     // Connexion à MongoDB
     mongoose.connect('mongodb://localhost:27017/productdb', {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
       .then(() => console.log('Connected to MongoDB'))
       .catch((err) => console.error('MongoDB connection error:', err));

     // Schéma et modèle MongoDB
     const productSchema = new mongoose.Schema({
       productId: String,
       name: String,
       price: Number,
       category: String,
     });
     const Product = mongoose.model('Product', productSchema);

     // Configurer le client Kafka
     const kafka = new Kafka({
       clientId: 'product-service',
       brokers: ['localhost:9092'],
     });
     const producer = kafka.producer();

     // Route pour ajouter un produit
     app.post('/api/products', async (req, res) => {
       try {
         const { productId, name, price, category } = req.body;
         const product = new Product({ productId, name, price, category });
         await product.save();

         // Envoyer un événement Kafka
         await producer.connect();
         await producer.send({
           topic: 'product-added',
           messages: [
             {
               value: JSON.stringify({ productId, name, price, category }),
             },
           ],
         });
         console.log(`Event sent for product: ${name}`);
         await producer.disconnect();

         res.status(201).json(product);
       } catch (error) {
         console.error('Error adding product:', error.message);
         res.status(500).json({ error: 'Failed to add product' });
       }
     });

     // Route pour récupérer tous les produits
     app.get('/api/products', async (req, res) => {
       try {
         const products = await Product.find();
         res.json(products);
       } catch (error) {
         console.error('Error fetching products:', error.message);
         res.status(500).json({ error: 'Failed to fetch products' });
       }
     });

     // Démarrer le serveur
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => {
       console.log(`Product service running on port ${PORT}`);
     });