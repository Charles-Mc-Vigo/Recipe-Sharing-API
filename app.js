const express = require('express');
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello Programmer')
})

app.listen(3000,()=>{
    console.log('Listening to port 3000');
})