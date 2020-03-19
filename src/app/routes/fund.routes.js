const express = require('express');
const router = express.Router();
const dbConnection = require('../../config/dbconnection');
const connection = dbConnection();
const explorer = require('bitcore-explorers');
const Mnemonic = require('bitcore-mnemonic');
const auth = require("../../config/auth");
const mysql = require('mysql');
const Wallet = require('../wallet')
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

router.get('/banner', (req, res) => {
  connection.query("SELECT * FROM banner_table", (err, result) => {
    if (err) { console.log(err) } else {
      res.json({
        banner: result.reverse()
      })
    }
  })
})


router.post('/balance', auth.checkToken, (req, res) => {
  var username = req.body.username
  connection.query("SELECT SUM(value) FROM investment_transaction WHERE username = " + mysql.escape(username) +
    "UNION SELECT SUM(value) FROM investment_transaction WHERE value > 0 AND username = " + mysql.escape(username)
    , (err, result) => {
      if (err) { console.log(err) } else {
        if (result.length >= 1) {
          res.json({
            success: true,
            total_balance: result[0]['SUM(value)'] == null ? 0 : result[0]['SUM(value)'],
            lifetime_balance: result.length < 2 ? 0 : (result[1]['SUM(value)'] == null ? 0 : result[1]['SUM(value)'])
          })
        } else {
          res.json({
            success: false,
            message: 'No data'
          })
        }
      }
    })
})
router.post("/withdraw", auth.checkToken, (req, res) => {
  const username = req.body.username
  const amount = req.body.amount
  new Wallet.getERC20Balance(req.body.method, (data) => {
    if (data > amount) {
      connection.query("SELECT SUM(value) FROM investment_transaction WHERE username = " + mysql.escape(username), (err, result) => {
        if (err) { console.log(err); res.json({ success: false, msg: 'Connection error' }) } else {
          if (result[0]['SUM(value)'] < amount) {
            res.json({
              success: false,
              msg: 'Insuficent balance'
            })
          } else {
            var txid = uuid.v4()
            connection.query("INSERT INTO investment_transaction SET ?", {
              username,
              value: -amount,
              description: 'Withdraw',
              txid,
              method: req.body.method
            }, (err, result) => {
              if (err) { console.log(err); res.json({ success: false, msg: 'Connection error' }) } else {
                res.json({
                  success: true,
                  msg: 'Successful withdrawl'
                })

                //Enviar 
                connection.query("SELECT email FROM user WHERE username = " + mysql.escape(username), (err, result) => {
                  if (err) { console.log(err); res.json({ success: false, msg: 'Connection error' }) } else {
                    var mailOptions = {
                      from: 'noreply.bitnation@gmail.com',
                      to: result[0].email,
                      subject: '[Inverte] Withdrawal Request',
                      html: '<html><head><link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">'
                        + '<style>body{margin: 0px; padding: 0px; font-family: \'Montserrat\', sans-serif;}.fondo{background-color: #f3f5f7;width: 100%;padding: 20px;text-align: center;color: #a1a1a1; font-size: 18px; line-height : 30px;}'
                        + 'button {padding: 10px;background-image: -webkit-gradient(linear, left top, right bottom, from(#fc6909), to(#f99f01));border-radius: 5px;margin: 20px;color: white;text-align: center;max-width: 300px;border: 0px solid #FFF}</style></head>'
                        + '<body><div class="fondo"><img src="https://inverte.do/dist/images/logo_1.png" style="margin: 20px; width: 200px; display: inline-block" >'
                        + '<div style="background-color: #fff; max-width: 600px; display: inline-block; text-align: left; padding: 40px; margin: 20px">'
                        + '<p style="font-size: 24px;">Withdrawal Request</p><hr style="border-top: 1px solid #f3f5f7;" /><p>There has been a request to withdraw <strong>' + amount + ' ' + req.body.method + '</strong> from your Inverte\'s account.'
                        + '<div style="padding: 5px; margin: 10px; width: 100% background-color: #f99f01; border-radius: 5px; text-align: center" ><a href=\'https://inverte.do/withdraw/' + txid + '\' >Confirm Withdrawal</a><div>'
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
                })


              }
            })
          }

        }
      })
    } else {
      res.json({
        success: false,
        msg: 'Can\'t process ' + req.body.method + ' withdrawals right now.'
      })
    }
  })
})
router.post('/activity', auth.checkToken, (req, res) => {
  const username = req.body.username
  connection.query("SELECT * FROM account_activity WHERE username = " + mysql.escape(username) + " ORDER BY id DESC LIMIT 3 ", (err, result) => {
    if (err) { console.log(err); res.status(500).json({ success: false }) } else {
      res.json({
        success: true,
        result: result.reverse()
      })
    }
  })
})
router.post("/balance/network", auth.checkToken, (req, res) => {
  var username = req.body.username
  connection.query("SELECT SUM(value) FROM investment_transaction WHERE  network = 1 AND username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true,
        network_balance: result[0]['SUM(value)']
      })
    }
  })
})
router.post('/data', auth.checkToken, (req, res) => {
  connection.query("SELECT investment FROM user WHERE username = " + mysql.escape(req.body.username) +
    "UNION SELECT SUM(usd) FROM payment WHERE status = 'Done' AND type = 'Investment' AND username = " + mysql.escape(req.body.username)
    , (err, result) => {
      if (err) { console.log(err); res.json({ success: false }) } else {
        if (result.length >= 1) {
          res.json({
            success: true,
            plan: result[0].investment,
            lifetime_investment: result[1] == undefined ? 0 : result[1].investment
          })
        } else {
          res.json({
            success: false,
            message: 'No data'
          })
        }
      }
    })
})
router.post('/AUM', auth.checkToken, (req, res) => {
  connection.query("SELECT (SELECT SUM(investment * 50) FROM user) AS AUM, (SELECT SUM(percent) FROM daily_payment WHERE plan = 'Apprentice Gold' OR plan = 'Bronze' AND users > 0 AND time >= DATE_SUB(NOW(),INTERVAL 365 DAY)) AS AAR", (err, result) => {
    if (err) { console.log(err) } else {
      if (result.length >= 1) {
        const { AUM, AAR } = result[0]
        res.json({
          success: true,
          AUM,
          AAR
        })
      } else {
        res.json({
          success: false,
          message: 'No data'
        })
      }
    }
  })
})

