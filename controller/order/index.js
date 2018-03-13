const wxConfig = require('../../config/wxPayConfig');
const cryptoMO = require('crypto'); // MD5算法
const parseString = require('xml2js').parseString; // xml转jsconst
const key = wxConfig.Mch_key; //商户key

function  paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee) {
    var ret = {
        appid: appid,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        openid: openid,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: 'JSAPI'
    };
    var str = raw(ret);
    str = str + '&key=' + key;
    var md5Str = cryptoMO.createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
};

 function raw(args) {
     var keys = Object.keys(args);
     keys = keys.sort();
     var newArgs = {};
     keys.forEach(function (key) {
         newArgs[key.toLowerCase()] = args[key];
     });
 }

/*
 * 根据openid 发起微信支付
 */
router.all('/api/wxpay/unifiedorder', function(req, res, next) {
    //获取参数
    let param = req.query || req.params;
    //获取openid
    let openid = param.openilet;
    // 获取客户端ip
    let spbill_create_ip = req.ip.replace(/::ffff:/, '');
    // 商品描述
    let body = '小程序测试支付';
    // 支付成功的回调地址  可访问 不带参数
    let notify_url = '' ;
    let nonce_str = Math.random().toString(36).substr(2); // 随机字符串,保证签名不可预测
    // 商户订单号
    let out_trade_no = wxConfig.getWxPayOrdrID();
    // 订单价格 单位是 分
    let total_fee = '1';
    // 当前timestamp
    let timestamp = Math.round(new Date().getTime()/1000);
    let bodyData = '<xml>';
    bodyData += '<appid>' + wxConfig.AppID + '</appid>';  // 小程序ID
    bodyData += '<body>' + body + '</body>'; // 商品描述
    bodyData += '<mch_id>' + wxConfig.Mch_id + '</mch_id>'; // 商户号
    bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
    bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址
    bodyData += '<openid>' + openid + '</openid>'; // 用户标识
    bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
    bodyData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>'; // 终端IP
    bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
    bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI
    // 签名
    let sign = paysignjsapi(
        wxConfig.AppID,
        body,
        wxConfig.Mch_id,
        nonce_str,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        total_fee
    );
    bodyData += '<sign>' + sign + '</sign>';
    bodyData += '</xml>';
    // 微信小程序统一下单接口
    var urlStr = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    request({
        url: urlStr,
        method: 'POST',
        body: bodyData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var returnValue = {};
            parseString(body, function (err, result) {
                if (result.xml.return_code[0] == 'SUCCESS') {
                    returnValue.msg = '操作成功';
                    returnValue.status = '100';
                    returnValue.out_trade_no = out_trade_no;  // 商户订单号
                    // 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
                    returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
                    returnValue.timestamp = timestamp.toString(); // 时间戳
                    returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
                    returnValue.paySign = paysignjs(wxConfig.AppID, returnValue.nonceStr, returnValue.package, 'MD5',timestamp); // 签名
                    res.end(JSON.stringify(returnValue));
                } else{
                    returnValue.msg = result.xml.return_msg[0];
                    returnValue.status = '102';
                    res.end(JSON.stringify(returnValue));
                }
            });
        }
    })
});