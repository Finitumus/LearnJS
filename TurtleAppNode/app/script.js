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

$( document ).ready(function() {
    var foodDay = getCookie("feedDay");
    var date = new Date();
    date = date.getDate();
if( getCookie("feedSettings") != "" ){
     if( (date - foodDay) >= getCookie("feedSettings") ){
         alert("Zeit zum Füttern!");
     }
}

if( getCookie("washSettings") != "" ){
     if( (date - getCookie("lastWash")) >= getCookie("washSettings") ){
         alert("Wasche die Schildkröte!");
     }
}

if( getCookie("terCleanSettings") != "" ){
     if( (date - getCookie("lastTerClean")) >= getCookie("terCleanSettings") ){
         alert("Putze das Terrarium!");
     }
}

});

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

if( getCookie("feedSettings") != "") { //if feeding settings are set
    $("#feed").val(getCookie("feedSettings")); //reads the feed settings from the cookie 
    };   
    if( getCookie("washSettings") != "") {
      $("#wash").val(getCookie("washSettings"));
    };
    if( getCookie("terCleanSettings") != "") {
      $("#terClean").val(getCookie("terCleanSettings"));
    };

  });


  function setSettings(){
    setCookie("feedSettings", $("#feed").val(), 12);
    setCookie("washSettings", $("#wash").val(), 12);
    setCookie("terCleanSettings", $("#terClean").val(), 12);
    location.reload();
    }


