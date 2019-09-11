var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
var dateWash;
var dateClean;  
var feedFood = '';
var feedDay = '';
var feedStory = '';

function feed(){
    var food = document.getElementById("food").value;
    if( food == "Wurst" || food == "Schokolade" || food == "Fisch" || food == "Pizza"|| food == "Pommes") {
      
      alert( food + " ist kein Schildkrötenfutter!");

    } else {
       feedFood = food; // обновляем значение последней еды
       var date = new Date();
       feedDay = date;    // дата последнего кормления равна сегодняшней дате
       setActions(dateWash, dateClean, feedDay, feedFood); // сохраняем в файле действия, в том числе дату кормления 
       feedStory = food + " am " + date.getDate() + ". " + month[date.getMonth()] + "<hr>" + feedStory; // формируем историю кормления
       setFeedStory(feedStory);                     // обновляем историю кормления в файле
       alert("Tolle Idee! Guten Appetit!");
       location.reload();
    }
}

function lastWash(){
    var date = new Date();
    dateWash = date;          // дата последней помывки равна сегодняшней дате
    setActions(dateWash, dateClean, feedDay, feedFood);// сохраняем в файле действия, в том числе дату помывки 
    location.reload();
    $("#last-wash").html(dateWash.getDate() +". "+ month[dateWash.getMonth()]);
}

function lastTerClean(){
    var date = new Date();
    dateClean = date;     // дата последней чистки террариума равна сегодняшней дате
    setActions(dateWash, dateClean, feedDay, feedFood);// сохраняем в файле действия, в том числе дату чистки террариума 
    location.reload();
    $("#last-clean").html(dateClean.getDate() +". "+ month[dateClean.getMonth()]);    
} 

