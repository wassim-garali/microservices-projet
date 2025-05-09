const { Kafka } = require('kafkajs');

     // Configurer le client Kafka
     const kafka = new Kafka({
       clientId: 'event-service',
       brokers: ['localhost:9092'],
     });

     // Créer un producteur
     const producer = kafka.producer();

     // Fonction pour envoyer un événement
     async function sendProductAddedEvent(product) {
       try {
         await producer.connect();
         await producer.send({
           topic: 'product-added',
           messages: [
             {
               value: JSON.stringify(product),
             },
           ],
         });
         console.log(`Event sent for product: ${product.name}`);
         await producer.disconnect();
       } catch (error) {
         console.error('Error sending event:', error.message);
       }
     }

     // Exemple d'utilisation (pour tests)
     async function testProducer() {
       const sampleProduct = {
         productId: '123',
         name: 'Test Product',
         price: 99.99,
         category: 'Test',
       };
       await sendProductAddedEvent(sampleProduct);
     }

     // Démarrer le test
     testProducer();