const CURRENCY_OWN = document.getElementById("currency-own");
let currencyWant = document.getElementById("currency-want");
let changeQuantityText = document.getElementById("change-quantity-text");
let inputCurrencyQuantity = document.getElementById("change-currency-quantity");
let changeWillGetText = document.getElementById("change-will-get-text");
let btnExchangeNextStep = document.getElementById("exchange-next-step__btn");
const POINTER_EXCHANGE = document.querySelector(".exchange-form-pointer__item");
const EXCHANGE_BTN = document.getElementById("exchange-button");
let exchangeButtonCancel = document.getElementById("exchange-button_cancel");
let willGetText = document.querySelector(".text-block_dinamic");
const BLOCK_SHOW_TEXT = document.querySelector(".error__text")
const PAID_BTN = returnId("paid-button");
const BTN_COPY_TRANSFER = returnId('btn-copy-transfer');
const BTN_COPY_ADDRESS = returnId('btn-copy-address');
const MESSAGE_BLOCK = document.querySelector(".error")
const ERROR_BTN = document.querySelector(".error__btn");
const OBJ_MESSAGES = {
    pending: "Please expect your application to be processed",
    approved: "Your application is approved, details you can see in the mail",
    timeOut: "Sorry, but your time is up, make a new application",
    errorEmailAndIban: "Error! Check and enter the correct email and account number",
    errorEmail: "Error! Check and enter the correct email",
    errorIban: "Error! Check and enter the correct account number",
    errorData: "Error! Check and enter the correct data",
    errorUnexpected: "Oops an unexpected error occurred, reload the page and try again",
}
function returnId(id) {
    return document.getElementById(id)
}
function changeText(parentElemInput, elemOutput) {
    elemOutput.innerText = parentElemInput.children[0].innerText
}
function nextFormSlide() {
    let elem = searchActiveSlideAndRemove()
    elem.nextElementSibling.classList.toggle("active");
    POINTER_EXCHANGE.classList.toggle("pointer_active");
    POINTER_EXCHANGE.nextElementSibling.classList.toggle("pointer_active");
    if (document.querySelector(".exchange-form__third-form").classList.contains("active")) {
        POINTER_EXCHANGE.parentNode.classList.toggle("d-none")
    }
}
function searchActiveSlideAndRemove() {
    let activeElem = document.querySelector(".active");
    activeElem.classList.toggle("active");
    return activeElem
}
function viewStartSlide() {
    let elem = searchActiveSlideAndRemove()
    elem.parentElement.children[0].classList.toggle("active");
    document.querySelector(".exchange-form-pointer").classList.remove("d-none");
    clearTimeout(timeout_id)
}
function setMessage(elem, message) {
    return elem.innerText = message
}
function hide(elem) {
    return elem.classList.add("d-none")
}
function show(elem) {
    if (elem.classList.contains("d-none")) {
        return elem.classList.remove("d-none")
    }
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
function clipToBuffer(id) {
    let elem = document.getElementById(id)
    elem.removeAttribute("disabled")
    elem.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges()
    elem.setAttribute("disabled", "true")
}
function reloadPage(action) {
    if (action) window.location.reload()
    hide(MESSAGE_BLOCK)
}
function closeMessageBlock(e) { ERROR_BTN.addEventListener("click", () => { reloadPage(e) }) }

CURRENCY_OWN.addEventListener("click", () => {
    openWrap(CURRENCY_OWN);
    changeText(CURRENCY_OWN, changeQuantityText)
    changeText(CURRENCY_OWN, returnId("cryptoName"))
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

EXCHANGE_BTN.addEventListener("click", () => {
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
                if (response.status === "200") {
                    clearTimeout(timeout_id)
                    nextFormSlide();
                    fillingResponseFiend(response.result)
                    window.location.reload()
                }
                else {
                    if (response.errors.email && response.errors.iban) {
                        closeMessageBlock()
                        show(MESSAGE_BLOCK)
                        setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorEmailAndIban)
                    }
                    else if (response.errors.email) {
                        closeMessageBlock()
                        show(MESSAGE_BLOCK)
                        setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorEmail)
                    }
                    else if (response.errors.iban) {
                        closeMessageBlock()
                        show(MESSAGE_BLOCK)
                        setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorIban)
                    }
                    else {
                        closeMessageBlock()
                        show(MESSAGE_BLOCK)
                        setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorUnexpected)
                    }
                }
            })
            .catch(
                error => {
                    closeMessageBlock(true)
                    show(MESSAGE_BLOCK)
                    setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorUnexpected)

                }
            )
    }
});
function fillingResponseFiend(obj) {
    returnId("exchange-crypto-value").value = `${obj.own} ${obj.crypto_amount}`
    returnId("wallet-adress").value = obj.our_crypto_wallet
    returnId("exchange-money-value").innerText = obj.amount
    returnId("money-type").innerText = obj.want
    returnId("account-number").innerText = obj.iban
    localStorage.setItem("token", JSON.stringify(obj))
}
btnExchangeNextStep.addEventListener("click", () => {
    if (returnId("change-currency-quantity").value !== "") {
        nextFormSlide()
    }
});

