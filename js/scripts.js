let currencyOwn = document.getElementById("currency-own");
let currencyWant = document.getElementById("currency-want");
let changeQuantityText = document.getElementById("change-quantity-text");
let inputCurrencyQuantity = document.getElementById("change-currency-quantity")
let changeWillGetText = document.getElementById("change-will-get-text");
let inputCurrencyWillGet = document.getElementById("change-will-get-quantity");
let btnExchangeNextStep =document.getElementById("exchange-next-step__btn");
let pointerExchange = document.querySelector(".exchange-form-pointer__item");
let exchangeBtn = document.getElementById("exchange-button");
let exchangeButtonCancel = document.getElementById("exchange-button_cancel")

function openWrap(element){
    for(let i = 1; i< element.children.length; i++){
        element.children[i].classList.toggle('d-none');
        element.children[i].addEventListener("click",()=>{
            element.children[0].innerText = element.children[i].innerText
        })
    }
}
function changeText(parentElemInput, elemOutput){
    elemOutput.innerText = parentElemInput.children[0].innerText
}

currencyOwn.addEventListener("click", ()=>{
    openWrap(currencyOwn);
    changeText(currencyOwn, changeQuantityText)
});
currencyWant.addEventListener("click", ()=>{
    openWrap(currencyWant)
    changeText(currencyWant, changeWillGetText)
});

inputCurrencyQuantity.addEventListener("keydown", (e)=>{
    if(e.key!== "Backspace" || e.key!== "Delete")alert(inputCurrencyQuantity.value + e.key)
    

})
// function searchLetters(elem){
//     (elem.value.search()!=-1)
// }


function nextFormSlide(){
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    activeElem.nextElementSibling.classList.toggle("active");
    pointerExchange.classList.toggle("exchange-form-pointer__item_active");
    pointerExchange.nextElementSibling.classList.toggle("exchange-form-pointer__item_active");
    if(document.querySelector(".exchange-form__third-form").classList.contains("active")){
        pointerExchange.parentNode.classList.toggle("d-none")
    }
}
// pointerExchange.addEventListener("click", ()=>{nextFormSlide()})
exchangeBtn.addEventListener("click", ()=>{nextFormSlide()});
btnExchangeNextStep.addEventListener("click", ()=>{nextFormSlide()});