router.get('/token', (req, res) => {
})

router.post('/get', auth.checkToken, (req, res) => {
})

router.post('/verify', auth.checkToken, (req, res) => {
  res.json({
    success: true,
    username: req.body.username
  })
})
router.post('/unlock', auth.checkToken, (req, res) => {
  const username = req.body.username
  const password = req.body.password
  axios.post('https://oneauth.do/api/validate/login', {
    username,
    password
  })
    .then(data => {
      if (data.data.success) {
        connection.query("SELECT investment FROM user WHERE username = " + mysql.escape(username), (err, result) => {
          if (err) { console.log(err); res.json({ success: false, msg: 'Error reading data' }) } else {
            if (result.length > 0) {
              connection.query("UPDATE user SET ? WHERE username = " + mysql.escape(username), {
                investment: 0
              })
              var value = result[0].investment * 50
              connection.query("SELECT SUM(value) FROM investment_transaction WHERE username = " + mysql.escape(username), (err, datt) => {
                if (datt[0]['SUM(value)'] != null && datt[0]['SUM(value)'] < 0) {
                  value = value + datt[0]['SUM(value)']
                }
                connection.query("SELECT currency FROM payment WHERE username = " + mysql.escape(username) + " ORDER by invoice_id DESC", (err, result) => {
                  connection.query("INSERT INTO hosted_transactions SET ?", {
                    txid: uuid.v4(),
                    username,
                    from_: 'Investment unlock',
                    value,
                    currency: result[0].currency,
                    confirmations: 2,
                    status: 1
                  }, (err) => {
                    if (err) { console.log(err); res.json({ success: false, msg: 'Error setting data' }) } else {
                      if (datt[0]['SUM(value)'] != null && datt[0]['SUM(value)'] < 0) {
                        connection.query("INSERT INTO investment_transaction SET ?", {
                          username,
                          description: 'Unlock adjustment',
                          value: -1 * datt[0]['SUM(value)'],
                          method: 'Backoffice',
                          status: true
                        })
                      }
                      res.json({
                        success: true,
                        msg: 'update'
                      })
                    }
                  })
                })
              })
            } else {
              res.json({
                success: false
              })
            }
          }
        })
      } else {
        console.log(data.data)
        res.json({
          success: false,
          msg: 'Incorrect password'
        })
      }
    })
})
router.post('/ROI', auth.checkToken, (req, res) => {
  const username = req.body.username;
  connection.query("SELECT ROI, new, email, address, leverage, network, 2fa, inactive_days FROM user WHERE username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false }) } else {
      if (result.length != undefined & result.length > 0) {
        res.json({
          success: true,
          ROI: result[0].ROI,
          address: result[0].address,
          inactive: result[0].inactive_days > 30 ? true : false,
          leverage: result[0].leverage,
          network: result[0].network,
          email: result[0].email,
          new: result[0].new,
          '2fa': result[0]['2fa']
        })
      }
    }
  })
})
router.post('/history', auth.checkToken, (req, res) => {
  const username = req.body.username;
  connection.query("SELECT * FROM investment_transaction WHERE value > 0 AND username = " + mysql.escape(username) + " ORDER BY invoice_id DESC LIMIT 30 ", (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false }) } else {
      if (result.length != undefined & result.length > 0) {
        res.json({
          result: result.reverse()
        })
      }
    }
  })
})
router.post('/wallet', auth.checkToken, (req, res) => {
  var username = req.body.username
  var balance = []
  var total_balance = 0
  var unconfirmed_balance = 0
  connection.query("SELECT * FROM currencies WHERE ERC20 = 1", (err, result) => {
    if (err) { console.log(err); res.json({ success: false, message: 'err' }) } else {
      var i = 0
      result.map(info => {
        connection.query("SELECT SUM(value) FROM hosted_transactions WHERE status = 1 AND currency =" + mysql.escape(info.currency) + " AND username = " + mysql.escape(username),
          (err, confirmed) => {
            if (err) { console.log(err); res.json({ success: false, message: 'err' }) } else {
              connection.query("SELECT SUM(value) FROM hosted_transactions WHERE status = 0 AND currency =" + mysql.escape(info.currency) + " AND username = " + mysql.escape(username),
                (err, unconfirmed) => {
                  if (err) { console.log(err); res.json({ success: false, message: 'err' }) } else {
                    balance.push({
                      currency: info.currency,
                      balance: confirmed[0]['SUM(value)'] == null ? 0 : confirmed[0]['SUM(value)'],
                      unconfirmed_balance: unconfirmed[0]['SUM(value)'] == null ? 0 : unconfirmed[0]['SUM(value)'],
                      disabled: info.disabled
                    })
                    total_balance = total_balance + (confirmed[0]['SUM(value)'] == null ? 0 : confirmed[0]['SUM(value)'])
                    unconfirmed_balance = unconfirmed_balance + (unconfirmed[0]['SUM(value)'] == null ? 0 : unconfirmed[0]['SUM(value)'])
                    i = i + 1
                    if (i == result.length) {
                      res.json({
                        success: true,
                        balance,
                        total_balance,
                        unconfirmed_balance
                      })
                    }
                  }
                })
            }
          })
      })
    }
  })

})
router.post('/wallet/send', auth.checkToken, (req, res) => {
  const username = req.body.username
  const to = req.body.to
  const amount = parseFloat(req.body.amount)
  const currency = req.body.currency
  console.log('Trying to send PAX')
  connection.query("SELECT SUM(value) FROM hosted_transactions WHERE status = 1 AND currency = " + mysql.escape(currency) + " AND username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false, msg: 'err' }) } else {
      if (result.length > 0) {
        console.log(typeof amount)
        console.log('Balance: ', result[0]['SUM(value)'], ' Amount: ', amount)
        if (result[0]['SUM(value)'] >= (amount + 0.1)) {
          new Wallet.sendERC20(to, amount, username, currency, res)
        } else {
          res.json({
            success: false,
            msg: 'Error reading your balance'
          })
        }
      } else {
        res.json({
          success: false,
          msg: 'Error reading your balance'
        })
      }
    }
  })
})
router.post("/packs", auth.checkToken, (req, res) => {
  const username = req.body.username
  connection.query("SELECT SUM(packs) FROM mining WHERE username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      if (result.length > 0) {
        res.json({
          success: true,
          packs: result[0]['SUM(packs)'] == null ? 0 : result[0]['SUM(packs)']
        })
      }
    }
  })
})
router.post('/invest', auth.checkToken, (req, res) => {
  var username = req.body.username
  var lots = req.body.lots
  const currency = req.body.currency
  connection.query("SELECT SUM(value) FROM hosted_transactions WHERE currency = " + mysql.escape(currency) + " AND username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      if (result.length > 0) {
        if (lots <= result[0]['SUM(value)']) {
          connection.query("INSERT INTO hosted_transactions SET ?", {
            txid: uuid.v4(),
            value: -lots,
            username,
            status: true,
            currency,
            to_: 'Investment fund'
          }, (err, result) => {
            if (err) { console.log(err); res.json({ success: false }) } else {
              connection.query("SELECT ROI, investment FROM user WHERE username = " + mysql.escape(username), (err, result) => {
                if (err) { console.log(err); res.json({ success: false }) } else {
                  var ROI = result[0].ROI
                  var investment = result[0].investment
                  ROI = ((investment / (investment + (lots / 50))) * ROI).toFixed(2);
                  investment = investment + (lots / 50)
                  connection.query("INSERT INTO payment SET ?", {
                    username,
                    type: 'Investment',
                    currency,
                    status: 'Done',
                    usd: lots,
                  })
                  connection.query("UPDATE user SET ? WHERE username = " + mysql.escape(username), {
                    ROI,
                    investment,
                    '24h': false,
                    inactive_days: 0
                  }, (err, result) => {
                    if (err) { console.log(err) } else {
                      https.get('https://blog.inverte.do/app/admin/getLeverageAll.php', reponse => { })
                      res.json({
                        success: true
                      })
                    }
                  })
                }
              })
            }
          })
        }
      } else {
        res.json({
          success: false
        })
      }
    }
  })
})
router.post('/invest/mining', auth.checkToken, (req, res) => {
  var username = req.body.username
  var lots = req.body.lots
  var packs = 0
  const currency = req.body.currency
  switch (lots) {
    case 500: packs = 8
      break;
    case 700: packs = 14
      break;
    case 1000: packs = 20
      break;
  }
  connection.query("SELECT SUM(value) FROM hosted_transactions WHERE currency = " + mysql.escape(currency) + " username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      if (result.length > 0) {
        if (lots <= result[0]['SUM(value)']) {
          connection.query("INSERT INTO hosted_transactions SET ?", {
            txid: uuid.v4(),
            value: -lots,
            username,
            currency,
            status: true,
            to_: 'Mining pool'
          }, (err, result) => {
            if (err) { console.log(err); res.json({ success: false }) } else {
              connection.query("INSERT INTO mining SET ?", {
                username,
                value: lots,
                packs,
                status: false
              }, (err, result) => {
                if (err) { console.log(err); res.json({ success: false }) } else {
                  res.json({ success: true })
                  http.get('http://blog.inverte.do/app/admin/getLeverageAll.php', reponse => { })
                  res.json({
                    success: true
                  })
                }
              })
            }
          })
        }
      } else {
        res.json({
          success: false
        })
      }
    }
  })
})
router.post('/wallet/transactions', auth.checkToken, (req, res) => {
  var username = req.body.username
  connection.query("SELECT value, date, txid, currency FROM hosted_transactions WHERE username = " + mysql.escape(username) + " ORDER by date DESC LIMIT 5 ", (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
      if (result.length > 0) {
        res.json({
          success: true,
          wallet_transactions: result
        })
      } else { }
    }
  })
})

