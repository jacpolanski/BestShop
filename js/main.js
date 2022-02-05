console.log("jestem")

function Calculator(calcForm, calcSummary) {

    this.costs = {
        products: 1.25,
        orders: 1.5,
        package: {
            basic: 10,
            professional: 20,
            premium: 30
        },
        accounting: 15,
        terminal: 100
    }

    this.calcForm = {
        products: document.querySelector("#products"),
        orders: document.querySelector("#orders"),
        package: document.querySelector("#package"),
        accounting: document.querySelector("#accounting"),
        terminal: document.querySelector("#terminal"),
    }

    this.calcSummary = {
        list: calcSummary.querySelector("ul"),
        items: calcSummary.querySelector("ul").children,
        total: {
            divSummary: document.querySelector("#total-price"),
            totalPrice: calcSummary.querySelector(".total__price")
        }
    }

    this.addEvents()
}

Calculator.prototype.inputBox = function (object) {

    const id = object.currentTarget.id
    const value = object.currentTarget.value

    const price = this.costs[id]
    const totalPrice = value * price

    this.updateCalcSummary(id, value + " * $" + price, totalPrice, function (item, calc, total) {
        if (value < 0) {
            calc.innerHTML = null
            total.innerText = "Value should be greater than 0"
        }

        if (value.length === 0) {
            item.classList.remove("open")
        }
    })
    this.updateSum();
}

Calculator.prototype.updateCalcSummary = function (id, calc, total, callback) {
    const summary = this.calcSummary.list.querySelector(`[data-id=${id}]`)
    const summaryCalc = summary.querySelector(".item__calc")
    const summaryTotal = summary.querySelector(".item__price")

    summary.classList.add("open")

    if (summaryCalc !== null) {
        summaryCalc.innerText = calc
    }

    summaryTotal.innerText = "$" + total

    if (typeof callback === "function") {
        callback(summary, summaryCalc, summaryTotal)
    }
}

Calculator.prototype.selectBox = function (object) {
    this.calcForm.package.classList.toggle("open")

    let value
    let text
    if (typeof object.target.dataset.value !== "undefined") {
        value = object.target.dataset.value
    } else {
        value = ""
    }
    if (typeof object.target.dataset.value !== "undefined") {
        text = object.target.innerText
    } else {
        text = "Choose package"
    }
    console.log(value)
    console.log(text)

    if (value.length > 0) {
        this.calcForm.package.dataset.value = value
        this.calcForm.package.querySelector(".select__input").innerText = text

        this.updateCalcSummary("package", text, this.costs.package[value])
    }

    this.updateSum();
}

Calculator.prototype.checkBox = function (object) {
    const checkbox = object.currentTarget
    const id = object.currentTarget.id
    const checked = checkbox.checked

    this.updateCalcSummary(id, undefined, this.costs[id], function (item) {
        if (!checked) {
            item.classList.remove("open")
        }
    })

    this.updateSum();
}


Calculator.prototype.addEvents = function () {
    // Inputs
    this.calcForm.products.addEventListener("change", this.inputBox.bind(this))
    this.calcForm.products.addEventListener("keyup", this.inputBox.bind(this))
    this.calcForm.orders.addEventListener("change", this.inputBox.bind(this))
    this.calcForm.orders.addEventListener("keyup", this.inputBox.bind(this))

    // Select
    this.calcForm.package.addEventListener("click", this.selectBox.bind(this))

    // Checkboxes
    this.calcForm.accounting.addEventListener("change", this.checkBox.bind(this))
    this.calcForm.terminal.addEventListener("change", this.checkBox.bind(this))
}

Calculator.prototype.updateSum = function () {
    const show = this.calcSummary.list.querySelectorAll(".open").length > 0;

    if (show) {
        const productSum = this.calcForm.products.value < 0 ? 0 : this.calcForm.products.value * this.costs.products;
        const ordersSum = this.calcForm.orders.value < 0 ? 0 : this.calcForm.orders.value * this.costs.orders;
        const packagePrice = this.calcForm.package.dataset.value.length === 0 ? 0 : this.costs.package[this.calcForm.package.dataset.value];
        const accounting = this.calcForm.accounting.checked ? this.costs.accounting : 0;
        const terminal = this.calcForm.terminal.checked ? this.costs.terminal : 0;

        this.calcSummary.total.totalPrice.innerText = "$" + (productSum + ordersSum + packagePrice + accounting + terminal);

        this.calcSummary.total.divSummary.classList.add("open");
    } else {
        this.calcSummary.total.divSummary.classList.remove("open");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const calcForm = document.querySelector(".calc__form")
    const calcSummary = document.querySelector(".calc__summary")

    new Calculator(calcForm, calcSummary)
})


