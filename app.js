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
  }
  class Income extends Budget{
    constructor(id,description,value){
      super(id,description,value);
    }
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
    dateLabel: ".budget__title--month"
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
        let html,newHtml,element;
        //ilk olarak oluşturulan nesne için arayüzde HTML oluşturalım.
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' +
          '<div class="right clearfix"><div class="item__value">%value%</div>' +
          '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          "</div> </div></div>";
        }else if(type === 'exp'){
         element = DOMstrings.expensesContainer;
         html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
         '<div class="right clearfix"> <div class="item__value">%value%</div>' +
         '<div class="item__percentage">21%</div> <div class="item__delete">' +
         '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
         " </div></div> </div>";
          }
           //buradaki html string ekranda statik değerlerle değiştirelim
           newHtml = html.replace("%id%", obj.id);
           newHtml = newHtml.replace("%description%", obj.description);
           newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

           //newHtml DOM ekleyelim
           document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
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
    /*
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
      */
  };

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
        //4.Alanları Temizle
        //5.Bütçeyi hesapla ve güncelle
        //6.Yüzdelikleri hesapla ve güncelle
        }
  }
  return {
    init : () => {
      console.log("Application has started!.");
      setupEventlisteners();
    }
  }
  
})(budgetController, UIController);

controller.init();