router.post('/withdraw/address/set', auth.checkToken, (req, res) => {
  var username = req.body.username
  var address = req.body.address
  var isValid_address = true
  try {
    isValid_address = new Wallet.isValid(address)
  } catch (e) {
    if (e.name == 'Error') {
      isValid_address = false
    }
  }
  connection.query("SELECT `bitcoin_address` FROM `user` WHERE `username` = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
      if (isValid_address) {
        if (result.length > 0) {
          connection.query("UPDATE `user` SET `bitcoin_address`= " + mysql.escape(address) + " WHERE username = " + mysql.escape(username), (err, result) => {
            if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
              res.json({
                success: true,
                message: ''
              })
            }
          })
        } else {
          res.json({
            success: false,
            message: 'Username do not exist'
          })
        }
      } else {
        res.json({
          success: false,
          message: 'Invalid bitcoin address'
        })
      }
    }
  })
})
router.post('/withdraw/address/set/ETH', auth.checkToken, (req, res) => {
  var username = req.body.username
  var address = req.body.address
  var isValid_address = new Wallet.isValidETH(address)
  if (isValid_address) {
    connection.query("UPDATE `user` SET `ethereum_address`= " + mysql.escape(address) + " WHERE username = " + mysql.escape(username), (err, result) => {
      if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
        res.json({
          success: true,
          message: ''
        })
      }
    })
  } else {
    res.json({
      success: false,
      message: 'Invalid ethereum address'
    })
  }
})
router.post('/withdraw/address', auth.checkToken, (req, res) => {
  var username = req.body.username
  connection.query("SELECT `bitcoin_address`, `ethereum_address` FROM `user` WHERE `username` = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
      res.json({
        success: true,
        withdraw_address: result[0].bitcoin_address,
        withdraw_address_ETH: result[0].ethereum_address,
      })
    }
  })
})
router.post('/withdraw/transactions', auth.checkToken, (req, res) => {
  var username = req.body.username
  connection.query("SELECT method, value, time, txid, status  FROM investment_transaction WHERE description = 'Withdraw' AND username = " + mysql.escape(username) + " ORDER by time DESC", (err, result) => {
    if (err) { console.log(err); res.status(400).json({ success: false, message: 'err' }) } else {
      if (result.length > 0) {
        res.json({
          success: true,
          withdraw_transactions: result
        })
      }
    }
  })
})


