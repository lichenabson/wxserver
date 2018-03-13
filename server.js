const Koa = require('koa');
const router = require('./router');

const app = new Koa();

app.use(router);

app.listen(3000, () => {
    console.log(`Server is success on port 3000`);
});