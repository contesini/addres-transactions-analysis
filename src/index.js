require('dotenv').config()
const client = require('./client/index')

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

const readLastBlock = () => {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, '../lastBlock.json')
    const data = fs.readFileSync(filePath)
    return JSON.parse(data)
}


const main = async () => {
    // get transactions history 
    const lastBlock  = readLastBlock()
    if(lastBlock) console.log(`lastBlock: ${lastBlock.lastBlockNumber}`)

    await client.getTransactionsHistory( Number(process.env.START_BLOCK) || lastBlock.lastBlockNumber, Number(process.env.ENV_BLOCK) || 999999999, "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b")
}


main()



