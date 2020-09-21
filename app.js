
 // check architectural diagram in video 

 /*
 Description:
 - Simple budget web app
 Functions:
 -
 TODO:


 Notes:
 - Modular Pattern with IIFes and Closures
  */

 var budgetController = (function() {
    return {

    }
 })();

var UIController = (function () {

    const DOMStrings = {
        addType: ".add__type",
        addDesc: ".add__description",
        addVal: ".add__value"
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesc).value,
                value: document.querySelector(DOMStrings.addVal).value

            }
        }
    }
})();

var appController = (function (budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        document.querySelector(".add__btn").addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem()
            }
        })

    }

    var ctrlAddItem = function() {
        var input = UICtrl.getInput()
        console.log(input)
    }


    // return{
    //     init: function() {
           
            
    //     }
    // }
})(budgetController, UIController);

appController.init()