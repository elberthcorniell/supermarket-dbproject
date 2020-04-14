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
  connection.query('SELECT * FROM view_TopProductos', (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true,
        top10: result
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
  if (categoria == 'ofertas') {
    connection.query("SELECT * FROM Ofertas", (err, result) => {
      const titulo = 'Ofertas'
      res.json({
        success: true,
        titulo,
        productos: result
      })
    })
  } else {
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
  }
})

router.post("/addtocart", auth.checkToken, (req, res) => {
  const { ID_cliente, ID_producto, Cantidad } = req.body
  connection.query("SELECT ID_pedido FROM pedido WHERE Activo = 1 AND Fecha_realizacion IS NULL AND ID_cliente = " + mysql.escape(ID_cliente), (err, result) => {
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
  const { ID_cliente } = req.body
  connection.query("SELECT ID_pedido FROM pedido WHERE Activo = 1 AND Fecha_realizacion IS NULL AND ID_cliente = " + mysql.escape(ID_cliente), (err, result) => {
    if (err) { res.json({ success: false }) } else {
      if (result.length > 0) {
        const { ID_pedido } = result[0]
        connection.query("SELECT pedido_articulos.ID_pedido, pedido_articulos.ID_producto, SUM(pedido_articulos.Cantidad) " +
          "AS Cantidad, producto.Nombre, producto.Precio , producto.Precio * SUM(pedido_articulos.Cantidad) AS Total FROM " +
          "pedido_articulos JOIN producto ON producto.ID_producto  = pedido_articulos.ID_producto " +
          `WHERE pedido_articulos.ID_pedido = ${mysql.escape(ID_pedido)} GROUP BY ID_producto`, (err, result) => {
            if (err) { console.log(err); res.json({ success: false }) } else {
              res.json({
                success: true,
                cart: result
              })
            }
          })
      } else {
        res.json({
          success: true,
          cart: []
        })
      }
    }
  })
})
router.post("/pagarorden", auth.checkToken, (req, res) => {
  const {
    ID_pedido,
    Impuestos,
    Descuento,
    Precio_envio,
    Precio_total
  } = req.body
  connection.query("SELECT ID_mensajero FROM mensajero", (err, result) => {
    if (err) { res.json({ success: false }) } else {
      const { ID_mensajero } = result[Math.floor(Math.random() * result.length)]
      connection.query(`UPDATE pedido SET ? WHERE ID_pedido = ${mysql.escape(ID_pedido)}`, {
        Fecha_realizacion: mysql.raw("CURRENT_TIMESTAMP()"),
        ID_mensajero,
        Impuestos,
        Descuento,
        Precio_envio,
        Precio_total
      }, err => {
        if (err) { console.log(err); res.json({ success: false }) } else {
          res.json({
            success: true
          })
        }
      })
    }
  })
})
router.delete("/eliminarproducto", auth.checkToken, (req, res) => {
  const { ID_pedido, ID_producto } = req.body
  connection.query(`DELETE FROM pedido_articulos WHERE ID_pedido = ${mysql.escape(ID_pedido)} AND ID_producto = ${mysql.escape(ID_producto)}`, err => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true
      })
    }
  })
})
router.post("/cambiarestado", auth.checkToken, (req, res) => {
  const { Tipo, ID_producto, Estado } = req.body
  connection.query(`update Producto	set Estado = ${mysql.escape(Estado)} where ID_producto = ${mysql.escape(ID_producto)}`, (err, result) => {
    if (err) { res.json({ success: false }) } else {
      res.json({ success: true })
    }
  })
})
router.delete("/eliminarproducto/admin", auth.checkToken, (req, res) => {
  const { ID_producto } = req.body
  connection.query(`DELETE FROM producto WHERE ID_producto = ${mysql.escape(ID_producto)}`, err => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true
      })
    }
  })
})
router.get("/getpedidos", auth.checkToken, (req, res) => {
  const { ID_cliente } = req.body
  connection.query(`SELECT ID_pedido FROM pedido WHERE ID_cliente = ${mysql.escape(ID_cliente)}`, (err, result) => {
    if (err) { res.json({ success: false }) } else {
      console.log(result)
      res.json({
        success: true,
        pedidos: result
      })
    }
  })
})
router.get("/getpedidos/mensajero", auth.checkToken, (req, res) => {
  const { ID_mensajero } = req.body
  connection.query(`select pe.ID_pedido, pe.Fecha_realizacion, per.Nombre, pe.Precio_total, d.Sector
  from pedido as pe
  join cliente as c
    on pe.ID_cliente = c.ID_cliente
  join persona as per
    on c.Cedula = per.Cedula
  join direccion as d
    on per.ID_direccion = d.ID_direccion WHERE Activo = 1 AND ID_mensajero = ${mysql.escape(ID_mensajero)}`, (err, result) => {
    if (err) { res.json({ success: false }) } else {
      console.log(result)
      res.json({
        success: true,
        pedidos: result
      })
    }
  })
})
router.post("/setPedidoDone", auth.checkToken, (req, res)=>{
  const {ID_pedido} = req.body
  connection.query("UPDATE pedido SET Activo = 0 WHERE ID_pedido = "+mysql.escape(ID_pedido), (err)=>{
    if(err){}else{
      res.json({
        success: true
      })
    }
  })
})
router.post("/enviarretroalimentacion", auth.checkToken, (req, res) => {
  const { ID_pedido, Productos_recibidos, Estado_productos, Calidad_entrega, Mensaje } = req.body
  connection.query(`INSERT INTO retroalimentacion SET ?`, {
    ID_pedido,
    Productos_recibidos,
    Estado_productos,
    Calidad_entrega,
    Mensaje
  }, (err) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true,
      })
    }
  })
})
router.post("/actualizarproducto", auth.checkToken, (req, res) => {
  const {
    ID_producto,
    Nombre,
    Cantidad,
    Precio,
    Oferta,
    Fecha_expiracion,
    Estado } = req.body
  connection.query(`UPDATE producto SET ? WHERE id_producto = ${mysql.escape(ID_producto)}`, {
    Nombre,
    Cantidad,
    Precio,
    Oferta,
    Fecha_expiracion,
    Estado
  }, err => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true
      })
    }
  })
})
router.post("/agregarproducto", auth.checkToken, (req, res) => {
  const {
    ID_producto,
    Nombre,
    Cantidad,
    ID_categoria,
    Precio,
    Oferta,
    Fecha_expiracion,
    Estado
  } = req.body
  connection.query("INSERT INTO producto SET ?", {
    ID_producto,
    Nombre,
    Cantidad,
    ID_categoria,
    Precio,
    Oferta,
    Fecha_expiracion,
    Estado
  }, (err) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true
      })
    }
  })
})
router.post("/topmensajero", auth.checkToken, (req, res)=>{
  const {fecha_inicial, fecha_final} = req.body
  connection.query(`CALL sp_TopMensajero(${mysql.escape(fecha_inicial)}, ${mysql.escape(fecha_final)})`, (err, result)=>{
    if(err){console.log(err); res.json({success: false})}else{
      res.json({ 
        success: true,
        topmensajero: result[0]
      })
    }
  })
})
router.get("/getClientes/admin", auth.checkToken, (req, res)=>{
  connection.query("SELECT * FROM clientes", (err, result)=>{
    res.json({
      success: true,
      result
    })
  })
})
router.get("/getRetroalimentaciones/admin", auth.checkToken, (req, res)=>{
  connection.query("SELECT * FROM retroalimentacion", (err, result)=>{
    res.json({
      success: true,
      result
    })
  })
})
router.post("/cambiaramensajero", auth.checkToken, (req, res)=>{
  const {Correo_electronico} = req.body
  connection.query("UPDATE cuenta SET Tipo = 'Mensajero' WHERE Correo_electronico = "+mysql.escape(Correo_electronico), (err)=>{
    if(err){console.log(err); res.json({success: false})}else{
      res.json({
        success: true
      })
    }
  })
})
module.exports = router;