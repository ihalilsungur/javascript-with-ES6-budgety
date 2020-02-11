//Budget controller
var budgetController = (() =>{
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
   calcPercentage = (totalIncome)=>{
     if (totalIncome > 0) {
       this.percentage = Math.round(this.value / totalIncome) * 100;
     } else {
       this.percentage = -1;
     }
   }
  }
  class Income extends Budget{
    constructor(id,description,value){
      super(id,description,value);
    }
  }

  /*
  toplam gelir ve gider hesaplama fonksiyonu
  * */
 let calculateTotal = (type)=>{
  let sum = 0;
   data.allItems[type].forEach(current => {
     sum += current.value; 
   });
    /*
    buradaki toplam gelir ve giderimizi totals nesnesi içindeki exp ve inc değişkenlerine
    gönderdik.*/
    data.totals[type] = sum;
 }



  let data ={
    allItems :{
      exp : [],
      inc :[]
    },
    totals:{
     exp :0,
     inc:0
    },
    budget :0,
    percentage :-1
  }

  return{
      /* addItem ile ile Expense ve Income gelen değerleri  Expense ve Income nesneleri
        allItems dizisinin içine eklendik.
        Burada gelen nesne için Expense ve Income olduğunu gelen type değerine göre
        hangisi olduğunu anlamaya çalıştık.
         */
        addItem : (type,desc,val) => {
          let newItem,id;
         //[1,2,3,4,5] next id =6
         //[1,2,4,6,8] next id=6
         //id = last id+1
         //yeni id oluşturma
         if(data.allItems[type].length >0){
           id = data.allItems[type][data.allItems[type].length-1].id+1;
         }else{
           id = 0;
         }
           //yeni nesne "exp" veya "inc" oluşturma
           if (type === 'exp') {
             newItem = new Expense(id,desc,val);
           }else if (type ==='inc') {
             newItem = new Income(id,desc,val);
           }
            //yeni oluşturulan newItem data içinde allItems ekleme
            data.allItems[type].push(newItem);
             //yeni oluşturulan nesnenin geri döndürülmesi
             return newItem;
        },
        deleteItem : (type,id) => {
             /*
            * Burada örneğin [ 1 2 4 6 8 ] gibi biri dizimiz var
            * biz burda örneğin id = 6 olan öğeyi silmek isteiğimizde direk olarak data.allItems[type][id]
            * ile silemeyiz. çünkü id = 6  olan öğeyi ancak index numarasına göre silmek gerekiyor.
            * bunun için önce gelen id nin index numarasını öğrenip ona göre silmemiz gerekir.
            * */

            data.allItems[type].forEach((current,index)=>{
              if(id === current.id){
                data.allItems[type].splice(index,1);
              }
            });
        },

        calculateBudget :(type) => {
         //toplam expense(gider) ve income(gelir) hesaplama
         calculateTotal("inc");
         calculateTotal("exp");
           // Hesaplanan bütçe  : income - expense
           data.budget = data.totals.inc - data.totals.exp;
        },

        getBudget:  () => {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }
      },

        testing:  ()=> {
          console.log("Data : ", data);
      }

  }
  
})();

