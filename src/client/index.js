const axios = require('axios');

const TRANSACTIONS_PATH = (page) => `module=account&action=txlist&address=0x07D971C03553011a48E951a53F48632D37652Ba1&startblock=0&endblock=99999999&page=${page}&offset=5000&sort=asc&apikey=${process.env.API_KEY}`

const sleep = async (ms) => {
    await new Promise(resolve => setTimeout(resolve, ms))
}

// create getTransactionsHistory function
const getTransactionsHistory = async () => {
    const transactionsList = []
    for (let page = 0; page < 20; page++) {
        const transactions = await axios.get(`${process.env.API_URL}?${TRANSACTIONS_PATH(page)}`)
        if(!transactions?.data?.result) break
        await sleep(300)
        transactionsList.push(...transactions.data.result)
    }
    return transactionsList
}

module.exports = {
    getTransactionsHistory
};