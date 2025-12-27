const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();

// Middleware per JSON
app.use(express.json());


// Servir imatges locals
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexió MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexió a MongoDB establerta correctament'))
.catch(err => console.error('❌ Error connectant a MongoDB:', err));

// RUTES
app.use('/api/tasks', taskRoutes);     // 👈 A partir d’aquí totes les rutes de tasques comencen per /api/tasks
app.use('/api/upload', uploadRoutes);  // 👈 /api/upload/local i /api/upload/cloud
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Inici servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor actiu a http://localhost:${PORT}`);
});
