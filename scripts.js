//Seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector('aside header h2')
const expensesQuantity = document.querySelector('aside header p span')
//Captura o evento de input para formatar o valor
amount.oninput = () => {
    //fazemos um regex para remover as letras e manter somente numeros
    let value = amount.value.replace(/\D/g, "")

    //transformar o valor em centavos (Exmplo: 150/100 = 1.5 que e equivalente a 1.50)
    value = Number(value) / 100

    //adiciona o valor sem letras ao input e att o input
    amount.value = formatCurrencyBRL(value)

}
//mascara de numero em BRL
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    //retorna o valor formatdo 
    return value
}
//Captura o evento do submit para obter os valores
form.onsubmit = (event) => {
    //remove o recarregamento da pagina padrao
    event.preventDefault()
    //criando objeto
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    ExpenseAdd(newExpense)

    console.log(newExpense)
}
//adiciona um novo item na lista!
function ExpenseAdd(newExpense) {
    try {
        //Cria o elemento li para adiiconar o item na lista (ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //Cria o icone da categoria!
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //cria a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`


        //cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")

        //Adiciona nome e categoria na div das informacoes da despesa
        expenseInfo.append(expenseName, expenseCategory)

        //Adiciona as informacoes do item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
        //adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulario
        formClear()

        //atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Nao foi possivel atualizar a lista de despesas")
        console.log(error)
    }
}
//atualiza os total
function updateTotals() {
    try {
        //recupera todos os itens (li) da lista( ul)
        const items = expenseList.children
        //atualiza a quantidade da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "depesas" : "despesa"}`
        //Variavel para incrementar o total
        let total = 0
        //percorrer cada item(li) na lista (ul)
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")
            //Remover caracteres nao numerios e substitui a virgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            //converte o valor para float
            value = parseFloat(value)
            //Verifica se e um numero valido.
            if (isNaN(value)) {
                return alert("Nao foi possivel calcular o total. O valor nao parece ser um numero!")
            }
            //Incrementar o valor total
            total += Number(value)
        }
        //criar a span para adicionar o R$ formatado 
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"
        //formata o valor e remove o r$ que sera exibido pelo smal com um estilo custimizado!
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //limpa o conteudo do elemento
        expensesTotal.innerHTML = ""
        //adiciona o simbolo da moeda
        expensesTotal.append(symbolBRL, total)


    } catch (error) {
        console.log(error)
        alert("nao foi possivel atualizar o total")
    }
}

//evento que captura o clique da lista
expenseList.addEventListener("click", function (event) {
    //Verifica se o elemento clicado e o icone de remover
    if (event.target.classList.contains("remove-icon")) {
        // obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove o item da lista
        item.remove()
    }
    //atualiza os totais!
    updateTotals()
})

function formClear() {
    //limpa o formulario
    expense.value = ""
    category.value = ""
    amount.value = ""

    //coloca o focu no input de amout
    expense.focus()

}

//Desenvolvedor Brendon
