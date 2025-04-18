require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
connectDB();


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/admin', adminRoutes);


app.get('/',(req,res)=>{
  res.send('API is running...');

});



app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
  console.log(`server running on http://localhost:${PORT}`);
});