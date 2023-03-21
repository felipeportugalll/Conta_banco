//Módulos externos 
import inquirer from "inquirer";
import chalk from "chalk";

//Módulos internos 
import fs from 'fs'; 

operation() //chama a função

//User options
function operation() {

    inquirer.prompt([
        {
        type: 'list',
        name: 'action',
        message: 'Seja bem vindo! O que deseja?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
        },
    ])
    .then((answer) => {
        const action = answer['action']
        
        if(action === 'Criar Conta') {
            createAccount()
        } else if(action === 'Depositar') {
            deposit()
        } else if(action === 'Consultar Saldo') {
            getAccoutBalance()
        } else if(action === 'Sacar') {
            withdraw()
        } else if(action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o nosso Banco!'))
            process.exit()
        }
    })
    .catch(err => console.log(err)) 
}

//Starts the creation of the user account
function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Por favor, defina as opções da sua conta a seguir.'))

    buildAccount()
}

//Build the account
function buildAccount() {

    inquirer
    .prompt([
        {
            name: 'accountName',
            message: 'Digite seu nome: '
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        console.info(answer['accountName'])

        if(!fs.existsSync('accounts')) { 
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(
                chalk.bgRed.black('Esta conta já existe')
            )
            buildAccount(accountName)
            // return
        }

        fs.writeFileSync(`accounts/${accountName}.json`,
         '{"balance": 0}',
         function(err) {
            console.log(err)
         },
        )

        console.log(chalk.green(`Conta criada com sucesso ${accountName}`))
        operation()
    })
    .catch((err) => console.log(err))
}

//deposit amount function
function deposit() {

    inquirer
    .prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        },
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        //first verify if the account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor você deseja depositar?'
            }
        ])
        .then((answer) => {
            const amount = answer['amount']

            //add amount
            addAmount(accountName, amount)
            operation()
        })
        .catch((err) => console.log(err))
    })
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Conta inexistente. Tente novamente.'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(
            chalk.bgRed.black('Ops! Um erro ocorreu, tente novamente!'),
        )
        return deposit()
    }
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(
        chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
    )
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8', 
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//show account balance
function getAccoutBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verify if it exists
        if(!checkAccount(accountName)) {
            return getAccoutBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `O saldo da sua conta é R$${accountData.balance}`
        ),)
        operation()
    })
    .catch(err => console.log(err))
}

//withdraw comand
function withdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        if(!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual quantia você deseja sacar?',
            }
        ])
        .then((answer) => {
            const amount = answer['amount']
            
            removeAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(
            chalk.bgRed.black('Ops! Um erro ocorreu, tente novamente!')
        )
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor insuficiente!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} na sua conta.`))
    // operation()
}