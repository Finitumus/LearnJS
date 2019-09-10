var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function feed(){
    var food = document.getElementById("food").value;
    if( food == "Wurst" || food == "Schokolade" || food == "Fisch" || food == "Pizza"|| food == "Pommes") {
    
      
      alert( food + " ist kein Schildkrötenfutter!");//

    } else {
       
       var date = new Date();
       setCookie("feedDay", date.getDate(), 12 );
       setCookie("feedMonth", date.getMonth(), 12 );
       setCookie("feedFood", food, 12 );

       if(getCookie("feedStory") != ""){
          setCookie("feedStory", getCookie("feedFood")+ " am " + getCookie("feedDay")+ ". " + month[getCookie("feedMonth")]+"<hr>" + getCookie("feedStory") , 12 );
       } else {
          setCookie("feedStory", getCookie("feedFood")+ " am " + getCookie("feedDay")+ ". " + month[getCookie("feedMonth")]+"<hr>" , 12 );
       }
       alert("Tolle Idee! Guten Appetit!");
       location.reload();
    }
}

console.log(document.cookie);
// JavaScript Document

function lastWash(){
    var date = new Date();
    setCookie("lastWash", date.getDate(), 12);
    setCookie("washMonth", date.getMonth(), 12 );
    location.reload();
    console.log(getCookie("lastWash") +". "+ month[getCookie("washMonth")]);
   $("#last-wash").html(getCookie("lastWash") +". "+ month[getCookie("washMonth")]);
}

function lastTerClean(){
    var date = new Date();
    setCookie("lastTerClean", date.getDate(), 12);
    setCookie("lastTerCleanMonth", date.getMonth(), 12 );
    location.reload();
} 

$( document ).ready(function() {
  var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var currentDay = new Date();
  var foodDay = getCookie("feedDay");  
  var date = new Date();
  date = date.getDate();

  if(getCookie("feedFood") != ""){
      $("#current_day").html(currentDay.getDate() +". "+ month[currentDay.getMonth()]);
      $("#feed_food").html(getCookie("feedFood"));
      $("#feed_day").html(getCookie("feedDay") +". "+ month[getCookie("feedMonth")]);
      $("#feedStory").html(getCookie("feedStory"));
  } else {
  $("#current_day").html(currentDay.getDate());
      $("#title_current_day").html("");
      $("#title_feed_day").html("Noch keine Einträge im Fresstagebuch. Füttere deine Schildkröte, um den Eintrag hinzufügen.");
  };

    fetch('/readsetting', {method: 'post'}).then(function(response) {  // загружаем настройки из файла командой readsetting
      return response.json();                                          // в ответ нам вернулся json (стуктурированный текстовый формат поле:значение)
    })  
    .then(function(json) {                              // если всё прошло ок, разбираем его
      console.log('Request successful', json); 
      if (json.feedSettings !== '') {                   // если feedSettings не пустое, 
        $("#feed").val(json.feedSettings);              // кладём его в поле ввода
        if( (date - foodDay) >= json.feedSettings ){    // и поднимаем алерт, если пропустили день кормёжки
          alert("Zeit zum Füttern!");
        }
      };
      if (json.washSettings !== '') {                   // аналогично для помывки
        $("#wash").val(json.washSettings);
        if( (date - getCookie("lastWash")) >= json.washSettings){
          alert("Wasche die Schildkröte!");
        }
      };
      if (json.terCleanSettings !== '') {             // аналогично для чистки террариума
        $("#terClean").val(json.terCleanSettings);
        if( (date - getCookie("lastTerClean")) >= json.terCleanSettings){
          alert("Putze das Terrarium!");
        }
      };
    })  
    .catch(function(error) {  
      log('Request failed', error)  
    });
  });


  function setSettings(){                 // функция сохранения настроек, которую мы вызываем из файла benachrichtigungen.html
    let mySet = {                         // кладём все настройки в объект
      'feedSettings': $("#feed").val(),
      'washSettings': $("#wash").val(),
      'terCleanSettings': $("#terClean").val()
    };
    writeSettings(mySet);                 // и пишем объект в файл функцией writeSettings
    location.reload();   
  }

  function writeSettings(sValue){ // отправляем сообщение серверу, что надо сохранить настройки в файл      
    fetch('/savesetting', {       // эту команду мы будем ловить в файле index.js
        method: 'post',           // чтобы отправить данные, нам нужен метод post, через get мы можем только команду-строку заслать, а данные - нет      
        headers: { 'content-type': 'application/json'}, // говорим, что данные у нас в формате json
        body: JSON.stringify(sValue)                    // это у нас собственно данные
   });
  }

