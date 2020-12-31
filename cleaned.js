const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const contracts = ['0x24a45ff6b4302acf2b271535a73c00135f8b2445'];

fs.createReadStream('pool.csv')
  .pipe(csv({
    mapValues: ({ header, index, value }) => header === 'Value' ? parseFloat(value.replace(/,/g, '')) : value
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const addresses = results.reduce((obj, transaction) => {
      if (contracts.includes(transaction.From)) {
        obj[transaction.To] = (obj[transaction.To] || 0) - transaction.Value;
      } else {
        obj[transaction.From] = (obj[transaction.From] || 0) + transaction.Value;
      }
      return obj;
    }, {});

    const qualified = Object.values(addresses).filter(v => v >= 3000).length;

    console.log('Unique addresses: ', Object.keys(addresses).length);
    console.log('Qualified addresses: ', qualified);
  });
