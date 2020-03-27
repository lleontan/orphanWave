const express = require('express')
const app = express();
const PORT=8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(8000, () => {
  console.log('Example app listening on port '+PORT+"!");
  console.log('http://localhost:'+PORT+'/');
});
