const express  = require('express');
const dotenv   = require('dotenv');
const cors     = require('cors');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'https://myfirstportfolio-coral.vercel.app',
    'http://localhost:5173',
    'http://localhost:5000',
  ],
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

// Sync all Sequelize models → creates tables if they don't exist
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ PostgreSQL connected & tables synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });
