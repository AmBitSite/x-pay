let currencyOwn = document.getElementById("currency-own");
let currencyWant = document.getElementById("currency-want");
let changeQuantityText = document.getElementById("change-quantity-text");
let inputCurrencyQuantity = document.getElementById("change-currency-quantity")
let changeWillGetText = document.getElementById("change-will-get-text");
let inputCurrencyWillGet = document.getElementById("change-will-get-quantity");
let btnExchangeNextStep = document.getElementById("exchange-next-step__btn");
let pointerExchange = document.querySelector(".exchange-form-pointer__item");
let exchangeBtn = document.getElementById("exchange-button");
let exchangeButtonCancel = document.getElementById("exchange-button_cancel");
let willGetText = document.querySelector(".text-block_dinamic")

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
let arr = [];
let count = 0;

function sendRequest() {
    let own = `${document.getElementById("currency-own-value").getAttribute("data-value")}`;
    let want = `${document.getElementById("currency-want-value").getAttribute("data-value")}`;
    let amount = document.getElementById("change-currency-quantity").value || 0;
    let url = `https://srv.bitfiat.online/server/pair/${own}/${want}/${amount}`;
    // document.getElementById("loader").classList.toggle("d-none")
    // document.getElementById("preloader").classList.toggle("elem-disabled")
    // document.getElementById("change-currency-quantity").setAttribute("disabled", "true")
    if(own !== "OEUR" && want !== "USD"){
        fetch(url)
        .then(response => response.json())
        
        .then(response => {
            if (!JSON.parse(response).code) {
                // document.getElementById("loader").classList.toggle("d-none")
                // document.getElementById("preloader").classList.toggle("elem-disabled")
                // document.getElementById("change-currency-quantity").removeAttribute("disabled")
                document.getElementById("change-currency-quantity").focus()
                document.getElementById("change-will-get-quantity").value = JSON.parse(response)
                exchangeCryptoValue.innerText = amount;
                exchangeTypeCrypto.innerText = own
                moneyType.innerText = want
                exchangeMoneyValue.innerText = JSON.parse(response)
                willGetText.innerText = `${JSON.parse(response)} ${want}`

            }
        })
        // .catch(response => {
        //     if(JSON.parse(response).code ===500){
        //         // console.log(JSON.parse(response.json()))
        //         clearInterval(timer)
                
        //     }
        // })
    }
    else if (own === "OEUR" && want === "EUR"){
        document.getElementById("change-will-get-quantity").value = amount
    }
}


let timer = setInterval(sendRequest, 1000)
inputCurrencyQuantity.addEventListener("keyup", (e) => {
    
    // debugger
    // clearInterval(timer)
    // timer 
    if (checkPhoneKey(e.key)) {
        if (e.key != 'Backspace') {
            arr.push(e.key);
        }
        if (e.key == "." && count == 1) {
            arr.pop()
            inputCurrencyQuantity.value = arr.join("")
        }
        if (e.key == ".") {
            count = 1
            arr.push("0");
            inputCurrencyQuantity.value = arr.join("")
            timer
            arr.pop()
            inputCurrencyQuantity.value = arr.join("")
        };
        if (e.key == "Backspace") {
            let test = arr.pop()
            if (test === ".") {
                arr.pop()
            }
            if (test === undefined) {
                count = 0;
                
            }
            inputCurrencyQuantity.value = arr.join("")
            
            timer
        }
        inputCurrencyQuantity.value = arr.join("")
        timer
        
    }
    else if (e.code === "KeyV") {
        arr = inputCurrencyQuantity.value.split('')
        timer
    }
    else {
        inputCurrencyQuantity.value = inputCurrencyQuantity.value.replace(`${e.key}`, '')
    }
})

function checkPhoneKey(key) {
    return ((key >= '0' && key <= '9' || key == '.' || key == 'Backspace'));
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
exchangeBtn.addEventListener("click", () => {
    if(fillingRecipient()){
        nextFormSlide();
        let accountNumber = document.getElementById("account-number");
        let inputAccount = document.getElementById("input-account");
        accountNumber.innerText = inputAccount.value;
        clearInterval(timer)
    }
});
btnExchangeNextStep.addEventListener("click", () => {
    if (document.getElementById("change-currency-quantity").value !== "") {
        nextFormSlide()
    }
});

exchangeButtonCancel.addEventListener('click', () => {
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    activeElem.parentElement.children[0].classList.toggle("active");
    document.querySelector(".exchange-form-pointer").classList.remove("d-none");
    timer = setInterval(sendRequest, 1000)
})
let obj = {}
function fillingRecipient(){
    let email = document.getElementById("input_email")
    let walletAddress = document.getElementById("input_wallet")
    let bankName = document.getElementById("input_bank")
    let swift = document.getElementById("input_swift")
    let iban = document.getElementById("input-account")
    obj.email = email.value
    obj.walletAddress = walletAddress.value
    obj.bank_name = bankName.value
    obj.swift = swift.value
    obj.iban = iban.value
    obj.own = document.getElementById("currency-own-value").getAttribute("data-value")
    obj.want = document.getElementById("currency-want-value").getAttribute("data-value")
    obj.amount = document.getElementById("change-currency-quantity").value || 0
    let flag = 0
    for(key in obj){
        if(obj[key] !== ""){
            flag+=1
        }
        else {flag = 0}
    }
    if(flag === 8){
        return true
    }
    else return false
}
