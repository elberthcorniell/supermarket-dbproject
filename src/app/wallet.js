const bitcore = require("bitcore-lib");
const dbConnection = require("../config/dbconnection");
const connection = dbConnection()
const Mnemonic = require('bitcore-mnemonic')
const https = require('https')
const keys = require("../config/keys");
var mysql = require('mysql');
const nodemailer = require('nodemailer');
const Web3 = require('web3');
var net = require('net');
var uuid = require('uuid');
var web3 = new Web3(new Web3.providers.IpcProvider('/home/ecorniell/.ethereum/geth.ipc', net))
setInterval(() => {
  connection.query("SELECT 1")
}, 5000)
var ERC20_address = []
connection.query("SELECT address FROM user WHERE 1", (err, result) => {
  if (err) { console.log(err) } else {
    result.map(address => {
      if (address.address != null) { ERC20_address.push(address.address.toLowerCase()) }
    })
  }

})

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
      var path = "m/44'/60'/0'/" + result[0].user_id + "'"
      priv = priv.deriveChild(path);
      pub = priv.hdPublicKey;
      var address_priv = priv.privateKey
      var priv = JSON.stringify(priv.privateKey.bn).split('"')[1]
      if (priv.length == 63) {
        priv = priv + '0'
      }
      var secret = keys.secretOrKey + username + ""
      try {
        web3.eth.personal.importRawKey(priv, secret)
          .then(address => {
            ERC20_address.push(address.toLowerCase()) // Update for deposit notify
            save_wallet(username, address)
          });
      } catch (err) { }
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

function isValidETH(address) {
  return web3.utils.isAddress(address)
}
function getERC20Balance(currency, callback){
  const from = '0x781c859689558108e29f5f37d6639b9ac55e2305'
  var currency_decimals = 0
  CONTRACT.map(info=>{
    info.currency== currency ? currency_decimals = info.currency_decimals : ''
  })
  ERC20[currency].methods.balanceOf(from).call({ from }).then(data=>{
    callback(data/currency_decimals)
  })
}
function formatAmount(amount, currency_decimals){
  switch(Math.round(Math.log(currency_decimals)/Math.log(10))){
    case 18: return web3.utils.toWei(parseFloat(amount).toString())
    case 6: return Math.round(amount * currency_decimals)
  }
}
function withdrawERC20(to, amount, invoice_id, currency) {
  var currency_decimals = 0
  CONTRACT.map(info=>{
    info.currency== currency ? currency_decimals = info.currency_decimals : ''
  })
  const from = '0x781c859689558108e29f5f37d6639b9ac55e2305'
  web3.eth.personal.unlockAccount(from, keys.secretOrKey + 'inverte_payments', 6000).then(() => {
    ERC20[currency].methods.balanceOf(from).call({ from })
      .then(data => {
        var balance = data
        console.log(currency+' Balance: ', balance / currency_decimals)
        web3.eth.getBalance(from).then(eth_balance => {
          console.log('ETH Balance: ', eth_balance / currency_decimals)
          if ((balance / currency_decimals) > amount) {
            const send = ERC20[currency].methods.transfer(to,  formatAmount(amount, currency_decimals)).send({ from })
            .then(data => {
              web3.eth.personal.lockAccount(from)
              connection.query("UPDATE investment_transaction SET ? WHERE txid = " + mysql.escape(invoice_id), {
                txid: data.events.Transfer.transactionHash,
                status: true
              }, (err, result) => {
                if (err) { console.log("Error procesing withdraw") } else {
                  //Send email to user to notify procesed withdraw
                }
              })
            })
          } else {
            console.log('Balance is too small')
          }
        })
      })
  })
}

