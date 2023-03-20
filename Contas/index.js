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
        ]
        }
    ])
    .then((answer) => {
        const action = answer['action']
        
        if(action === 'Criar Conta') {
            createAccount()
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
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')) { 
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`,
         '{"balance": 0}',
         function(err) {
            console.log(err)
         }
        )

        console.log(chalk.green('Conta criada com sucesso!'))
        operation()
    })
    .catch((err) => console.log(err))
}