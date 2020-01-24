let currencyOwn = document.getElementById("currency-own");
let currencyWant = document.getElementById("currency-want");
let changeQuantityText = document.getElementById("change-quantity-text");
let inputCurrencyQuantity = document.getElementById("change-currency-quantity")
let changeWillGetText = document.getElementById("change-will-get-text");
let inputCurrencyWillGet = document.getElementById("change-will-get-quantity");
let btnExchangeNextStep = document.getElementById("exchange-next-step__btn");
let pointerExchange = document.querySelector(".exchange-form-pointer__item");
let exchangeBtn = document.getElementById("exchange-button");
let exchangeButtonCancel = document.getElementById("exchange-button_cancel")

function openWrap(element) {
    for (let i = 1; i < element.children.length; i++) {
        element.children[i].classList.toggle('d-none');
        element.children[i].addEventListener("click", () => {
            element.children[0].innerText = element.children[i].innerText;
            element.children[0].setAttribute("data-value", element.children[i].getAttribute("data-value"))
        })
    }
}
function changeText(parentElemInput, elemOutput) {
    elemOutput.innerText = parentElemInput.children[0].innerText
}

currencyOwn.addEventListener("click", () => {
    openWrap(currencyOwn);
    changeText(currencyOwn, changeQuantityText)
});
currencyWant.addEventListener("click", () => {
    openWrap(currencyWant)
    changeText(currencyWant, changeWillGetText)
});
let exchangeCryptoValue = document.getElementById("exchange-crypto-value");
let exchangeMoneyValue = document.getElementById("exchange-money-value");
let exchangeTypeCrypto = document.getElementById("crypto-type");
let moneyType = document.getElementById("money-type");

inputCurrencyQuantity.addEventListener("keyup", (e) => {
    if (checkPhoneKey(e.key)) {
        let own = `${document.getElementById("currency-own-value").getAttribute("data-value")}`;
        let want = `${document.getElementById("currency-want-value").getAttribute("data-value")}`;
        let amount = `${document.getElementById("change-currency-quantity").value}`;
        let url = `https://srv.bitfiat.online/server/pair/${own}/${want}/${amount}`;
        fetch(url)
            .then(response => response.json())
            .then(response => {
                if (!JSON.parse(response).code) {
                    document.getElementById("change-will-get-quantity").value = JSON.parse(response)
                    exchangeCryptoValue.innerText = amount;
                    exchangeTypeCrypto.innerText = own
                    moneyType.innerText = want
                    exchangeMoneyValue.innerText = JSON.parse(response)
                }

            })
    }
    else {
        inputCurrencyQuantity.value = inputCurrencyQuantity.value.replace(`${e.key}`, '')
    }
})

function checkPhoneKey(key) {
    return ((key >= '0' && key <= '9' || key == '.'));
}

function nextFormSlide() {
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    activeElem.nextElementSibling.classList.toggle("active");
    pointerExchange.classList.toggle("exchange-form-pointer__item_active");
    pointerExchange.nextElementSibling.classList.toggle("exchange-form-pointer__item_active");
    if (document.querySelector(".exchange-form__third-form").classList.contains("active")) {
        pointerExchange.parentNode.classList.toggle("d-none")
    }
}
// pointerExchange.addEventListener("click", ()=>{nextFormSlide()})
exchangeBtn.addEventListener("click", () => {
    nextFormSlide();
    let accountNumber = document.getElementById("account-number");
    let inputAccount = document.getElementById("input-account");
    accountNumber.innerText = inputAccount.value;
});
btnExchangeNextStep.addEventListener("click", () => { nextFormSlide() });

exchangeButtonCancel.addEventListener('click', ()=>{
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    activeElem.parentElement.children[0].classList.toggle("active");
    document.querySelector(".exchange-form-pointer").classList.remove("d-none")
})