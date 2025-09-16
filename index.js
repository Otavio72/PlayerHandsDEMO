const express = require("express");
const path = require('path');
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'videos')));


// ROUTES
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/video',(req,res)=>{
    res.sendFile(path.join(__dirname, 'videoplayer.html'));
});


app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));