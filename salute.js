/*global $,jQuery*/


/*
	Requirements:
	    Build a small useful framework to exercise deeper 
	    knowledge of key JavaScrip concepts
	    
	
	    1. When given a first name, last name, and optional language, it 
	        generates formal and informal greetings.
        2. Support English and Spanish languages.
        3. Reusable libraray/framework.
        4. Easy to type 'S$()' structure
        5. Must recognize/support jQuery

*/


/* Wrap up code with IIFE and pass it a reference to global + jquery 
    Remember we have to use an outer parenthesis here to trick syntax
    parser into treating it as a function expression.
    
    As soon as file is loaded, the IIFE is invoked, a execution context is
    created and the entire structure is placed in memory. Caller next step
    is simply to request salute object (S$)
    
    Setup salute.js the way jQuery is structured
        1. It will generate and return an object
        2. var s = S$(firstname,lastname,language)
            - We dont want to have to say 'new' all the time
*/
/*Note: the semicolon here is sometimes employed to insure that 
 semicolon properly concluded in any previous libraries/scripts 
*/
;(function(global,jq){
     //console.log(window);
     //console.log(jquery);
     
     /* setup a function that calls a function constructor
        remember, a function constructor returns an object as
        long as we do not return something else ourselves.
     */
     var salute = function(lastName,firstName,language){
         
         /* return ojbect of function contstructor */
         return new salute.Init(lastName,firstName,language);
        
     };
     
     //------------------------------------------------------------------------
     //SUPPORT OBJECTS
    
     /* objects/vars placed outside salute.init can still be accessed by 
        later by any returned object since this is still part of the lexical
        environment of the the returned object. Due to closure, the objects/vars 
        from the outer lexical will still be available to 'salute' objects. 
        
        however Code in the 'outer' lexical environment is 'hidden' from  view
        and cannot be modified directly. They can be be found internally from
        within salute.prototype, for instance, since JS engine will search
        the scope chain.
     */
     var supportedLanguages = ['en','es'];
     
     var greetings = {
         
         //English
         en: {
             common: 'Hello',
             formal: 'Greetings'
         },
         
         //Spanish
         es: {
             common: 'Hola',
             formal: 'Saludos'
         }
     };
     
     var logMsg = {
         en: 'Logged in',
         es: 'Inició sesión'
     };
     
     //------------------------------------------------------------------------
     // PROTOTYPE SETUP
     /* This prototype is where we will place all the properties and methods
        we want to expose to world. It saves memory space by creating logic here.
        If placed within the salute.Init constructor, the code would be 
        duplicated for each created object.
        
        Note that 'this' inside salute.prototype will refer to whatever object
          was created via salute.Init() because once we force the prototype,
          salute.Init will 'inherit' from salute.prototype
     */
     salute.prototype = {
         
         greetText: '',
         
         fullName: function(){
             return this.firstName + ' ' + this.lastName;
         },
         
         validate: function(lang) {
             if(supportedLanguages.indexOf(lang) === -1){
                 throw "Language " + 
                    (lang ? lang : 'Undefined') + " is not supported!";
             }
         },
         
         greeting: function () {
             return greetings[this.language].common + ' ' + this.firstName + '!';
         },
         
         formalGreeting: function(){
             return greetings[this.language].formal + ' ' + this.fullName();
         },
         
         greet: function (formal) {
             
             var msg;
             
             // if undefined or null it will be 'coerced' to false
             if (formal) {
                msg = this.formalGreeting();       
             } else {
                msg = this.greeting();
             }
             
             this.greetText = msg;
             
             /* IE does not have console ref unless actually open... */
             if(console){
                 console.log(msg);
             }
             
             /* 'this' refers to the calling object at runtime. Returning
                it, makes method chainable Example:
                    $S("john","doe","en").greet().someOtherFunc() 
                would look like this after greet returns:
                     $S("john","doe","en").this.someOtherFunc()
                 this = salute.Init which points to salute.prototype...
                     
             */
             return this;
         },
         
         log: function(){
             /* IE does not have console ref unless actually open... */
             if (console) {
                 console.log(logMsg[this.language] + ': ' + this.fullName());
             }
             
             //chainable...
             return this;
         },
         
         setLanguage: function(lang){
             //validate before we set anything
             this.validate(lang);
             
             this.language = lang;
             
             //chainable...
             return this;
         },
         
         setElementGreeting: function(selector,formal) {
             
             if(!jq){
                 throw 'jQuery not loaded'
             }
             
             if(!selector){
                 throw 'Missing jQuery selector'
             }
            
             //set the greet property    
             this.greet(formal);
             
             jq(selector).text(this.greetText); 
             
             return this;
         }
         
     };
     
     /* Function constructor - convention is to capitalize first letter 
       Properties that are unique to each object are placed here.
       This insures that each object gets its own copy
     */
     salute.Init = function(lastName,firstName,language){
        
        /*inner functions can revert 'this' back to global
          context. to avoid worrying about it, just map 'this' to 'self'
          
          this/self here refers to the empty object created by the new
          operator.
        */
        var self = this;
        
        self.lastName  = lastName  || ' ';
        self.firstName = firstName || ' ';
        self.language  = language  || 'en';
        
        // Make sure language is supported 
        self.validate(self.language);
     };
     
     /* the prototype of Every object created by salute.Init will be 
        pointing to salute.Init.prototype by default, which is an empty
        object. Lets implement prototypal inheritance here by assigning the
        prototype property to the salute functions prototype property. This
        gives access to the methods within to every object initialized by 
        salute.Init()
     */
     salute.Init.prototype = salute.prototype;
     
     /*Put two references to our salute object on the global object
        global is the passed in window argument of our IIFE
     */
     
     global.salute = global.S$ = salute;
     
     //return salute;
     
}(window,jQuery));