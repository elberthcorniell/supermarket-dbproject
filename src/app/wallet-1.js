const bitcore = require("bitcore-lib");
const dbConnection = require("../config/dbconnection");
const connection = dbConnection()
const Mnemonic = require('bitcore-mnemonic')
const https = require('https')
const keys = require("../config/keys");
var mysql = require('mysql');
const nodemailer = require('nodemailer');
setInterval(() => {
  connection.query("SELECT 1")
}, 5000)

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.bitnation@gmail.com',
    pass: 'Bitnation0910'
  }
});

const explorer = require('bitcore-explorers');
const insight = new explorer.Insight();
const crypto = require('crypto')
const currency_BIP = [
  { currency: 'BTC', BIP: 0 },
  { currency: 'USD', BIP: 99 }
]

const hash = crypto.pbkdf2Sync(keys.secretOrKey, 'salt', 2048, 48, 'sha512');
const cipher = crypto.createDecipher('aes-256-cbc', hash);
let decrypted = '';
decrypted += cipher.update(keys.encrypted, 'hex', 'utf8');
decrypted += cipher.final('utf8');
var code = new Mnemonic(decrypted)
var xpriv = code.toHDPrivateKey();

function create_wallet_address(username) {
  var priv, pub = '';
  const hdPrivateKey = bitcore.HDPrivateKey;
  connection.query("SELECT user_id FROM user WHERE username = " + mysql.escape(username), (err, result) => {
    if (result == undefined) { } else {
      priv = new hdPrivateKey(xpriv);
      priv = priv.deriveChild("m/0/0/" + result[0].user_id + "'");
      pub = priv.hdPublicKey;
      var address_priv = priv.privateKey
      var address = address_priv.toAddress()
      save_wallet(username, address)
    }
  })
}
function save_wallet(username, address) {
  connection.query("UPDATE user SET ? WHERE username = " + mysql.escape(username), {
    address
  })
}
function isValid(address) {
  const Address = bitcore.Address
  address = Address.fromString(address)
  return address.isValid()
}

