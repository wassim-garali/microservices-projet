const { Kafka } = require('kafkajs');

     // Configurer le client Kafka
     const kafka = new Kafka({
       clientId: 'event-service-consumer',
       brokers: ['localhost:9092'],
     });

     // Créer un consommateur
     const consumer = kafka.consumer({ groupId: 'product-group' });

     // Fonction pour consommer les événements
     async function runConsumer() {
       try {
         await consumer.connect();
         await consumer.subscribe({ topic: 'product-added', fromBeginning: true });
         await consumer.run({
           eachMessage: async ({ topic, partition, message }) => {
             const product = JSON.parse(message.value.toString());
             console.log(`Received product: ${product.name}, Price: ${product.price}, Category: ${product.category}`);
           },
         });
       } catch (error) {
         console.error('Error in consumer:', error.message);
       }
     }

     // Démarrer le consommateur
     runConsumer();