router.post('/transactions', auth.checkToken, (req, res) => {
  var username = req.body.username
  var limit = req.body.limit
  var network = req.body.network
  var negative = req.body.negative
  limit == true ? limit = ' ORDER BY time DESC LIMIT 5' : limit = ''
  negative == true ? negative = 'value < 0 AND' : negative = 'value > 0 AND'
  network == true ? network = ' AND network = 1 ' : network = ' '
  connection.query("SELECT * FROM investment_transaction WHERE " + negative + " username = " + mysql.escape(username) + network + limit, (err, result) => {
    if (err) { console.log(err); res.status(500).json({ success: false }) } else {
      res.json({
        success: true,
        result: limit == '' ? result.reverse() : result
      })
    }
  })
})
router.post("/network/join", auth.checkToken, (req, res) => {
  const username = req.body.username
  const currency = req.body.currency
  connection.query("SELECT SUM(value) FROM hosted_transactions WHERE currency = " + mysql.escape(currency) + " AND username = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      if (result.length > 0) {
        if (20 <= result[0]['SUM(value)']) {
          connection.query("INSERT INTO hosted_transactions SET ?", {
            txid: uuid.v4(),
            value: -20,
            username,
            status: true,
            currency,
            to_: 'Join Network'
          }, (err, result) => {
            if (err) { console.log(err); res.json({ success: false }) } else {
              connection.query("UPDATE user SET network = 1 WHERE username = " + mysql.escape(username), (err, result) => {
                if (err) { console.log(err); res.json({ success: false }) } else {
                  res.json({
                    success: true,
                    msg: 'Succesfully joined the network'
                  })
                  //fast track
                  connection.query("SELECT sponsor FROM user WHERE username = " + mysql.escape(username), (err, result) => {
                    if (err) { console.log(err); res.json({ success: false }) } else {
                      var sponsor = result[0].sponsor
                      connection.query("SELECT investment FROM user WHERE username = " + mysql.escape(sponsor), (err, result) => {
                        if (err) { console.log(err); res.json({ success: false }) } else {
                          if (result.length > 0) {
                            if (result[0].investment > 0) {
                              connection.query("INSERT INTO investment_transaction SET ?", {
                                username,
                                description: 'Fast track',
                                value: 5,
                                method: 'Backoffice',
                                network: 1,
                                status: 1
                              })
                              connection.query("INSERT INTO investment_transaction SET ?", {
                                username: sponsor,
                                description: 'Fast track',
                                value: 5,
                                method: 'Backoffice',
                                network: 1,
                                status: 1
                              }, (err, result) => {
                                connection.query("SELECT new, investment, ROI FROM user WHERE username = " + mysql.escape(sponsor), (err, result) => {
                                  if (err) { console.log(err); res.json({ success: false }) } else {
                                    if (!result[0].new) {
                                      connection.query("UPDATE user SET ROI = " + (result[0].ROI + (10 * result[0].investment)) + " WHERE username = " + mysql.escape(sponsor))
                                    }
                                  }
                                })
                              })
                            }
                          }
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          res.json({
            success: false,
            msg: "Insuficent balance"
          })
        }
      }
    }
  })
})
router.post("/network/referal", auth.checkToken, (req, res) => {
  const username = req.body.username
  connection.query("SELECT * FROM user WHERE sponsor = " + mysql.escape(username), (err, result) => {
    if (err) { console.log(err); res.json({ success: false }) } else {
      res.json({
        success: true,
        result
      })
    }
  })
})
router.post("/network/tree", auth.checkToken, (req, res) => {
  const username = req.body.username
  const secret = 'QSqTAkdUG8kSxMFFT2qHJsP'
  axios.post("http://blog.inverte.do/app/admin/admin/getTree.php", {
    username,
    secret
  })
    .then(data => {
      res.json(data.data)
    })
})
router.post("/network/data", auth.checkToken, (req, res) => {
  const username = req.body.username
  const secret = 'QSqTAkdUG8kSxMFFT2qHJsP'
  axios.post("https://blog.inverte.do/app/admin/admin/getNetworkData.php", {
    username,
    secret
  })
    .then(data => {
      console.log(data.data)
      res.json(data.data)
    })
})
module.exports = router;