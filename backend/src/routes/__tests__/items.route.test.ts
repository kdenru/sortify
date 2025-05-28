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
    expect(res.body.total).toBe(1000000);
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
    const res = await request(app).get('/items?search=99');
    expect(res.status).toBe(200);
    expect(res.body.items.some((i: any) => i.value.includes('99'))).toBe(true);
  });

  it('POST /items/select меняет выделение айтемов', async () => {
    const res1 = await request(app).post('/items/select').send({ selectedIds: [1, 2] });
    expect(res1.status).toBe(204);
    const res2 = await request(app).get('/items?limit=3');
    const selected = res2.body.items.filter((i: any) => i.selected).map((i: any) => i.id);
    expect(selected).toEqual([1, 2]);
  });

  it('POST /items/reorder меняет порядок айтемов', async () => {
    const res1 = await request(app).get('/items?limit=3');
    const ids = res1.body.items.map((i: any) => i.id); // [1,2,3]
    // Сначала перемещаем 3 перед 1 => [3,1,2]
    let res2 = await request(app).post('/items/reorder').send({ movedId: ids[2], beforeId: ids[0] });
    expect(res2.status).toBe(204);
    // Потом перемещаем 2 перед 1 => [3,2,1]
    let res3 = await request(app).post('/items/reorder').send({ movedId: ids[1], beforeId: ids[0] });
    expect(res3.status).toBe(204);
    // Проверяем порядок
    const res4 = await request(app).get('/items?limit=3');
    expect(res4.body.items.map((i: any) => i.id)).toEqual([ids[2], ids[1], ids[0]]);
  });
}); 