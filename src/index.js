const express = require("express")
const rabbitMQ  = require('@joinf/rabbitmq');
const app = express()
app.use(express.json());

const port = 8083;

app.post('/send', (req, res)=>{
  const {exchangeName, routingKey, message }  = req.body
  rabbitMQ.producer.publish(exchangeName, routingKey, message);
  res.sendStatus(201).send("Mensagem enviada para a exchange " + exchangeName)
})

app.listen(port, async ()=>{

    const queueServerUrl = 'amqps://ybqbsmjz:swguNoZppAjNw6kB1xf5Wh6Hhz_dsOaP@prawn.rmq.cloudamqp.com/ybqbsmjz'; //amqps://localhost:5672
    const queueName = 'sap-product'; //nome da fila

    await rabbitMQ.init(queueServerUrl);
    try{
        rabbitMQ.consumer.listen(queueName, ({ message, data, channel }) => {
            console.log("Recebendo: ", data);
            channel.ack(message);
          });
    }
    catch(e){
        console.log(e);
    }
  console.log(`App iniciada em http://localhost:${port}`)
})