module.exports = {
  create_wallet_address,
  isValid
}
//Wallet monitoring
const WebSocket = require('ws');
var ws = ''
monitoreBitcoin()
function monitoreBitcoin() {
  ws = new WebSocket('wss://ws.blockchain.info/inv');
  ws.on('open', function open() {
    console.log('connected to the bitcoin blockchain')
    ws.send(JSON.stringify({ "op": "blocks_sub" }))
   /* connection.query("SELECT username, address FROM user WHERE 1", (err, result) => {
      result.map(info => {*/
        ws.send(JSON.stringify({ "op": "addr_sub", "addr": '1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9' }))
    /*  }) 
    }) */
  });
  ws.on('close', () => {
    monitoreBitcoin()
  })
  ws.on('message', function incoming(data) {
    data = JSON.parse(data)
    console.log(data.op);
    switch (data.op) {
      case "utx":
        //Create function to send funds to offline address
        /* https.get('https://bitcoinfees.earn.com/api/v1/fees/recommended', response => {
           var satsperByte = ''
           response.on('data', info => {
             satsperByte += info
           })
           response.on('end', () => {
             satsperByte = JSON.parse(satsperByte)
             console.log(satsperByte)*/
        data.x.out.map(info => {
          switch (info.addr) {
            case '1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9': //Mining redistribution address
              connection.query("SELECT SUM(packs) FROM mining", (err, result) => {
                if (err) { console.log(err) } else {
                  pack = 1 / result[0]['SUM(packs)']
                  https.get('https://bitpay.com/api/rates/BTC', response => {
                    var price = ''
                    var bitcoin_price = ''
                    response.on('data', info => {
                      price += info
                    })
                    response.on('end', () => {
                      price = JSON.parse(price)
                      price.map(dat => {
                        if (dat.code == 'USD') {
                          bitcoin_price = dat.rate
                          connection.query("SELECT * FROM mining", (err, result) => {
                            if (err) { console.log(err) } else {
                              connection.query("SELECT * FROM investment_transaction WHERE txid = " + mysql.escape(info.hash), (err, hash) => {
                                if (err) { console.log(err) } else {
                                  if (hash.length > 0) {
                                  } else {
                                    result.map(data => {
                                      connection.query("SELECT new, investment, ROI, 24h FROM user WHERE username = " + mysql.escape(data.username), (err, result) => {
                                        if (err) { console.log(err) } else {
                                          if (result[0].investment > 0) {
                                            //Inserta profit y retiro
                                            connection.query("INSERT INTO investment_transaction SET ?", {
                                              txid: info.hash,
                                              username: data.username,
                                              description: 'Mining pool',
                                              value: 0.9 * (data.packs * pack) * (info.value) * bitcoin_price / 100000000,
                                              btc_value: 0.9 * (data.packs * pack) * (info.value) / 100000000,
                                              method: 'Backoffice',
                                              mining: true,
                                              status: 1
                                            })
                                            connection.query("INSERT INTO investment_transaction SET ?", {
                                              username: data.username,
                                              description: 'Withdraw',
                                              value: -0.9 * (data.packs * pack) * (info.value) * bitcoin_price / 100000000,
                                              btc_value: -0.9 * (data.packs * pack) * (info.value) / 100000000,
                                              method: 'Bitcoin',
                                              mining: true,
                                              status: 0
                                            })
                                          }
                                          if (result[0].new == true) {
                                            connection.query("UPDATE user SET ? WHERE username = " + mysql.escape(data.username), {
                                              ROI: (result[0].ROI + ((data.packs * pack * info.value * 2 * bitcoin_price / 100000000) / result[0].investment) >= 200) ? 0 : (result[0].ROI + ((data.packs * pack * info.value * 2 * bitcoin_price / 100000000) / result[0].investment)),
                                              investment: (result[0].ROI + ((data.packs * pack * info.value * 2 * bitcoin_price / 100000000) / result[0].investment) >= 200) ? 0 : result[0].investment,
                                              '24h': (result[0].ROI + ((data.packs * pack * info.value * 2 * bitcoin_price / 100000000) / result[0].investment) >= 200) ? 0 : result[0]['24h']
                                            })
                                          }
                                        }
                                      })
                                    })
                                  }
                                }
                              })

                            }
                          })
                        }
                      })
                    })
                  })
                }
              })
              break
           /* default:
              connection.query("select email from user where address = " + mysql.escape(info.addr), (err, result) => {
                if (err) { console.log(err); console.log('e aqui 1') } else {
                  if (result.length > 0) {
                    https.get('https://bitpay.com/api/rates/BTC', response => {
                      var price = ''
                      var bitcoin_price = ''
                      response.on('data', info => {
                        price += info
                      })
                      response.on('end', () => {
                        price = JSON.parse(price)
                        price.map(dat => {
                          if (dat.code == 'USD') {
                            bitcoin_price = dat.rate
                            var mailOptions = {
                              from: 'noreply.bitnation@gmail.com',
                              to: result[0].email,
                              subject: '[Inverte] Deposit received',
                              html: '<html><head><link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">'
                                + '<style>body{font-family: \'Montserrat\', sans-serif;}.fondo{background-color: #f3f5f7;width: 100%;padding: 20px;text-align: center;color: #a1a1a1; font-size: 14px; line-height : 22px;}'
                                + 'button {padding: 10px;background-image: -webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01));border-radius: 5px;margin: 20px;color: white;text-align: center;max-width: 300px;border: 0px solid #FFF}</style></head>'
                                + '<body><div class="fondo"><img src="https://inverte.do/dist/images/logo_1.png" style="margin: 20px; width: 200px; display: inline-block" >'
                                + '<div style="background-color: #fff; max-width: 600px; display: inline-block; text-align: left; padding: 40px; margin: 20px">'
                                + '<p style="font-size: 24px;">Deposit received</p><hr style="border-top: 1px solid #f3f5f7;" /><p>This is a notice that your Inverte\'s account has successfully received <strong>' + ((info.value) / 100000000) + ' BTC</strong> equivalent to <strong>' + (((info.value) / 100000000) * bitcoin_price).toFixed(2) + ' USD</strong>. This deposit is still unconfirmed, we will confirm it immediately after two blockchain confirmations.'
                                + '<br>If this was not your action and you are concerned about the security of your Inverte account, please contact us immediately.</p><button  onclick="window.location.href = \'https://inverte.do/auth/login\';">Login now</button>'
                                + '<br><p style="font-size: 12px;">Inverte Team<br>Automated message. please do not reply</p></div><div style="margin: 20px;">2018 - 2019 Bitnation Limited All Rights Reserved </div></div></body><html>'
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                              if (error) {
                                console.log(error);
                              } else {
                                console.log('Email sent: ' + info.response);
                              }
                            })
                            connection.query("SELECT username FROM user where address = " + mysql.escape(info.addr), (err, result) => {
                              if (err) { console.log('e aqui 2') }
                              if (result.length > 0) {
                                connection.query("INSERT INTO hosted_transactions SET ?", {
                                  txid: data.x.hash,
                                  username: result[0].username,
                                  from_: 'Bitcoin Network',
                                  value: ((info.value - 5500) / 100000000) * bitcoin_price,
                                  currency: "BTC",
                                  status: false
                                }, (err, result) => { console.log(result) })
                              }
                            })
                          }
                        })
                      })
                    })

                  }
                }
              })*/
          }
        })/*
        })
      })
*/
        break

      case "block":
        var block = data.x.height
        var tx_block, confirmations = 0

        connection.query("SELECT * FROM investment_transaction WHERE mining = 1 AND status = 0", (err, result) => {
          if (err) { console.log(err) } else {
            if (result.length > 0) {
              var address = []
              var i = 0
              result.map(data => {
                connection.query("SELECT bitcoin_address, email FROM user WHERE username = " + mysql.escape(data.username), (err, result1) => {
                  if (err) { console.log(err) } else {
                    if (result1.length > 0) {
                      console.log('dentro')
                      address[data.username] = { address: result1[0].bitcoin_address, email: result1[0].email }
                      i = i + 1
                      //console.log(i, result.length, i == result.length)
                      if (i == result.length) {
                        insight.getUnspentUtxos('1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9', function (err, utxos) {
                          var trx = new bitcore.Transaction()
                          const hdPrivateKey = bitcore.HDPrivateKey;
                          var priv = new hdPrivateKey(code.toHDPrivateKey()).deriveChild("m/0/0/129'").privateKey
                          var fee = 5500
                          trx.from(utxos)
                          result.map(data => {
                            if (address[data.username].address == null) {
                              connection.query("DELETE FROM `investment_transaction` WHERE `invoice_id` = " + mysql.escape(data.invoice_id))
                              var mailOptions = {
                                from: 'noreply.bitnation@gmail.com',
                                to: address[data.username].email,
                                subject: '[Inverte] Mining packs payment',
                                html: '<html><head><link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">'
                                  + '<style>body{font-family: \'Montserrat\', sans-serif;}.fondo{background-color: #f3f5f7;width: 100%;padding: 20px;text-align: center;color: #a1a1a1; font-size: 14px; line-height : 22px;}'
                                  + 'button {padding: 10px;background-image: -webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01));border-radius: 5px;margin: 20px;color: white;text-align: center;max-width: 300px;border: 0px solid #FFF}</style></head>'
                                  + '<body><div class="fondo"><img src="https://inverte.do/dist/images/logo_1.png" style="margin: 20px; width: 200px; display: inline-block" >'
                                  + '<div style="background-color: #fff; max-width: 600px; display: inline-block; text-align: left; padding: 40px; margin: 20px">'
                                  + '<p style="font-size: 24px;">Mining packs payment</p><hr style="border-top: 1px solid #f3f5f7;" /><p>This is a notice that your Inverte\'s account has successfully received a mining profit of <strong>' + ((-1 * data.btc_value)) + ' BTC</strong> equivalent to <strong>' + (-1 * data.value).toFixed(2) + ' USD</strong>. We have tried to send your profits to your Bitcoin address but it looks like you haven\'t give us one.'
                                  + '<br>If this was not your action and you are concerned about the security of your Inverte account, please contact us immediately.</p><button  onclick="window.location.href = \'https://inverte.do/auth/login\';">Login now</button>'
                                  + '<br><p style="font-size: 12px;">Inverte Team<br>Automated message. please do not reply</p></div><div style="margin: 20px;">2018 - 2019 Bitnation Limited All Rights Reserved </div></div></body><html>'
                              };
                              transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              })
                            } else {
                              trx.to(address[data.username].address, -1 * data.btc_value * 100000000)
                            }
                          })
                          trx.fee(fee)
                            .change('15jxrustEzEZWxERejMmgiaYi58bBL1Cvv')
                            .sign(priv)
                          console.log("transaction = " + trx.verify());
                          console.log("Signature = " + trx.isFullySigned());
                          var again = false
                          do {
                            try {
                              again = false
                              var txSerialized = trx.serialize();
                            } catch (err) {
                              if (err) {
                                again = true
                              }
                            }
                          } while (again)
                          insight.broadcast(txSerialized, function (err, txid) {
                            if (err) { console.log('Error in transaction ' + err) } else {
                              console.log('Transaction should be broadcast: ' + txid);

                              result.map(data => {
                                if (address[data.username].address != null) {
                                  connection.query("UPDATE `investment_transaction` SET ? WHERE `invoice_id` = " + mysql.escape(data.invoice_id), {
                                    status: true
                                  })
                                  var mailOptions = {
                                    from: 'noreply.bitnation@gmail.com',
                                    to: address[data.username].email,
                                    subject: '[Inverte] Mining packs payment',
                                    html: '<html><head><link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">'
                                      + '<style>body{font-family: \'Montserrat\', sans-serif;}.fondo{background-color: #f3f5f7;width: 100%;padding: 20px;text-align: center;color: #a1a1a1; font-size: 14px; line-height : 22px;}'
                                      + 'button {padding: 10px;background-image: -webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01));border-radius: 5px;margin: 20px;color: white;text-align: center;max-width: 300px;border: 0px solid #FFF}</style></head>'
                                      + '<body><div class="fondo"><img src="https://inverte.do/dist/images/logo_1.png" style="margin: 20px; width: 200px; display: inline-block" >'
                                      + '<div style="background-color: #fff; max-width: 600px; display: inline-block; text-align: left; padding: 40px; margin: 20px">'
                                      + '<p style="font-size: 24px;">Mining packs payment</p><hr style="border-top: 1px solid #f3f5f7;" /><p>This is a notice that your Inverte\'s account has successfully received a mining profit of <strong>' + (-1 * (data.btc_value)) + ' BTC</strong> equivalent to <strong>' + (-1 * data.value).toFixed(2) + ' USD</strong>. We sent your profits to your Bitcoin address in this <a href=\'https://www.blockchain.com/btc/tx/' + txid + '\'>transaction</a>'
                                      + '<br>If this was not your action and you are concerned about the security of your Inverte account, please contact us immediately.</p><button  onclick="window.location.href = \'https://inverte.do/auth/login\';">Login now</button>'
                                      + '<br><p style="font-size: 12px;">Inverte Team<br>Automated message. please do not reply</p></div><div style="margin: 20px;">2018 - 2019 Bitnation Limited All Rights Reserved </div></div></body><html>'
                                  };
                                  transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  })
                                }
                              })
                            }
                          })
                        })
                      }
                    }
                  }
                })
              })
            }
          }
        })

