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

function generateRandomID() {
  return Math.random().toString(36).substring(7);
}

router.post("/register", (req, res) => {
  var { Correo_electronico, Contraseña, Tipo } = req.body;
  connection.query("INSERT INTO cuenta SET ?; SELECT ID_Cuenta FROM cuenta WHERE Correo_electronico = " + mysql.escape(Correo_electronico), {
    Correo_electronico,
    Contraseña,
    Tipo
  }, (err, result) => {
    if (err) { console.log(err), res.json({ success: false, msg: 'Correo electronico ya ha sido utilizado' }) } else {
      const { ID_Cuenta } = result[1][0]
      res.json({
        success: true,
        msg: 'Account successfully created',
        ID_Cuenta
      })
    }
  })
})
router.post("/register/direccion", (req, res) => {
  var { Municipio, Sector, Barrio, Calle, N_Residencia } = req.body;
  const ID_direccion = generateRandomID()
  connection.query("INSERT INTO direccion SET ?", {
    ID_direccion,
    Municipio,
    Sector,
    Barrio,
    Calle,
    N_Residencia
  }, (err, result) => {
    if (err) { console.log(err), res.json({ success: false, msg: 'Error actualizando la direccion.' }) } else {
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
    return res.json(errors);
  }
  const { Correo_electronico, Contraseña } = req.body;
  connection.query("SELECT persona.Cedula, cuenta.ID_cuenta, cliente.ID_cliente, cuenta.Tipo FROM cuenta JOIN persona ON cuenta.ID_cuenta = persona.ID_cuenta JOIN cliente ON cliente.Cedula = persona.Cedula WHERE Correo_electronico = " + mysql.escape(Correo_electronico) + " AND Contraseña = " + mysql.escape(Contraseña), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      if (result.length >= 1) {
        const { ID_cuenta, ID_cliente, Tipo, Cedula } = result[0]
        const payload = {
          Correo_electronico,
          ID_cuenta,
          ID_cliente,
          Tipo,
          Cedula
        };
        jwt.sign(payload, keys.secretOrKey,
          {
            expiresIn: 18000 // 3 min in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token,
              Tipo
            });
          }
        );
      } else {
        res.json({
          success: false,
          username_err: 'Wrong credentials'
        })
      }
    }
  })
});

router.post("/verify", auth.checkToken, (req, res) => {
  res.json({
    success: true,
    ...req.body
  })
})
module.exports = router;

