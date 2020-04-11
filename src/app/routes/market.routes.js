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

function generateRandomID() {
  return Math.random().toString(36).substring(7);
}
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

router.post("/addtocart", auth.checkToken, (req, res) => {
  const { ID_cliente, ID_producto, Cantidad } = req.body
  connection.query("SELECT ID_pedido FROM pedido WHERE Activo = 1 AND Fecha_realizacion IS NULL", (err, result) => {
    if (err) { res.json({ success: false }) } else {
      if (result.length > 0) {
        const { ID_pedido } = result[0]
        connection.query("INSERT INTO pedido_articulos SET ?", {
          ID_pedido,
          ID_producto,
          Cantidad
        }, err => {
          console.log(err)
          if (err) {
            res.json({
              success: false
            })
          } else {
            res.json({
              success: true
            })
          }
        })
      } else {
        const ID_pedido = generateRandomID()
        connection.query(
          "INSERT INTO pedido SET ?;" +
          "INSERT INTO pedido_articulos SET ? ;",
          [{
            ID_pedido,
            ID_cliente,
            Fecha_realizacion: null,
            Fecha_estimada: null
          }, {
            ID_pedido,
            ID_producto,
            Cantidad
          }], err => {
            if (err) {
              console.log(err)
              res.json({
                success: false
              })
            } else {
              res.json({
                success: true
              })
            }
          }
        )
      }
    }
  })
})
router.post("/getcart", auth.checkToken, (req, res) => {
  connection.query("SELECT ID_pedido FROM pedido WHERE Activo = 1 AND Fecha_realizacion IS NULL", (err, result) => {
    if (err) { res.json({ success: false }) } else {
      if (result.length > 0) {
        const { ID_pedido } = result[0]
        connection.query("SELECT pedido_articulos.ID_pedido, pedido_articulos.ID_producto, SUM(pedido_articulos.Cantidad)" +
          " AS Cantidad, producto.Nombre, producto.Precio , producto.Precio * SUM(pedido_articulos.Cantidad) AS Total FROM" +
          "pedido_articulos JOIN producto ON producto.ID_producto = pedido_articulos.ID_producto GROUP BY ID_producto WHERE" +
          " pedido_productos.ID_pedido = " + mysql.escape(ID_pedido), (err, result) => {
            if (err) { res.json({ success: false }) } else {
              res.json({
                success: true,
                cart: result
              })
            }
          })
      }else{
        res.json({
          success: true,
          cart: []
        })
      }
    }
  })
})

module.exports = router;