import request from 'supertest';
import express from 'express';
import itemsRouter from '../items.route';

const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

describe('/items route', () => {
  it('GET /items возвращает 20 элементов по умолчанию', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(20);
    expect(res.body.total).toBe(1_000_000);
  });

  it('GET /items с limit=5', async () => {
    const res = await request(app).get('/items?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(5);
  });

  it('GET /items с offset=10', async () => {
    const res = await request(app).get('/items?offset=10&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.items[0].id).toBe(11);
  });

  it('GET /items с поиском', async () => {
    const res = await request(app).get('/items?search=9999');
    expect(res.status).toBe(200);
    expect(res.body.items.some((i: any) => i.value.includes('9999'))).toBe(true);
  });

  it('GET /items с сортировкой по value desc', async () => {
    const res = await request(app).get('/items?sortBy=value&sortOrder=desc&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.items[0].value > res.body.items[1].value).toBe(true);
  });
}); 