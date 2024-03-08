let express = require('express');
let app = express();
const bodyParser = require('body-parser')

console.log("Hello World");

app.use((req, res, next)=>{
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

const absolutePath = __dirname + '/views/index.html';
const styleSheetPath = __dirname + '/public';
app.get('/', (req, res) =>{
  res.sendFile(absolutePath);
});
app.use('/public', express.static(styleSheetPath));

app.get('/json', (req, res) =>{
const message = process.env.MESSAGE_STYLE === 'uppercase' ? 'HELLO JSON' : 'Hello json';
  res.json({"message": message});
});

app.get('/now', (req, res, next)=>{
  req.time = new Date().toString();
  next();
}, (req, res)=>{
  res.json({time: req.time})
}
);

app.get('/:word/echo', (req, res)=>{
  res.json({echo: req.params.word});
})

app.use(bodyParser.urlencoded({extended: false}));

app.route('/name')
.get((req, res) => {
  res.json({ name: `${req.query.first} ${req.query.last}` });
})
.post((req, res) => {
  res.json({ name: `${req.body.first} ${req.body.last}` });
});




































 module.exports = app;
