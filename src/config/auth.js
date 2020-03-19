const isEmpty = require("is-empty");
let jwt = require('jsonwebtoken');
const config = require('./keys.js');
const fs = require('fs');
let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || ''; // Express headers are auto converted to lowercase
  if(isEmpty(token)||token===''||token===undefined||token=='null'){
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }else{
    var base64Url = token.split('.')[1];
    var decodedValue = JSON.parse(Buffer.from(base64Url, 'base64'));
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.substr("Bearer ".length);
    }
  
    if (token) {
      jwt.verify(token, config.secretOrKey, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.body.username = decodedValue.name
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  }
  
};

module.exports = {
  checkToken: checkToken
}