//modul tanimla -------------------------------------------------------------------------------------------------
//UI Controller
let UIController = (() => {
   /*
     documnet.querySelector() ile aldığımız sınıf isimleri ileride çok fazla yerde kullanıdığımız için
     ileride çok karmaşıklığa neden olacaktır.
     ikinci bir sıkıntımız ise ilerde çok yerde kullanıdğımız document.querySelector() ile alınan
     sınıf isimlerini değiştirmeye kalktığımızda ise çok yerde kullanıldığı için değiştirmek baya
     zahmetli olacaktır.
     bunun için kullanacağımız document.querySelector() ile sınıf isimlerini tek bir yerde toplamak
     hem olası karışıklığı engelemek için hemde ileride değiştirmek istedeiğimizde çok kolayca
     değiştirebiliceğiz.
     bunun için tüm sınıfları DOMStrings nesnesi altınta topladık.
     */
  const DOMstrings = {
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
    dataLabel: ".budget__title--month"
  };
  let formatNumber =  (num, type)=> {
    let numSplit, int, dec;
    num = Math.abs(num);//num değerinin mutlak değerin aldık.
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];

    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + "." + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    //type === 'exp' ? sign = '-' : sign = '+';
    return (type === 'exp' ? '-' : '+') + ' ' + int + ',' + dec;
};

  return {
       //return içinde yazdığımız kodları aslında  Controller modülünde erişmek için erişime açıyoruz.
       getInput : ()=>{
          //Girilen değerleri nesne olarak geri dönderiyoruz;
          return {
            type : document.querySelector(DOMstrings.inputType).value,
            description : document.querySelector(DOMstrings.inputDescription).value,
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)

          }
       },

        /*
        Eklenen yeni nesneleri arayüzde görünlemek için addListItem fonksiyonun kullandık.
         */
        addListItem : (obj,type) => {
        let html,element;
        //ilk olarak oluşturulan nesne için arayüzde HTML oluşturalım.
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html =
          `<div class="item clearfix" id="inc-${obj.id}">
             <div class="item__description">${obj.description}</div>
               <div class="right clearfix">
              <div class="item__value">${obj.value}</div>
                 <div class="item__delete">
                     <button class="item__delete--btn">
                        <i class="ion-ios-close-outline"></i>
                     </button>
                 </div>
                </div>
           </div>`;
        }else if(type === 'exp'){
         element = DOMstrings.expensesContainer;
         html = `<div class="item clearfix" id="exp-${obj.id}">
                   <div class="item__description">${obj.description}</div>
                     <div class="right clearfix"> 
                        <div class="item__value">${obj.value}</div>
                           <div class="item__percentage">21%</div> 
                               <div class="item__delete">
                                  <button class="item__delete--btn">
                                      <i class="ion-ios-close-outline"></i>
                                  </button>
                               </div>
                      </div>
                 </div>`;
          }

           //html DOM ekleyelim
           document.querySelector(element).insertAdjacentHTML("beforeend", html);
        },
          /*Silmek için seçtiğimiz nesneyi sildiğimiz zaman nesnenin ara yüzdende sildim.*/
          deleteListItem:  (selectorId) => {
            console.log("Selector Id : ",selectorId);
            let el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
        clearFields : () => {
          let inputDescription;
          inputDescription = document.querySelector(DOMstrings.inputDescription);
          inputDescription.value = "";
         document.querySelector(DOMstrings.inputValue).value = "";
         inputDescription.focus();

          },

          displayBudget :  (obj) => {
            let type;
            obj.budget >= 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },
        displayMonth :  () => {
          let now, year, month, months;
          months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
          now = new Date();
          month = now.getMonth();
          year = now.getFullYear();
        document.querySelector(DOMstrings.dataLabel).textContent = months[month] + " " + year;
      },

      /*
         DOMStrings nesnemizi controller modülünden erişmek için getDOMStrings değişkenini tanımladık.
         ve geriye DOMStrings nesnesini dönderdik.
         */
        getDOMStrings : () =>  DOMstrings
  }

  
})();

// Global App Controller-----------------------------------------------------------------------------------------
var controller = ((budgetCtrl, UICtrl) => {
  let setupEventlisteners = () => {
    const DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress",  (event) =>  {
      if (event === 13 || event.which === 13) {
     ctrlAddItem();
      }
    });
  
    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
      //document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
      
  };

  /*
  bütçeyi güncelleme metodumuz
  */
 let updateBudget = () => {
   //1.Bütçeyi Hesapla
   budgetCtrl.calculateBudget();
   //2.Hesaplanan bütçeyi geri döndürme
   let budget = budgetCtrl.getBudget();
   //3.Bütçeyi UIController ara yüzüne gönder
   UICtrl.displayBudget(budget);
 }

  let ctrlAddItem = () =>{
    let input ,newItem;
   //1.Girilen değerleri al.
   input = UICtrl.getInput();
     /*
        Girilen değerleri kontrol ettik.Yani description ve value değerlerinin boş girilmemesi için gerekli kontrolu
        yaptım.
         */
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
          //2.itemleri bütçe denetleyicisine ekle
          newItem = budgetCtrl.addItem(input.type,input.description,input.value);
        //3.Eklenen öğeyi UIControllere ekle
        UICtrl.addListItem(newItem,input.type);
        //4.Alanları Temizle
        UICtrl.clearFields();
        //5.Bütçeyi hesapla ve güncelle
        updateBudget();
        //6.Yüzdelikleri hesapla ve güncelle
        }
  };
  let ctrlDeleteItem = (event)=>{
    let itemId, splitId,type,id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    splitId = itemId.split('-');
    type = splitId[0];
    id =parseInt( splitId[1]);
     //1. seçilen nesnenin data yapisindan silinmesi
     budgetCtrl.deleteItem(type,id);
    //2. silinen nesnenin arayüzden silinmesi
    UICtrl.deleteListItem(itemId);
    //3. yeni bütçenin hesaplanmasının güncellenmesi
    updateBudget();

  };
  return {
    init : () => {
      console.log("Application has started!.");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
    });
    setupEventlisteners();
    },
    
  };
  
})(budgetController, UIController);

controller.init();
