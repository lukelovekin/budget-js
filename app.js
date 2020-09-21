
 // check architectural diagram in video 

 /*
 Description:
 - Simple budget web app

 TODO:
 -

 Notes:
 - Modular Pattern with IIFes and Closures
  */

//

 var budgetController = (function() {
    var Expense = function(id, desc, value){
        this.id = id,
        this.desc = desc,
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }else{
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
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
        deleteItem: function(type, id) {
            var ids, index

            ids = data.allItems[type].map(function(e) {
                return e.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
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
        calculatePercentages: function() {
            data.allItems.exp.forEach((e) => {
                e.calculatePercentage(data.totals.inc)
            })
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map((e) => {
                return e.getPercentage()
            })
            return allPerc
        },
        getBudget: function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    }

 })();

//

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
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        month: ".budget__title--month"

    }

    var formatNumber = function(num) {
        var numSplit, int, dec

        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split(".")

        int = numSplit[0]

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3)
        }

        dec = numSplit[1]

        return int + "." + dec

    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if( type === "exp"){
                element = DOMStrings.expenseContainer

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description" >%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >'
            }

            newHtml = html.replace("%id%", obj.id)
            newHtml = newHtml.replace("%description%", obj.desc)
            newHtml = newHtml.replace("%value%", formatNumber(obj.value))

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
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
            document.querySelector(DOMStrings.budgetTotalValue).textContent = formatNumber(obj.budget)
            document.querySelector(DOMStrings.budgetExpValue).textContent = formatNumber(obj.totalExp)
            document.querySelector(DOMStrings.budgetIncValue).textContent = formatNumber(obj.totalInc)

            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "---"
            }
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel)

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + "%"
                }else{
                    current.textContent = "---"
                }
            })
        },

        displayMonth: function() {
            var now, year, month, months

            now = new Date() 
            year = now.getFullYear()
            month = now.getMonth()
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

            document.querySelector(DOMStrings.month).textContent = months[month]
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMStrings.addType + "," +
                DOMStrings.addDesc + "," +
                DOMStrings.addVal
            )
            
            nodeListForEach(fields, function(e) {
                e.classList.toggle('red-focus')
            })

            document.querySelector(DOMStrings.addButt).classList.toggle('red')
        }
    }
})();

//

var appController = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMStrings()
    
    var setupEventListeners = function() {
        
        document.querySelector(DOM.addButt).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem)
        
        document.querySelector(DOM.addType).addEventListener('change', UICtrl.changedType)
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

            updatePercentages()
        }
        
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID){
            splitID = itemID.split("-")
            type = splitID[0]
            ID = parseInt(splitID[1])

            // delete item form data structure
            budgetCtrl.deleteItem(type, ID)
            // delete the item from the UI
            UICtrl.deleteListItem(itemID)
            // update and show the new budget
            updateBudget()
            // calculate and update percentages
            updatePercentages()
        }
    }

    var updatePercentages = function() {
        // calculate percentages
        budgetCtrl.calculatePercentages()

        // read percentages from budget controller
        var percentages = budgetCtrl.getPercentages()

        // update the UI
        UICtrl.displayPercentages(percentages)

    

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
           UICtrl.displayMonth()
        }
    }
})(budgetController, UIController);

appController.init()