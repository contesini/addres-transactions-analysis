require('dotenv').config()
const client = require('./client/index')
const saveToSheets = require('./google-sheets/index')

const orderByTransactionsCount = (transactionsByFromAndTo) => {
    const result = []
    Object.keys(transactionsByFromAndTo).forEach(key => {
        result.push(transactionsByFromAndTo[key])
    })
    return result.sort((a, b) => b.transactionsBetweenCount - a.transactionsBetweenCount)
}

const groupByFromAndTo = (transactions) => {
    const result = {}
    transactions.forEach(transaction => {
        if (!result[`${transaction.from}-${transaction.to}`]) {
            result[`${transaction.from}-${transaction.to}`] = {
                transactions: [transaction],
                transactionsBetweenCount: 1
            }

        } else {
            result[`${transaction.from}-${transaction.to}`]['transactions'].push(transaction)
            result[`${transaction.from}-${transaction.to}`]['transactionsBetweenCount'] += 1 
        }
    })
    return orderByTransactionsCount(result)
}

const saveJson = (data, fileName) => {
    const fs = require('fs')
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) throw err
        console.log('The file has been saved!')
    })
}

const main = async () => {
    // get transactions history 
    await client.getTransactionsHistory(process.env.START_BLOCK, process.env.ENV_BLOCK, "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b")
}


main()



