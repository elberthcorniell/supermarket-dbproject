const express = require('express');
const path =  require('path');
const morgan = require('morgan');
const Ddos = require('ddos')
const app = express();
const bodyParser = require("body-parser");
const uuid = require('uuid')
const upload = require('express-fileupload')
const auth = require("./auth");
const axios = require('axios')
const dbConnection = require('./dbconnection');
const connection = dbConnection();

setInterval(() => {
  connection.query("SELECT 1")
}, 5000)
app.set('port', process.env.port || 3000);
app.use(express.static(path.join(__dirname, '../public')));
var ddos = new Ddos({burst:20, limit:30})
app.use(ddos.express);
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(morgan('dev'))
.use(express.json())
.use('/api/market',  require ('../app/routes/market.routes'))
.use('/api/validate', require ('../app/routes/validation.routes'))
app.get('/auth/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/v/index.html'))
})
.get('/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/app/index.html'))
})
.get('/admin/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../public/app/admin.html'))
})

app.use(upload())
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