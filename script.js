const modal ={
    open (){
        document.querySelector ('.modal-overlay')
        .classList.add('active')

    },
    close (){
        document.querySelector ('.modal-overlay')
        .classList.remove('active')

    }

}
const Storage = {
    get (){
        return JSON.parse(localStorage.getItem("devys.finances:transactions")) || []

    },
    set (transactions){
        localStorage.setItem("devys.finances:transactions", JSON.stringify(transactions))

    }
}

const Transaction = {
    all:Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        app.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)

        app.reload()
    },
    
    incomes (){
        let income =0;

        Transaction.all.forEach(transaction => {
                if (transaction.amount > 0){
                    income += transaction.amount;
                }
            })
        
       return income;
    },
    expenses(){
        let expense =0;

        Transaction.all.forEach(transaction => {
                if (transaction.amount < 0){
                    expense += transaction.amount;
                }
            })
        
       return expense;
    },
    total (){
        return Transaction.incomes() + Transaction.expenses()
    }
}


const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){  
        
        const tr = document.createElement('tr')
        tr.innerHTML =DOM.innerHTMLTransaction(transaction, index )
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utilis.formatCurrency(transaction.amount)

    const html= 
    `
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}" >${amount}</td>
    <td class="date">${transaction.date}</td>
    <td><img onclick="Transaction.remove(${index})" src="imagens/menos.png" alt=""></td>
    `
    return html
},

    updateBalance(){
        document.getElementById("incomeDisplay")
        .innerHTML = Utilis.formatCurrency (Transaction.incomes())

        document.getElementById("expenseDisplay")
        .innerHTML = Utilis.formatCurrency (Transaction.expenses())

        document.getElementById("totalDisplay")
        .innerHTML = Utilis.formatCurrency (Transaction.total())

},

clearTransactions(){
    DOM.transactionContainer.innerHTML=""
}


}


const Utilis ={ // aqui eu configuro os numeros ex coloco em real br formato o dinheiro
    formatAmount(value){
        value =Number(value.replace(/\,\./g,"")) *100
        console.log(value)
        return value
        
    },

    formaDate(date){
        const splittedDate = date.split("-")
        return`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency (value) {
        const signal = Number(value) <0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number (value) / 100
        value = value.toLocaleString("pt-br",{
            style :"currency",
            currency:"BRL"
        })
        return signal + value

  
    }


}

const Form ={
    description :document.querySelector("input#description"),
    amount :document.querySelector("input#amount"),
    date :document.querySelector("input#date"),

    getValues(){
        return{
            description:Form.description.value,
            amount:Form.amount.value,
            date:Form.date.value,

            

        }

    },

    validateFields(){
        let {description, amount, date }  =Form.getValues()

        if (description.trim()===""||
            amount.trim()==="" ||
            date.trim()===""){
                throw new Error ("Por favor, preencha todos os campos")
            }

        amount = Utilis.formatAmount(amount)     
    },

    formatValues(){
        let {description, amount, date }  =Form.getValues()
        amount = Utilis.formatAmount(amount)

        date = Utilis.formaDate(date)

        return {
            description,
            amount,
            date
        }

        

    },

    
    CleanrFields(){
        Form.description.value =""
        Form.amount.value =""
        Form.date.value =""
    },


    submit(event){
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction = Form.formatValues()

           Transaction.add(transaction)

            Form.CleanrFields()
            modal.close()
            

            

        } catch (error) {
            alert(error.message)
        }

        

    }
}


const app ={
    init(){
        Transaction.all.forEach( DOM.addTransaction)
        
        DOM.updateBalance()


        Storage.set(Transaction.all)

    },
    reload (){
        DOM.clearTransactions()
        app.init()

    },
}
app.init()








    







    


