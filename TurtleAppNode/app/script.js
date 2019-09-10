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

    fetch('/readsetting', {method: 'post'}).then(function(response) {  
      return response.json();  
    })  
    .then(function(json) {  
      console.log('Request successful', json); 
      if (json.feedSettings !== '') {
        $("#feed").val(json.feedSettings);
        if( (date - foodDay) >= json.feedSettings ){
          alert("Zeit zum Füttern!");
        }
      };
      if (json.washSettings !== '') {
        $("#wash").val(json.washSettings);
        if( (date - getCookie("lastWash")) >= json.washSettings){
          alert("Wasche die Schildkröte!");
        }
      };
      if (json.terCleanSettings !== '') {
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


  function setSettings(){
    let mySet = {
      'feedSettings': $("#feed").val(),
      'washSettings': $("#wash").val(),
      'terCleanSettings': $("#terClean").val()
    };
    writeSettings(mySet);
    location.reload();   
  }

  function writeSettings(sValue){ // отправляем сообщение серверу, что надо сохранить настройки в файл      
    fetch('/savesetting', {
        method: 'post',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(sValue)      
   });
  }