function sendERC20(to, amount, username, currency, res) {
  var currency_decimals = 0
  CONTRACT.map(info=>{
    info.currency== currency ? currency_decimals = info.currency_decimals : ''
  })
  console.log('Sending ' + currency)
  const SEND_TXID =  uuid.v4()
  connection.query("INSERT INTO hosted_transactions SET ?", {
    txid: SEND_TXID,
    username,
    from_: 'Inverte Wallet',
    to_: to,
    value: -1 * (amount + 0.1),
    currency,
    confirmations: 21,
    status: true
  }, (err, result) => {
    if (err) {
      console.log('Error inserting transaction'); console.log(err);
      res.json({
        success: false,
        msg: 'Error sending transaction'
      });
    } else {
      connection.query("SELECT * FROM user WHERE address = " + mysql.escape(to), (err, result) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: 'Error sending transaction'
          })
          connection.query("DELETE FROM `hosted_transactions` WHERE txid = "+mysql.escape(SEND_TXID))
        } else {
          if (result.length > 0) {
            connection.query("INSERT INTO hosted_transactions SET ?", {
              txid: uuid.v4(),
              username: result[0].username,
              from_: username,
              to_: result[0].username,
              value: amount,
              currency,
              confirmations: 21,
              status: true
            }, (err, datata) => {
              if (err) {
                console.log(err);
                res.json({
                  success: false,
                  msg: 'Error sending transaction'
                })
                
                connection.query("DELETE FROM `hosted_transactions` WHERE txid = "+mysql.escape(SEND_TXID))
              } else {
                res.json({
                  success: true,
                })
                sendEmail(result[0].email, currency, amount)
              }
            })
          } else {
            const from = '0x781c859689558108e29f5f37d6639b9ac55e2305'
            web3.eth.personal.unlockAccount(from, keys.secretOrKey + 'inverte_payments', 6000).then(() => {
              ERC20[currency].methods.balanceOf(from).call({ from })
                .then(data => {
                  var balance = data
                  console.log(currency + ' Balance: ', balance / currency_decimals)
                  web3.eth.getBalance(from).then(eth_balance => {
                    console.log('ETH Balance: ', eth_balance / currency_decimals)
                    if ((balance / currency_decimals) > amount) {
                      const send = ERC20[currency].methods.transfer(to, formatAmount(amount, currency_decimals)).send({ from })
                      send.then(data => {
                        web3.eth.personal.lockAccount(from)
                        res.json({
                          success: true,
                        })
                      })
                    } else {
                      console.log('Balance is too small')
                      connection.query("DELETE FROM `hosted_transactions` WHERE txid = "+mysql.escape(SEND_TXID))
                      res.json({
                        success: false,
                        msg: 'Error sending transaction'
                      })
                    }
                  })
                })
            })
          }
        }
      })
    }
  })
}

module.exports = {
  create_wallet_address,
  isValid,
  isValidETH,
  withdrawERC20,
  sendERC20,
  getERC20Balance
}
//Mining monitoring
const WebSocket = require('ws');
var ws = ''
monitoreBitcoin()
function monitoreBitcoin() {
  ws = new WebSocket('wss://ws.blockchain.info/inv');
  ws.on('open', function open() {
    console.log('connected to the bitcoin blockchain')
    ws.send(JSON.stringify({ "op": "blocks_sub" }))
    ws.send(JSON.stringify({ "op": "addr_sub", "addr": '1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9' }))
  });
  ws.on('close', () => {
    monitoreBitcoin()
  })
  ws.on('error', () => {
    monitoreBitcoin()
  })
  ws.on('message', function incoming(data) {
    data = JSON.parse(data)
    console.log(data.op);
    switch (data.op) {
      case "utx":
        data.x.out.map(info => {
          switch (info.addr) {
            case '1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9': //Mining redistribution address
              connection.query("SELECT SUM(packs) FROM mining WHERE status = 1", (err, result) => {
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
                          connection.query("SELECT * FROM mining WHERE status = 1", (err, result) => {
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
          }
        })
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
                      if (i == result.length) {
                        insight.getUnspentUtxos('1C6Vzf4DxBGUFFofew77kX6N1TQ7FZ7Qk9', function (err, utxos) {
                          if(err || utxos == undefined){console.log("Can't detect UTXOS")}else{
                          var trx = new bitcore.Transaction()
                          const hdPrivateKey = bitcore.HDPrivateKey;
                          var priv = new hdPrivateKey(code.toHDPrivateKey()).deriveChild("m/0/0/129'").privateKey
                          var fee = 5500
                          console.log(utxos)
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
                              console.log(Math.abs(parseInt(data.btc_value * 100000000)))
                              trx.to(address[data.username].address, Math.abs(parseInt(data.btc_value * 100000000)))
                            }
                          })
                          trx.fee(fee)
                            .change('1BynCQudKK6S7uMECiQfDa8AWMFcqHjybk')
                            .sign(priv)
                          console.log("transaction = " + trx.verify());
                          console.log("Signature = " + trx.isFullySigned());
                          if (trx.verify() == true && trx.isFullySigned() == true) {
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
                          } else {
                            console.log("Invalid Transaction")
                          }
                        }
                        })
                      }
                    }
                  }
                })
              })
            }
          }
        })
    }
  });
}

