//Módulos externos 
import inquirer from "inquirer";
import chalk from "chalk";

//Módulos internos 
import fs from 'fs'; 

operation() //chama a função

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
        
        console.log(action)
    })
    .catch(err => console.log(err)) 
}