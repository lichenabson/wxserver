/* 微信参数AppID 和 Secret */
const wxConfig = {
    AppID: "wx04448fb21f821b41",//"wxc29138f4f6ea7d8a",  // 小程序ID
    Secret: "630edc043127b0a9f0106d1b52d64059",  // 小程序Secret
    Mch_id: "1271726601", // 商户号
    Mch_key: "A1E6BA5B07F7F52A01B713F3DE5C40C3", // 商户key
    // 生成商户订单号
    getWxPayOrdrID: function(){
        let myDate = new Date();
        let year = myDate.getFullYear();
        let mouth = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let hour = myDate.getHours();
        let minute = myDate.getMinutes();
        let second = myDate.getSeconds();
        let msecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
        if(mouth < 10){ /*月份小于10  就在前面加个0*/
            mouth = String(String(0) + String(mouth));
        }
        if(day < 10){ /*日期小于10  就在前面加个0*/
            day = String(String(0) + String(day));
        }
        if(hour < 10){ /*时小于10  就在前面加个0*/
            hour = String(String(0) + String(hour));
        }
        if(minute < 10){ /*分小于10  就在前面加个0*/
            minute = String(String(0) + String(minute));
        }
        if(second < 10){ /*秒小于10  就在前面加个0*/
            second = String(String(0) + String(second));
        }
        if (msecond < 10) {
            msecond = String('00' + String(second));
        } else if(msecond >= 10 && msecond < 100){
            msecond = String(String(0) + String(second));
        }

        var currentDate = String(year) + String(mouth) + String(day) + String(hour) + String(minute) + String(second) + String(msecond);
        return currentDate;
    }
};
module.exports = wxConfig;