/*
        connection.query("SELECT txid FROM hosted_transactions WHERE confirmations < 2 AND currency = 'BTC'", (err, result) => {
          //verify txid confirmations 
          result.map(tx => {
            https.get('https://blockchain.info/rawtx/' + tx.txid, response => {
              var data = ''
              response.on('data', info => {
                data += info
              })
              response.on('end', () => {
                data = JSON.parse(data)
                data.out.map(data => {
                  insight.getUnspentUtxos(data.addr, function (err, utxos) {
                    var balance = 0
                    utxos.map(info => {
                      balance = balance + info.satoshis
                    })
                    if (err || balance <= 0) { console.log(err) } else {
                      connection.query("select user_id from user where address = " + mysql.escape(data.addr), (err, result) => {
                        if (err) { console.log(err) } else {
                          if (result.length > 0) {
                            var trx = new bitcore.Transaction()
                            const hdPrivateKey = bitcore.HDPrivateKey;
                            var priv = new hdPrivateKey(code.toHDPrivateKey()).deriveChild("m/0/0/" + result[0].user_id + "'").privateKey
                            var fee = 5500/*(181 + 34 + 10) * satsperByte.hourFee
                          if (fee < 5500) {
                            fee = 5500
                          }*//*
                            console.log(balance)
                            if (balance > fee) {
                              trx.from(utxos)
                                .to('15jxrustEzEZWxERejMmgiaYi58bBL1Cvv', balance - fee)
                                .sign(priv)
                              console.log(balance - fee)
                              console.log("transaction = " + trx.verify());
                              console.log("Signature = " + trx.isFullySigned());
                              var again = false
                              do {
                                try {
                                  again = false
                                  var txSerialized = trx.serialize();
                                } catch (err) {
                                  if (err) {
                                    again = true
                                  }
                                }
                              } while (again)
                              insight.broadcast(txSerialized, function (err, txid) {
                                if (err) { console.log('Error in transaction ' + err) } else {
                                  console.log('Transaction should be broadcast: ' + txid);
                                }
                              })
                            } else {
                              console.log('Not enought balance')
                            }
                          }
                        }
                      }
                      )
                    }
                  })
                })
                data.block_height != undefined ? tx_block = data.block_height : tx_block = block
                confirmations = block - tx_block
                connection.query("UPDATE hosted_transactions SET ? WHERE txid = " + mysql.escape(tx.txid), {
                  confirmations,
                  status: confirmations >= 2 ? true : false,
                })
              })
            })
          })
        })
        break*/
    }
  });
}