var CONTRACT = []
connection.query("SELECT * FROM currencies WHERE ERC20 = 1", (err, result)=>{
  if(err){console.log(err)}else{
    result.map(info =>{
      const {contract_address, currency} = info
      const currency_decimals = Math.pow(10, info.decimals)
      CONTRACT.push({contract_address , currency, currency_decimals})
      mountERC20Wallet(contract_address, currency, currency_decimals)
    })
  }
})
var ERC20 = []
const ERC20JSON = require('./build/contracts/USDT.json');
function mountERC20Wallet(contract_address, currency, currency_decimals) {
  ERC20[currency] = new web3.eth.Contract(ERC20JSON.abi, contract_address, {
    gasPrice: '5000000000',
    gasLimit: 400000,
  })
  web3.eth.getBlockNumber().then(data => {
    ERC20[currency].events.Transfer({
      fromBlock: data - 1000
    }, (err, event) => {
      if (err) { console.log(err) } else {
        event.returnValues.to = event.returnValues.to.toLowerCase()
        if (ERC20_address.indexOf(event.returnValues.to) >= 0) {
          console.log(event.returnValues.value / currency_decimals, currency + ' received for ', event.returnValues.to)
          switch (event.returnValues.to) {
            case '0x7dfd92156a3cf3d2c014f4509682586e2d659a88':
              break;
            case '0x781c859689558108e29f5f37d6639b9ac55e2305':
              console.log("Payment funds added")
              break;
            default: setTimeout(() => {
              var from = event.returnValues.to
              var transaction = event.transactionHash
              connection.query("SELECT username, email FROM user WHERE address = " + mysql.escape(from), (err, result) => {
                if (err) { console.log(err) } else {
                  web3.eth.personal.unlockAccount(from, keys.secretOrKey + result[0].username, 6000).then(() => {
                    ERC20[currency].methods.balanceOf(from).call({ from })
                      .then(data => {
                        var balance = data
                        console.log(currency + ' Balance: ', balance / currency_decimals)
                        web3.eth.getBalance(from).then(eth_balance => {
                          console.log('ETH Balance: ', eth_balance / currency_decimals)
                          if (eth_balance < 1000000000000000) {
                            add_GAS(from, (err, txid) => {
                              if (err) {
                                console.log(err)
                              } else {
                                console.log('Add gas txid', txid)
                                var block = null
                                var Interval = setInterval(() => {
                                  web3.eth.getTransaction(txid, (err, trx_data) => {
                                    if (err) { console.log(err) } else {
                                      block = trx_data.blockNumber // null means is still pending
                                      if (block != null) {
                                        clearInterval(Interval)
                                        const send = ERC20[currency].methods.transfer('0x781c859689558108e29f5f37d6639b9ac55e2305', balance).send({ from })
                                        send.then(data => {
                                          addFunds(transaction, balance / currency_decimals, currency, result[0].username, 'Ethereum Network')
                                          web3.eth.personal.lockAccount(from)
                                          sendEmail(result[0].email, currency, balance / currency_decimals)
                                        })
                                      }
                                    }
                                  })
                                }, 20000)
                              }
                            })
                          } else {
                            if (balance > currency_decimals) {
                              const send = ERC20[currency].methods.transfer('0x781c859689558108e29f5f37d6639b9ac55e2305', balance).send({ from })
                              send.then(data => {
                                addFunds(transaction, balance / currency_decimals, currency, result[0].username, 'Ethereum Network')
                                web3.eth.personal.lockAccount(from)
                                sendEmail(result[0].email, currency, balance / currency_decimals)
                              })
                            } else {
                              console.log('Balance is too small')
                            }
                          }
                        })
                      })
                  })
                }
              })
            }, 1000)
              break;
          }
        }
      }
    })
  })
}

