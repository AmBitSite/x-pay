const CURRENCY_OWN = document.getElementById("currency-own");
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

function returnId(id) {
    return document.getElementById(id)
}

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

CURRENCY_OWN.addEventListener("click", () => {
    openWrap(CURRENCY_OWN);
    changeText(CURRENCY_OWN, changeQuantityText)
});
currencyWant.addEventListener("click", () => {
    openWrap(currencyWant)
    changeText(currencyWant, changeWillGetText)
});

function sendRequest() {
    let own = `${returnId("currency-own-value").getAttribute("data-value")}`;
    let want = `${returnId("currency-want-value").getAttribute("data-value")}`;
    let amount = returnId("change-currency-quantity").value || 0;
    let url = `https://srv.bitfiat.online/server/pair/${own}/${want}/${amount}`;
    if (own !== "OEUR") {
        fetch(url)
            .then(response => response.json())
            .then(response => {
                timeout_id
                if (!JSON.parse(response).code) {
                    returnId("change-currency-quantity").focus()
                    returnId("change-will-get-quantity").value = JSON.parse(response)
                    willGetText.innerText = `${JSON.parse(response)} ${want}`
                }
                else {
                    clearTimeout(timeout_id)
                }
            })
    }
}
let timeout_id = window.setInterval(sendRequest, 1000)

inputCurrencyQuantity.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "e":
            inputCurrencyQuantity.value = inputCurrencyQuantity.value.replace(e.key, '')
            break
        case "+":
            inputCurrencyQuantity.value = inputCurrencyQuantity.value.replace(e.key, '')
            break
        case "-":
            inputCurrencyQuantity.value = inputCurrencyQuantity.value.replace(e.key, '')
            break
    }
})


function checkPressKey(key) {
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
    if (fillingRecipient()) {



        let url = "https://srv.bitfiat.online/server/creates/conversions/steps/ones";
        let obj = {}
        obj.own = returnId("currency-own-value").getAttribute("data-value")
        obj.want = returnId("currency-want-value").getAttribute("data-value")
        obj.amount = returnId("change-currency-quantity").value || 0
        obj.email = returnId("input_email").value
        obj.crypto_wallet = returnId("input_wallet").value
        obj.bank_name = returnId("input_bank").value
        obj.swift = returnId("input_swift").value
        obj.iban = returnId("input-account").value
        let stringifyObj = JSON.stringify(obj)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: stringifyObj
        })
            .then(response => response.json())

            .then(response => {
                // if (response.status === "200") {
                clearTimeout(timeout_id)
                nextFormSlide();
                fillingResponseFiend(response.result)
                window.location.reload()
                // }
                // else {

                // }
            }
                // reject => {
                //     let activeElem = document.querySelector(".active");
                //     activeElem.classList.toggle("active");
                //     activeElem.parentElement.children[0].classList.toggle("active");
                //     document.querySelector(".exchange-form-pointer").classList.remove("d-none");
                //     clearTimeout(timeout_id)
                // }
            )
            .catch(
                error => {
                    let activeElem = document.querySelector(".active");
                    activeElem.classList.toggle("active");
                    activeElem.parentElement.children[0].classList.toggle("active");
                    document.querySelector(".exchange-form-pointer").classList.remove("d-none");
                    clearTimeout(timeout_id)
                    errorBlock.classList.remove("d-none")
                }
            )

    }
});
let errorBlock = document.querySelector(".error")
let errorBtn = document.querySelector(".error__btn")
errorBtn.addEventListener("click", () => {
    errorBlock.classList.add("d-none")
    window.location.reload()
})
function fillingResponseFiend(obj) {

    returnId("exchange-crypto-value").value = `${obj.own} ${obj.crypto_amount}`
    returnId("wallet-adress").value = obj.our_crypto_wallet
    let accountField = returnId("account-number");
    returnId("exchange-money-value").innerText = obj.amount
    returnId("money-type").innerText = obj.want
    accountField.innerText = obj.iban     //поле to account, поле iban будет приходить от сервера
    sessionStorage.setItem("token", JSON.stringify(obj))
}
btnExchangeNextStep.addEventListener("click", () => {
    if (returnId("change-currency-quantity").value !== "") {
        nextFormSlide()
    }
});

exchangeButtonCancel.addEventListener('click', () => {
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    activeElem.parentElement.children[0].classList.toggle("active");
    document.querySelector(".exchange-form-pointer").classList.remove("d-none");
    sessionStorage.removeItem("token")
    window.location.reload()
})

function fillingRecipient() {
    let obj = {};

    obj.email = returnId("input_email").value
    obj.walletAddress = returnId("input_wallet").value
    obj.bank_name = returnId("input_bank").value
    obj.swift = returnId("input_swift").value
    obj.iban = returnId("input-account").value
    obj.own = returnId("currency-own-value").getAttribute("data-value")
    obj.want = returnId("currency-want-value").getAttribute("data-value")
    obj.amount = `${returnId("change-currency-quantity").value}` || 0
    let flag = 0
    for (key in obj) {
        obj[key] = obj[key].trim();
        obj[key] !== "" ? flag++ : flag = 0
    }
    if (flag === 8) {
        return true
    }
    else return false
}

const BTN_COPY_TRANSFER = returnId('btn-copy-transfer');
const BTN_COPY_ADDRESS = returnId('btn-copy-address');

function clipToBuffer(id) {
    let elem = document.getElementById(id)
    elem.removeAttribute("disabled")
    elem.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges()
    elem.setAttribute("disabled", "true")
}
BTN_COPY_ADDRESS.addEventListener('click', () => { clipToBuffer("wallet-adress") })
BTN_COPY_TRANSFER.addEventListener('click', () => { clipToBuffer("exchange-crypto-value") });


if (sessionStorage.getItem("token")) {
    nextFormSlide();
    nextFormSlide();
    let obj = JSON.parse(sessionStorage.getItem("token"))
    returnId("exchange-crypto-value").value = `${obj.own} ${obj.crypto_amount}`
    returnId("wallet-adress").value = obj.our_crypto_wallet
    returnId("exchange-money-value").innerText = obj.amount
    returnId("money-type").innerText = obj.want
    returnId("account-number").innerText = obj.iban
    willGetText.innerText = `${obj.amount} ${obj.want}`
    clearTimeout(timeout_id)
    let timer = obj.time
    let seconds = "00";
    let minutes = "00"
    let timer_id = setInterval(() => {
        timer--;
        seconds = Math.floor(timer % 60);
        minutes = Math.floor((timer / 60) % 60);
        returnId("timer").innerText = `${minutes}:${seconds}`
        if(timer <=0){
            sessionStorage.removeItem("token")
            window.location.reload()
        }
    }, 1000);
    // debugger
    returnId("timer").innerText = `${minutes}:${seconds}`
    let transactionToken = {
        transaction_token:obj.transaction_token
    }
    let url = "https://srv.bitfiat.online/server/gets/transactions/infos"
    fetch(url,{
        method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(transactionToken)
    })
    .then(response => response.json())
    .then(response =>{
        sessionStorage.setItem("token", JSON.stringify(response.result))
    })
    .catch(
        error => {
            let activeElem = document.querySelector(".active");
            activeElem.classList.toggle("active");
            activeElem.parentElement.children[0].classList.toggle("active");
            document.querySelector(".exchange-form-pointer").classList.remove("d-none");
            clearTimeout(timeout_id)
            clearInterval(timer_id)
            errorBlock.classList.remove("d-none")
        }
    )
}