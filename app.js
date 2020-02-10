//Budget controller
var budgetController = (function() {
  //Burada sınıflarımızı oluşturacağım
  class Budget {
    constructor(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
    }
  }
  class Expense extends Budget{
   constructor(id,description,value){
     super(id,description,value);
     this.percentage = -1;
   }
  }
  class Income extends Budget{
    constructor(id,description,value){
      super(id,description,value);
    }
  }
  
})();

//modul tanimla -------------------------------------------------------------------------------------------------
//UI Controller
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  
})();

// Global App Controller-----------------------------------------------------------------------------------------
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventlisteners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
  };

  
})(budgetController, UIController);

controller.init();