function add_GAS(to, callback) {
  web3.eth.personal.unlockAccount('0x781c859689558108e29f5f37d6639b9ac55e2305', keys.secretOrKey + "inverte_payments", 6000).then(() => {
    web3.eth.sendTransaction({
      from: '0x781c859689558108e29f5f37d6639b9ac55e2305',
      to,
      gasPrice: 5000000000,
      gas: 40000,
      value: '2000000000000000'
    }, (err, hash) => {
      web3.eth.personal.lockAccount('0x781c859689558108e29f5f37d6639b9ac55e2305')
      callback(err, hash);
    })
  })
}

function addFunds(txid, value, currency, username, from_) {
  connection.query('INSERT INTO hosted_transactions SET ?', {
    txid,
    username,
    from_,
    value,
    currency
  }, (err, result) => {
    if (err) { console.log('Error adding ' + username + " funds") }
  })
}

function sendEmail(email, currency, value) {
  var mailOptions = {
    from: 'noreply.bitnation@gmail.com',
    to: email,
    subject: '[Inverte] Deposit received',
    html: '<html><head><link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">'
      + '<style>body{font-family: \'Montserrat\', sans-serif;}.fondo{background-color: #f3f5f7;width: 100%;padding: 20px;text-align: center;color: #a1a1a1; font-size: 14px; line-height : 22px;}'
      + 'button {padding: 10px;background-image: -webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01));border-radius: 5px;margin: 20px;color: white;text-align: center;max-width: 300px;border: 0px solid #FFF}</style></head>'
      + '<body><div class="fondo"><img src="https://inverte.do/dist/images/logo_1.png" style="margin: 20px; width: 200px; display: inline-block" >'
      + '<div style="background-color: #fff; max-width: 600px; display: inline-block; text-align: left; padding: 40px; margin: 20px">'
      + '<p style="font-size: 24px;">Deposit received</p><hr style="border-top: 1px solid #f3f5f7;" /><p>This is a notice that your Inverte\'s account has successfully received <strong>' + value + ' ' + currency + '</strong>. This deposit is still unconfirmed, we will confirm it immediately after two blockchain confirmations.'
      + '<br>If this was not your action and you are concerned about the security of your Inverte account, please contact us immediately.</p>'
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

//verify confirmations for ERC20
setInterval(() => {
  connection.query("SELECT * FROM hosted_transactions WHERE confirmations < 20 AND from_ = 'Ethereum Network'", (err, result) => {
    if (err) { console.log(err) } else {
      result.map(info => {
        web3.eth.getTransaction(info.txid, (err, trx_data) => {
          if (err) { console.log(err) } else {
            // null means is still pending
            if (trx_data.blockNumber != null) {
              web3.eth.getBlockNumber().then(data => {
                var confirmations = data - trx_data.blockNumber
                console.log("Update confirms")
                connection.query('UPDATE hosted_transactions SET ? WHERE txid = ' + mysql.escape(info.txid), {
                  confirmations,
                  status: true
                })
              })
            }
          }
        })
      })


    }
  })
}, 60000)


setInterval(() => {
  connection.query("SELECT * FROM investment_transaction WHERE description = 'Withdraw' AND validated = 1"/* AND time >= now() - interval 5 minute*/+" AND status = 0", (err, result) => {
    if (err) { console.log(err) } else {
      if (result.length > 0) {
        result.map(info => {
          connection.query("SELECT ethereum_address, new FROM user WHERE username = " + mysql.escape(info.username), (err, address) => {
            if (err) { console.log(err) } else {
              var isValid_address = isValidETH(address[0].ethereum_address)
              if (isValid_address) {
                var fee = 1.8
                if (!address[0].new) {
                  fee > (-1 * result[0].value) * 0.1 ? '' : fee = (-1 * result[0].value) * 0.1
                }
                connection.query("UPDATE investment_transaction SET ? WHERE txid = "+mysql.escape(result[0].txid),{
                  status: true
                }, err =>{
                  withdrawERC20(address[0].ethereum_address, (-1 * result[0].value) - fee, result[0].txid, result[0].method);
                })
              }
            }
          })
        })
      }
    }
  })
}, 150000)