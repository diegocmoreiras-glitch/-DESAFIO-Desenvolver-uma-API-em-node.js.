// API de Pedidos em Node.js (Express + MongoDB)
// Arquivos sugeridos:
// server.js
// models/Order.js
// routes/orderRoutes.js
// controllers/orderController.js
// config/db.js

// A seguir, um projeto completo em um único arquivo para facilitar o estudo.

// ----------------------- server.js -----------------------
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ordersdb');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  value: Number,
  creationDate: Date,
  items: [
    {
      productId: Number,
      quantity: Number,
      price: Number,
    },
  ],
});

const Order = mongoose.model('Order', OrderSchema);

app.post('/order', async (req, res) => {
  try {
    const body = req.body;
    const mapped = {
      orderId: body.numeroPedido.replace('-01', ''),
      value: body.valorTotal,
      creationDate: new Date(body.dataCriacao),
      items: body.items.map((item) => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem,
      })),
    };

    const newOrder = await Order.create(mapped);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/order/list', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/order/:id', async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/order/:id', async (req, res) => {
  try {
    const deleted = await Order.findOneAndDelete({ orderId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('API rodando na porta 3000'));