$( document ).ready(function() {
//    var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    var currentDay = new Date();
    var currentDate = currentDay.getDate();
    var currentMonth = currentDay.getMonth();  
    $("#current_day").html(currentDate +". "+ month[currentMonth]); // текущую дату пишем на страницу всегда

    fetch('/readactions', {method: 'post'}).then(function(response) {  // загружаем действия из файла командой readsetting
      return response.json();                                          // в ответ нам вернулся json (стуктурированный текстовый формат поле:значение)
    })  
    .then(function(json) {                        // если всё прошло ок, разбираем прочитанные данные и обновляем на странице то, что прочитали
      console.log('Actions request successful', json); 
      dateWash = new Date(json.dateWash);                // сохраняем dateWash в переменную, причём нас устроит и пустое значение
      dateClean = new Date(json.dateClean);              // аналогично для dateClean
      feedDay = new Date(json.dateFeed);                 // аналогично для даты кормёжки
      feedFood = json.feedFood;                          // аналогично для названия еды
      if(feedDay) {                                      // формируем день и месяц кормления
        foodDay =  feedDay.getDate();
        foodMonth =  feedDay.getMonth();        
      };
      if(dateWash) {                                    // записываем на страницу дату помывки, если она прочитана из файла
        $("#last-wash").html(dateWash.getDate() +". "+ month[dateWash.getMonth()]);
      } else {
        $("#last-wash").html("keine Infos.");
      };
    
      if(dateClean){                                  // записываем на страницу дату чистки террариума, если она прочитана из файла
        $("#last-clean").html(dateClean.getDate() +". "+ month[dateClean.getMonth()]);
      } else {
        $("#last-clean").html("keine Infos.");
      };

      if(feedFood){                                   // записываем на страницу дату кормёжки и еду, если есть
        $("#feed_food").html(feedFood);
        $("#feed_day").html(foodDay +". "+ month[foodMonth]);
       } else {
        $("#title_feed_day").html("Noch keine Einträge im Fresstagebuch. Füttere deine Schildkröte, um den Eintrag hinzufügen.");
      };

    })  
    .catch(function(error) {  
      console.log('Actions request failed', error)  // а если что-то не прочиталось, выводим в консоль сообщение об ошибке
    });

    fetch('/readstory', {method: 'post'}).then(function(response) {  // загружаем историю кормления из файла командой readsetting
      return response.json();                                          // в ответ нам вернулся json (стуктурированный текстовый формат поле:значение)
    })  
    .then(function(json) {                        // если всё прошло ок, разбираем его
      console.log('Story request successful', json); 
      feedStory = json.feedStory;                   // сохраняем feedStory в переменную
      $("#feedStory").html(feedStory);              // и выводим эту переменную на страницу в нужное поле
    })  
    .catch(function(error) {  
      console.log('Story request failed', error)  
    });

    fetch('/readsetting', {method: 'post'}).then(function(response) {  // загружаем настройки из файла командой readsetting
      return response.json();                                          // в ответ нам вернулся json (стуктурированный текстовый формат поле:значение)
    })  
    .then(function(json) {                              // если всё прошло ок, разбираем его
      console.log('Settings request successful', json); 
      if (json.feedSettings !== '') {                   // если feedSettings не пустое, 
        $("#feed").val(json.feedSettings);              // кладём его в поле ввода
        if( Math.round((currentDay - feedDay)/1000/60/60/24) >= json.feedSettings ){    
          alert("Zeit zum Füttern!");                   // и поднимаем алерт, если пропустили день кормёжки
        }
      };
      if (json.washSettings !== '') {                   // аналогично для помывки
        $("#wash").val(json.washSettings);
        if( Math.round((currentDate - lastWash)/1000/60/60/24) >= json.washSettings){
          alert("Wasche die Schildkröte!");
        }
      };
      if (json.terCleanSettings !== '') {             // аналогично для чистки террариума
        $("#terClean").val(json.terCleanSettings);
        if( Math.round((currentDate - lastTerClean)/1000/60/60/24) >= json.terCleanSettings){
          alert("Putze das Terrarium!");
        }
      };
    })  
    .catch(function(error) {  
       console.log('Settings request failed', error)  
    });
});


  function setSettings(){                 // функция сохранения настроек, которую мы вызываем из файла benachrichtigungen.html
    let mySet = {                         // кладём все настройки в объект
      'feedSettings': $("#feed").val(),
      'washSettings': $("#wash").val(),
      'terCleanSettings': $("#terClean").val()
    };
    writeSettings(mySet);                 // и пишем объект в файл функцией writeSettings, которая написана ниже
    location.reload();   
  }

  function writeSettings(sValue){ // отправляем сообщение серверу, что надо сохранить настройки в файл      
    fetch('/savesetting', {       // эту команду мы будем ловить и обрабатывать в файле index.js
        method: 'post',           // чтобы отправить данные, нам нужен метод post, через get мы можем только команду-строку заслать, а данные - нет      
        headers: { 'content-type': 'application/json'}, // говорим, что данные у нас в формате json
        body: JSON.stringify(sValue)                    // это у нас собственно данные
   });
  }

  function setActions(dateWash, dateClean, dateFeed, feedFood){ // функция сохранения действий пользователя
    let mySet = {                                               // кладём все параметры в объект
      'dateWash': dateWash,
      'dateClean': dateClean,
      'dateFeed': dateFeed,
      'feedFood': feedFood      
    };
    writeActions(mySet);                 // и пишем объект в файл функцией writeActions
    location.reload();   
  }

  function writeActions(sValue){ // отправляем сообщение серверу, что надо сохранить действия пользователя в файл      
    fetch('/saveactions', {       // эту команду мы будем ловить и обрабатывать в файле index.js
        method: 'post',           // чтобы отправить данные, нам нужен метод post, через get мы можем только команду-строку заслать, а данные - нет      
        headers: { 'content-type': 'application/json'}, // говорим, что данные у нас в формате json
        body: JSON.stringify(sValue)                    // это у нас собственно данные
   });
  }

  function setFeedStory(feedStory){        // функция сохранения истории кормлений
    let mySet = {                         // кладём историю кормления в объект - так удобнее, чем разбирать текст
      'feedStory': feedStory
    };  
    writeStory(mySet);                 // пишем её в файл функцией writeStory
    location.reload();   
  }

  function writeStory(sValue){ // отправляем сообщение серверу, что надо сохранить историю в файл      
    fetch('/savestory', {       // эту команду мы будем ловить и обрабатывать в файле index.js
        method: 'post',           // чтобы отправить данные, нам нужен метод post, через get мы можем только команду-строку заслать, а данные - нет      
        headers: { 'content-type': 'application/json'}, // говорим, что данные у нас в формате json
        body: JSON.stringify(sValue)                    // это у нас собственно данные
   });
  }
