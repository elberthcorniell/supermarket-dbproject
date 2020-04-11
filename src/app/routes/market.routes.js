const express = require('express');
const router = express.Router();
const dbConnection = require('../../config/dbconnection');
const connection = dbConnection();
const auth = require("../../config/auth");
const mysql = require('mysql');
const https = require('https')
const http = require('http')
const uuid = require('uuid')
const axios = require('axios');
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.bitnation@gmail.com',
    pass: 'Bitnation0910'
  }
});

setInterval(() => {
  connection.query("SELECT 1")
}, 5000)

router.get('/gettop10', (req, res) => {
  connection.query('SELECT * FROM view_TopProductos', (result, err) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: 'true'
      })
    }
  })
})
router.get('/getCategorias', (req, res) => {
  connection.query("SELECT * FROM categoria_producto", (err, result) => {
    if (err) { res.json({ success: false }) } else {
      res.json({
        success: true,
        result
      })
    }
  })
})
router.get('/productos/:categoria', (req, res) => {
  const { categoria } = req.params
  connection.query("SELECT Nombre AS titulo FROM categoria_producto WHERE ID_categoria = " + mysql.escape(categoria), (err, result) => {
    const { titulo } = result[0]
    connection.query("SELECT * FROM producto WHERE ID_categoria = " + mysql.escape(categoria), (err, result) => {
      if (err) { res.json({ success: false }) } else {
        res.json({
          success: true,
          titulo,
          productos: result
        })
      }
    })
  })
})


module.exports = router;