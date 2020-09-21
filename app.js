
 // check architectural diagram in video 

 /*
 Description:
 - Simple budget web app

 TODO:
 - delete item

 Notes:
 - Modular Pattern with IIFes and Closures
  */

 var budgetController = (function() {
    var Expense = function(id, desc, value){
        this.id = id,
        this.desc = desc,
        this.value = value
    }

    var Income = function (id, desc, value) {
        this.id = id,
        this.desc = desc,
        this.value = value
    }

    var calculateTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach((e) => {
            sum += e.value
        })
        data.totals[type] = sum
    }

    var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp:0,
           inc:0
       },
       budget: 0,
       percentage: -1 // non existent
    }
    return {
        addItem: function(type, des, val){
            var newItem, ID

            // create new id
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }else{
                ID = 0
            }

            if(type == "exp"){
                newItem = new Expense(ID, des, val)
                // data.totals[type] += value
            } else if (type == "inc"){
                newItem = new Income(ID, des, val)
                // data.totals[type] += value

            }

            data.allItems[type].push(newItem)

            return newItem

        },
        calculateBudget: function () {
            // calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // calculate budgetController, income less expnses,
            data.budget = data.totals.inc - data.totals.exp

            // calculate percentage
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }
        },
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data)
        }
    }

 })();

var UIController = (function () {

    const DOMStrings = {
        addType: ".add__type",
        addDesc: ".add__description",
        addVal: ".add__value",
        addButt: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetTotalValue: ".budget__value",
        budgetIncValue: ".budget__income--value",
        budgetExpValue: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage"

    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesc).value,
                value: parseFloat(document.querySelector(DOMStrings.addVal).value)
            }
        },
        getDOMStrings: function() {
            return DOMStrings
        },
        addListItem: function(obj, type) {
            var html, newHtml, element

            if( type === "inc"){
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if( type === "exp"){
                element = DOMStrings.expenseContainer

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description" >%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >'
            }

            newHtml = html.replace("%id%", obj.id)
            newHtml = newHtml.replace("%description%", obj.desc)
            newHtml = newHtml.replace("%value%", obj.value)

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },
        clearFields: function() {
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMStrings.addDesc + ', ' + DOMStrings.addVal)

            fieldsArray = Array.prototype.slice.call(fields)

            fieldsArray.forEach((element) => {
                element.value = ""
            });

            fieldsArray[0].focus()
        },
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetTotalValue).textContent = obj.budget
            document.querySelector(DOMStrings.budgetExpValue).textContent = obj.totalsExp
            document.querySelector(DOMStrings.budgetIncValue).textContent = obj.totalsInc

            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "---"
            }
        }
    }
})();

var appController = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings()
    
    var setupEventListeners = function() {
        
        document.querySelector(DOM.addButt).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem()
            }
        })
        
    }

    var updateBudget = function(){

        // calc budget
        budgetCtrl.calculateBudget()

        // return budget
        var budget = budgetCtrl.getBudget()

        // display budget on UI
        UICtrl.displayBudget(budget)
    }
    
    var ctrlAddItem = function() {
        var input, newItem

        input = UICtrl.getInput()

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            UICtrl.addListItem(newItem, input.type)

            UICtrl.clearFields()

            updateBudget()
        }
        
    }

    return{
        init: function() {
            console.log('App has started')
           setupEventListeners()
           UICtrl.displayBudget({
                   budget: 0,
                   totalInc: 0,
                   totalExp: 0,
                   percentage: -1
           })
        }
    }
})(budgetController, UIController);

appController.init()