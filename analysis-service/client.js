const grpc = require('@grpc/grpc-js');
       const protoLoader = require('@grpc/proto-loader');
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

       // Créer le client gRPC
       const client = new productProto.ProductService(
         '127.0.0.1:8080',
         grpc.credentials.createInsecure()
       );

       // Tester GetAveragePriceByCategory
       client.GetAveragePriceByCategory({ category: 'Electronics' }, (error, response) => {
         if (error) {
           console.error('Error:', error.message);
           return;
         }
         console.log('Response:', response);
       });