const router = require('koa-route');
const compose = require('koa-compose');
const getUserInfo = require('../controller/auth');


const about = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
};


const middlewares = compose([router.get('/WxServer/getUserInfo', getUserInfo), router.get('/about', about)]);


module.exports = middlewares