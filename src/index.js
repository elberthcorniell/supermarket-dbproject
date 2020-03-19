const app = require ('./config/server');

//starting server;
app.listen(app.get('port'), () =>{
    console.log('server on port ', app.get('port'));
});