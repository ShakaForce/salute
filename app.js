/*global S$, jQuery, $*/

var isJqueryLoaded = jQuery ? 
    "app.js jQuery connected..." : "app.js jQuery FAILED connect!";
console.log(isJqueryLoaded);

var isSaluteLoaded = S$ ? 
    "app.js Salute connected..." : "app.js Salute FAILED connect!";
console.log(isSaluteLoaded);

/* Just setup our user here for demo purposes*/
var loginGreet = S$("DingDong","Shamalama");

$('#login').on('click',function(){
    console.log("Login button clicked...");
    var lang = $('#lang').val();
    console.log(lang);
    
    loginGreet.setLanguage($('#lang').val()).setElementGreeting('#greeting',true).log();
    
});


//var g = S$('Billie','Badass','en').greet('formal').log();

//g.greet().setLanguage('es').setElementGreeting('#greeting',true);
//console.log(g);