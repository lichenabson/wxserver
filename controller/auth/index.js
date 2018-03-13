const axios = require('axios');
const wxConfig = require('../../config/wxPayConfig');

const getUserInfo = async (ctx ,next) => {
    if(!ctx.request.query.code) ctx.throw(400, 'code required');
    //换取openid
    let url='https://api.weixin.qq.com/sns/jscode2session';
    await axios.get(url,{
        params: {
            appid: wxConfig.AppID,
            secret:wxConfig.Secret,
            js_code:ctx.request.query.code,
            grant_type:'authorization_code'

        }
    }).then(function (response) {
        if(response.data.errmsg) ctx.throw(500, response.data.errmsg);
        ctx.response.body=response.data.openid
    }).catch(function (error) {
        console.log(error);
    });
    next();
};

module.exports = getUserInfo;