const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbConnection = require("../../config/dbconnection");
const validateRegisterInput = require("../../public/validation/register");
const validateLoginInput = require("../../public/validation/login");
var mysql = require('mysql');
const keys = require("../../config/keys");
const auth = require("../../config/auth");
const connection = dbConnection();
const axios = require('axios');
const Wallet = require('../wallet')
const http = require('http')/*
var i = 0
setInterval(()=>{
  connection.query("SELECT * FROM user WHERE address IS NULL", (err, result)=>{
    if(result[i].username!=undefined){
    new Wallet.create_wallet_address(result[i].username)
    console.log(result[i].username, 'Done')
    }
  })
  i = i + 1
}, 3000)*/
setInterval(() => {
  connection.query("SELECT 1")
}, 5000)
router.post("/register", (req, res) => {
  const username = req.body.username2;
  const email = req.body.email2;
  const password = req.body.password2;
  const address = '';
  var sponsor = req.body.sponsor;/*
  if (sponsor == '' || sponsor == undefined) {
    const index = (Math.random() * 5).toFixed();
    const leaders = ['yoelfco', 'elberthcorniell', 'noel3098', 'miguelegm', 'Nelsoncosme', 'Clsdiaz']
    sponsor = leaders[index]
  }*/
  connection.query("SELECT username FROM user WHERE network = 1 AND username = " + mysql.escape(sponsor), (err, result1) => {
    if (err) { console.log(err); res.status(400).json({ success: false }) } else {
      if (result1.length >= 1) {

        axios.post('https://oneauth.do/api/validate/register', {
          username2: username,
          password2: password,
          email2: email
        })
          .then(data => {
            if (data.data.success == true) {

              connection.query("INSERT INTO user SET ?", {
                username,
                sponsor,
                email
              }, (err, resutl) => {
                if (err) { console.log(err); res.status(400).json({ success: false }) } else {
                  const wallet = new Wallet.create_wallet_address(username)
                  res.json({
                    success: true
                  })
                }
              })

            } else {
              res.json(data.data)
            }
          }).catch(err => {
            console.log(err)
          })
      } else {
        res.json({
          success: false,
          sponsor_err: 'Invalid sponsor'
        })
      }
    }
  })
})
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;
  const ip = req.body.ip;
  const location = req.body.location;
  const os = req.body.os;
  axios.post('https://oneauth.do/api/validate/login', {
    username,
    password
  })
    .then(data => {
      if (data.data.success) {
        connection.query("SELECT username FROM user WHERE username = " + mysql.escape(username), (err, result) => {
          if (err) { console.log(err); res.json({ success: false }) } else {
            if (result.length >= 1) {
              connection.query("INSERT INTO account_activity SET ?",{
                ip,
                username,
                location,
                os
              })
              const payload = {
                name: data.data.username
              };

              jwt.sign(payload, keys.secretOrKey,
                {
                  expiresIn: 1800 // 3 min in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: token,
                    username
                  });
                }
              );
            } else {
              connection.query("INSERT INTO user SET ?", {
                username,
                email: data.data.email
              }, (err, resutl) => {
                if (err) { console.log(err); res.status(400).json({ success: false }) } else {
                  const wallet = new Wallet.create_wallet_address(username)
                  const payload = {
                    name: username
                  };
    
                  jwt.sign(payload, keys.secretOrKey,
                    {
                      expiresIn: 18000 // 3 min in seconds
                    },
                    (err, token) => {
                      res.json({
                        success: true,
                        token: token,
                        username
                      });
                    }
                  );
                }
              })
            }
          }
        })

      } else {
        res.json(data.data)
      }
    })
    .catch((error) => {
      res.json({
        success: false,
        password_err: 'Network failed'
      })
    })
});

router.post("/password/change", auth.checkToken, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const new_password = req.body.new_password;

  axios.post('https://oneauth.do/api/validate/password/change', {
    username,
    password,
    new_password
  })
    .then(data => {
      console.log(data.data)
      res.json(data.data)
    })
    .catch((error) => {
      res.json({
        success: false,
        password_err: 'Network failed'
      })
    })
});
router.post("/password/recover", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const mnemonic = req.body.mnemonic;
  console.log(req.body)
  axios.post('https://oneauth.do/api/validate/password/recover', {
    username,
    password,
    mnemonic
  })
    .then(data => {
      console.log(data.data)
      res.json(data.data)
    })
    .catch((error) => {
      console.log(error)
      res.json({
        success: false,
        password_err: 'Network failed'
      })
    })
});
router.post("/kyc/level", auth.checkToken, (req, res) => {
  const secret = 'ecZDUVwAf4PbKxvKzfZf8GSDy46sJeezXKFT6Z3g4545DUZuvrtbWzDAXxARucVfmnpV7TNfAdrxfH8vsmcyC4Bw7ENLY7KzBT7mYpnkLQvDg3MDkDUmbxRU2aWwCbRf'
  const username = req.body.username
  axios.post('https://oneauth.do/api/validate/kyc/level', {
    username,
    secret,
  })
    .then(data => {
      res.json(data.data)
    })
    .catch((error) => {
      res.json({
        success: false,
        password_err: 'Network failed'
      })
    })
});
router.post("/email/validate", auth.checkToken, (req, res) => {
  const secret = 'ecZDUVwAf4PbKxvKzfZf8GSDy46sJeezXKFT6Z3g4545DUZuvrtbWzDAXxARucVfmnpV7TNfAdrxfH8vsmcyC4Bw7ENLY7KzBT7mYpnkLQvDg3MDkDUmbxRU2aWwCbRf'
  const username = req.body.username
  axios.post('https://oneauth.do/api/validate/email/validate', {
    username,
    secret,
  })
    .then(data => {
      console.log(data.data)
      res.json(data.data)
    })
    .catch((error) => {
      console.log(error)
      res.json({
        success: false,
        password_err: 'Network failed'
      })
    })
});
router.get("/ip/:ip", (req,res)=>{
  http.get('http://ip-api.com/json/'+req.params.ip, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    resp.on('end', () => {
      data = JSON.parse(data)
      data = data.city+', '+data.regionName+', '+data.country
      res.json({
        success: true,
        location: data
      })
    });
  })
})
router.post("/set/token", auth.checkToken, (req,res)=>{
  const username = req.body.username
  const token = req.body.token
  console.log(token)
  connection.query("UPDATE user SET ? WHERE username = "+mysql.escape(username),{
    '2fa': token
  }, (err,result)=>{
    if(err){console.log(err);res.json({success: false})}else{
      res.json({
        success: true
      })
    }
  })
})

module.exports = router;

