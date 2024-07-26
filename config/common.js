const en = require("../languages/en");
const { t } = require('localizify');

var common ={

    checkValidation: function(params, rules, res) {
        var messages = {
            "required": t('required'),
            "email": t('email'),
            "integer": t('integer'),
            "in": t('in')
        }
        const v = require('Validator').make(params,rules, messages);
        if (v.fails()) {
            const errors = v.getErrors();
            common.sendResponse(res, "0", Object.values(errors)[0][0], null);
        } else {
            return true;
        }
    },

    sendResponse: function(res, resCode, resMessage, resData, resStatus = 200) {
        var response = {
            "code": resCode,
            "message": resMessage
        }
        if (resData != null) {

            response["data"] = resData;
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.status(resStatus);
        res.json(response);
        res.end();
    },

}

module.exports = common