exchangeButtonCancel.addEventListener('click', () => {
    viewStartSlide()
    localStorage.removeItem("token")
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
        obj[key] !== "" ? flag = true : flag = false
    }
    return flag
}


BTN_COPY_ADDRESS.addEventListener('click', () => { clipToBuffer("wallet-adress") })
BTN_COPY_TRANSFER.addEventListener('click', () => { clipToBuffer("exchange-crypto-value") });

let f = (obj) => {
    let token = obj || JSON.parse(localStorage.getItem("token"))
    let url = "https://srv.bitfiat.online/server/paids"
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(token)
    })
        .then(response => response.json())
        .then(response => {
            if (response.status == "200") {
                show(MESSAGE_BLOCK)
                setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.approved)
                closeMessageBlock(true)

                localStorage.removeItem("token")
                recusrion(false)
            }
            else if (response.status == "418") {
                recusrion(true)
                if (MESSAGE_BLOCK.classList.contains("d-none")) {
                    MESSAGE_BLOCK.classList.remove("d-none")
                    setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.pending)
                }
                if (!document.querySelector(".error__btn").classList.contains("error__btn_pending")) {
                    if (localStorage.getItem("paid")) {
                        // document.querySelector(".error__btn").classList.add("error__btn_pending")
                        // document.querySelector(".error__btn").setAttribute("disabled", "true")
                        pendingOperation(true)
                    }
                }
            }
        })
        .catch(error => {
            closeMessageBlock()
            show(MESSAGE_BLOCK)
            setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.errorUnexpected)
        })

}
function pendingOperation(action) {
    if (action) {
        ERROR_BTN.classList.add("error__btn_pending")
        ERROR_BTN.setAttribute("disabled", "true")
    }
    else {
        ERROR_BTN.classList.remove("error__btn_pending")
        ERROR_BTN.removeAttribute("disabled")
    }

}
let timeOut
function recusrion(action) {
    if (action) {
        timeOut = setTimeout(() => { f() }, 1000)
    }
    else { clearTimeout(timeOut) }
}
let timer;
if (localStorage.getItem("token")) {
    timer = +JSON.parse(localStorage.getItem("token")).time
    nextFormSlide();
    nextFormSlide();
    let obj = JSON.parse(localStorage.getItem("token"))
    returnId("exchange-crypto-value").value = `${obj.own} ${obj.crypto_amount}`
    returnId("wallet-adress").value = obj.our_crypto_wallet
    returnId("exchange-money-value").innerText = obj.amount
    returnId("money-type").innerText = obj.want
    returnId("account-number").innerText = obj.iban
    willGetText.innerText = `${obj.amount} ${obj.want}`
    clearTimeout(timeout_id)
    let transactionToken = {
        transaction_token: obj.transaction_token
    }
    if (transactionToken) {
        let url = "https://srv.bitfiat.online/server/gets/transactions/infos"
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(transactionToken)
        })
            .then(response => response.json())
            .then(response => {
                if (response.status == "200") {
                    localStorage.setItem("token", JSON.stringify(response.result))
                    timer = response.result.time

                }
                else {
                    viewStartSlide()
                    clearInterval(timer_id)
                    show(MESSAGE_BLOCK)
                    localStorage.removeItem("token")
                    localStorage.removeItem("paid")
                }
            })
    }
}
else {
    recusrion(false)
    closeMessageBlock(true)
    setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.approved)
    // document.querySelector(".error__btn").classList.remove("error__btn_pending")
    // document.querySelector(".error__btn").removeAttribute("disabled")
    pendingOperation(false)
    localStorage.removeItem("token")
    localStorage.removeItem("paid")
}

let seconds = "00";
let minutes = "00"
let timer_id = setInterval(() => {
    timer--;
    seconds = Math.floor(timer % 60);
    minutes = Math.floor((timer / 60) % 60);
    returnId("timer").innerText = `${minutes}:${seconds}`
    if (timer <= 0) {
        closeMessageBlock(true)
        clearInterval(timer_id)
        show(MESSAGE_BLOCK)
        setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.timeOut)
        // document.querySelector(".error__btn").classList.remove("error__btn_pending")
        // document.querySelector(".error__btn").removeAttribute("disabled")
        pendingOperation(false)
        localStorage.removeItem("token")
        localStorage.removeItem("paid")
        recusrion(false)
    }
}, 1000);

PAID_BTN.addEventListener("click", () => {
    let obj = JSON.parse(localStorage.getItem("token"));
    localStorage.setItem("paid", "true")
    f(obj)
})
if (localStorage.getItem("paid")) {
    show(MESSAGE_BLOCK)
    setMessage(BLOCK_SHOW_TEXT, OBJ_MESSAGES.pending)
    let obj = JSON.parse(localStorage.getItem("token"));
    f(obj)
}