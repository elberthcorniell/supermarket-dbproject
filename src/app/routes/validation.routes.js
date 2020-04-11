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
const http = require('http')
setInterval(() => {
  connection.query("SELECT 1")
}, 5000)

function generateRandomID(){
  return Math.random().toString(36).substring(7);
}

router.post("/register", (req, res) => {
  var {Correo_electronico, Contraseña, Tipo} = req.body;
  connection.query("INSERT INTO cuenta SET ?; SELECT ID_Cuenta FROM cuenta WHERE Correo_electronico = "+mysql.escape(Correo_electronico) ,{
    Correo_electronico,
    Contraseña,
    Tipo
  }, (err, result) => {
    if (err) {console.log(err),res.json({ success: false, msg: 'Correo electronico ya ha sido utilizado' }) } else {
      const{ID_Cuenta} = result[1][0]
      res.json({
        success: true,
        msg: 'Account successfully created',
        ID_Cuenta
      })
    }
  })
})
router.post("/register/direccion", (req, res) => {
  var {Municipio, Sector, Barrio, Calle, N_Residencia} = req.body;
  const ID_direccion = generateRandomID()
  connection.query("INSERT INTO direccion SET ?",{
    ID_direccion,
    Municipio, 
    Sector, 
    Barrio, 
    Calle, 
    N_Residencia
  }, (err, result) => {
    if (err) {console.log(err),res.json({ success: false, msg: 'Error actualizando la direccion.' }) } else {
      res.json({
        success: true,
        msg: 'Direccion creada correctamente',
        ID_direccion
      })
    }
  })
})
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { username, password } = req.body;
  axios.post('https://oneauth.do/api/validate/login', {
    username,
    password
  })
    .then(data => {
      if (data.data.success) {
        connection.query("SELECT username FROM user WHERE username = " + mysql.escape(username), (err, result) => {
          if (err) { console.log(err); res.json({ success: false }) } else {
            if (result.length >= 1) {
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
                  const payload = {
                    name: username
                  };
    
                  jwt.sign(payload, keys.secretOrKey,
                    {
                      expiresIn: 18000
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
  const {username, password, new_password} = req.body;

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


module.exports = router;

