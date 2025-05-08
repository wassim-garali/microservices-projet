// Importer gRPC et Mongoose
     const grpc = require('@grpc/grpc-js');
     const protoLoader = require('@grpc/proto-loader');
     const mongoose = require('mongoose');
     const path = require('path');

     // Charger le fichier Protobuf
     const PROTO_PATH = path.join(__dirname, 'product.proto');
     const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
       keepCase: true,
       longs: String,
       enums: String,
       defaults: true,
       oneofs: true,
     });
     const productProto = grpc.loadPackageDefinition(packageDefinition).product;

     // Connexion à MongoDB
     mongoose.connect('mongodb://localhost:27017/products')
       .then(() => console.log('Connected to MongoDB'))
       .catch(err => console.error('MongoDB connection error:', err));

     // Définir le schéma du produit (même que REST et GraphQL)
     const productSchema = new mongoose.Schema({
       name: { type: String, required: true },
       price: { type: Number, required: true },
       category: { type: String, required: true },
     });

     // Créer le modèle Product
     const Product = mongoose.model('Product', productSchema);

     // Implémenter la méthode GetAveragePriceByCategory
     async function getAveragePriceByCategory(call, callback) {
       try {
         const category = call.request.category;
         const result = await Product.aggregate([
           { $match: { category } },
           { $group: { _id: null, averagePrice: { $avg: '$price' } } },
         ]);
         const averagePrice = result.length > 0 ? result[0].averagePrice : 0;
         callback(null, { averagePrice });
       } catch (error) {
         callback({
           code: grpc.status.INTERNAL,
           message: error.message,
         });
       }
     }

     // Créer le serveur gRPC
     const server = new grpc.Server();
     server.addService(productProto.ProductService.service, {
       GetAveragePriceByCategory: getAveragePriceByCategory,
     });

     // Démarrer le serveur gRPC
     server.bindAsync(
       '127.0.0.1:8080',
       grpc.ServerCredentials.createInsecure(),
       (error, port) => {
         if (error) {
           console.error('Failed to bind server:', error);
           return;
         }
         console.log(`gRPC Service running on 127.0.0.1:${port}`);
       }
     );