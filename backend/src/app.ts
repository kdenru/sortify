import express from 'express';
import cors from 'cors';
import path from 'path';
import itemsRouter from './routes/items.route';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/items', itemsRouter);

if (process.env.NODE_ENV === 'production') {
  // Раздача фронта из public
  app.use(express.static(path.join(__dirname, '../public')));

  // SPA fallback для всех не-API GET-запросов
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/items')) {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
