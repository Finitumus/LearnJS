const http = require('http') // подключили модуль http
const fs = require('fs')     // подключили модуль fs для работы с файловой системой
const express = require('express') // подключили модуль express для отображения контента 
const bodyParser = require('body-parser'); // подключили модуль парсера

const hostname = '127.0.0.1' // задали параметры подключения к http - сервер по адресу 127.0.0.1
const port = 3000           // и он будет слушать порт 3000

const app = express() // это наш обработчик запросов

app.use(express.static(__dirname)); // подключили путь к css, js и изображениям - они у нас лежат в той же папке, что и скрипт
app.use(express.static('files'));
app.use("/static", express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');  // если путь пустой, только сервер и порт, отдаём ему корневой файл index.html
});

app.get('/index.html', function(req, res) {
  res.sendFile(__dirname + '/index.html');  // и если мы вызвали index.html - это нужно там, где кнопка "Назад" - тоже отдаём index.html
});

app.get('/fresstagebuch.html', function(req, res) {
  res.sendFile(__dirname + '/fresstagebuch.html'); // обработка вызова адреса страницы fresstagebuch.html
});
app.get('/benachrichtigungen.html', function(req, res) {
  res.sendFile(__dirname + '/benachrichtigungen.html'); // обработка вызова адреса страницы benachrichtigungen.html
});
app.get('/arztsuche.html', function(req, res) {
  res.sendFile(__dirname + '/arztsuche.html'); // обработка вызова адреса страницы arztsuche.html 
});

// для кнопки community мы не пишем такой обработчик, потому что там идёт обращение к внешнему сайту, он и так откроется

const logAppend = (fileName, appData) =>  { //adding item to the log file
    fs.appendFile(                        // appends data to a file, creating it, if not exist
      fileName,
      appData,
      err => {
          if (err) console.log(err);
      }
  );
};

const logWrite = (fileName, appData) =>  { //writing item to the log file
  fs.writeFile(                        // writes data to a file, creating it, if not exist, and overwriting if exist
    fileName,
    appData,
    err => {
        if (err) console.log(err);
    }
  );
}

function logRead (fileName) { //reading item from the log file, if it exists 
  let fileContent = 'Empty';   
  fileContent = fs.readFileSync(fileName, 'utf8');
  return fileContent;
}

app.post('/savesetting', (req, res) => {
  logWrite('settings.txt', JSON.stringify(req.body) + '\n');
});  

app.post('/readsetting', (req, res) => {
  let s = logRead('settings.txt');
  res.send(s); 
});  



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`) // эта строка в консоли подскажет нам, какой адрес вводить в браузере
});

