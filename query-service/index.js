// Importer Apollo Server et Mongoose
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

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

// Définir le schéma GraphQL
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }
  type Query {
    products(category: String): [Product]
  }
`;

// Définir les resolvers
const resolvers = {
  Query: {
    products: async (_, { category }) => {
      const query = category ? { category } : {};
      return await Product.find(query);
    },
  },
};

// Créer le serveur Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Démarrer le serveur sur le port 3002
server.listen(3002).then(({ url }) => {
  console.log(`GraphQL Service running on ${url}`);
});