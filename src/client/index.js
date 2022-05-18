const fs = require('fs')
const axios = require('axios');
const { saveToSheets } = require('../google-sheets');

const TRANSACTIONS_PATH = (startBlock, endBlock, nftCollectionAddress) => `module=account&action=txlist&address=${nftCollectionAddress}&startblock=${startBlock}&endblock=${endBlock}&page=1&offset=10000&sort=asc&apikey=${process.env.API_KEY}`

const sleep = async (ms) => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

const mapArray = (arrayOfArrays) => {
    const result = []
    arrayOfArrays.forEach(item => {
        if (item?.data?.result.length && item?.status === 200) result.push(...item.data.result)
    })
    return result
}

const saveJsonAsync = async (data, fileName) => fs.writeFileSync(fileName, JSON.stringify(data), { encoding: 'utf8', flag: 'w' })


// create getTransactionsHistory function
const getTransactionsHistory = async (startBlock = 0, endBlock = 1, nftCollectionAddress = "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b") => {
    const numberOfLoops = endBlock - startBlock;
    for (let index = 0; index < numberOfLoops; index += 5) {
        try {
            const transactionsProm = axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH((startBlock + index), (startBlock + index + 1), nftCollectionAddress)}`)
            const transactionsProm1 = axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH((startBlock + index + 1), (startBlock + index + 2), nftCollectionAddress)}`)
            const transactionsProm2 = axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH((startBlock + index + 2), (startBlock + index + 3), nftCollectionAddress)}`)
            const transactionsProm3 = axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH((startBlock + index + 3), (startBlock + index + 4), nftCollectionAddress)}`)
            const transactionsProm4 = axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH((startBlock + index + 4), (startBlock + index + 5), nftCollectionAddress)}`)

            const transactions = await Promise.all([
                transactionsProm,
                transactionsProm1,
                transactionsProm2,
                transactionsProm3,
                transactionsProm4
            ]).then(mapArray)

            const lastBlock = (startBlock + index + 4)
            saveJsonAsync({ lastBlock: lastBlock }, `../../lastBlock.json`)
            await sleep(1000)

            console.log(`block: ${lastBlock}`)
            if (transactions.length) await saveToSheets(transactions)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = {
    getTransactionsHistory
};