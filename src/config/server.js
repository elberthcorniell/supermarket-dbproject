const express = require('express');
const path =  require('path');
const morgan = require('morgan');
const Ddos = require('ddos')
const app = express();
var httpContext = require('express-http-context')
const bodyParser = require("body-parser");
const uuid = require('uuid')
const websocketServer = require('ws').Server
const api = require('binance');
const upload = require('express-fileupload')
const auth = require("./auth");
const axios = require('axios')
const dbConnection = require('./dbconnection');
const connection = dbConnection();
const mysql = require('mysql');

setInterval(() => {
  connection.query("SELECT 1")
}, 5000)
//const vhost = require('vhost'); //subdomain
const binanceWS = new api.BinanceWS(true);
//setting
app.set('port', process.env.port || 3000);
app.use(express.static(path.join(__dirname, '../public')));
var ddos = new Ddos({burst:20, limit:30})
app.use(ddos.express);
app.use(httpContext.middleware);
app.use((req,res,next)=>{
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
  var requestId = req.headers["x-request-id"] || uuid.v4();
  httpContext.set('requestId', requestId);
  res.set('requestId', requestId)
  next();
});
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(morgan('dev'))
.use(express.json())
.use('/api/fund',  require ('../app/routes/fund.routes'))
.use('/api/validate', require ('../app/routes/validation.routes'))
.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/index.html'))
})/*
.use(vhost('app.localhost:3000', __dirname+'../public/app/index.html')))
*/
app.get('/promo', (req,res)=>{
  var caso = Math.random().toFixed()
  caso == 1 ? res.redirect('https://inverte.do') : res.redirect('https://t.me/joinchat/J6-fYEQvK1-AorVY5Ozpng')  
})
app.get('/withdraw/:id', (req,res)=>{
  var id = req.params.id
  res.redirect('https://inverte.do')
  connection.query("UPDATE investment_transaction SET ? WHERE txid = "+mysql.escape(id),{
    validated: true,
    time: currentTimeStamp()
  }, (err,result)=>{
  })
})
app.get('/auth/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/v/index.html'))
})
app.get('/app/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/app/index.html'))
})
app.get('/*', (req,res)=>{
  res.redirect('https://blog.inverte.do/'+req.path)
})

app.use(upload())
app.post('/banner', (req,res)=>{
  var id = uuid.v4()
  var secret = ''
})
app.post('/upload',auth.checkToken, (req,res)=>{
  var id = uuid.v4()
  const username=req.body.username.toLowerCase()
  var key = 'selfie'
  var image = req.files[key].mimetype.split('/')
  if(image[0]=='image'&&(image[1]=='png'||image[1]=='jpeg')){
    req.files[key].mv(__dirname+'/../public/uploaded/'+id+'_'+key+'.'+image[1],err=>{
      if(err){
        console.log(err)
        res.json({
          success: false,
          msg: 'Error saving the '+key+' file.'
        })
      }else{
        key = 'ID'
        req.files[key].mimetype.split('/')
        if(image[0]=='image'&&(image[1]=='png'||image[1]=='jpeg')){
          req.files[key].mv(__dirname+'/../public/uploaded/'+id+'_'+key+'.'+image[1],err=>{
            if(err){
              console.log(err)
              res.json({
                success: false,
                msg: 'Error saving the '+key+' file.'
              })
            }else{
              axios.post('https://oneauth.do/api/validate/kyc/document', {
                username,
                kyc: id,
                from_: 'inverte',
                secret: 'ecZDUVwAf4PbKxvKzfZf8GSDy46sJeezXKFT6Z3g4545DUZuvrtbWzDAXxARucVfmnpV7TNfAdrxfH8vsmcyC4Bw7ENLY7KzBT7mYpnkLQvDg3MDkDUmbxRU2aWwCbRf'
              })
                .then(data => {
                    res.json(data.data)
                })
            }
          })
        }else{
          res.json({
            success: false,
            msg: 'Invalid file or format for '+key
          })
        }
      }
    })

  }else{
    res.json({
      success: false,
      msg: 'Invalid file or format for '+key
    })
  }
})



function currentTimeStamp() {
  return new Date().toJSON().slice(0, 19).replace('T', ' ')
}

module.exports = app;