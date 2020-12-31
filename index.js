const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('pool.csv')
  .pipe(csv({
    mapValues: ({ header, index, value }) => header === 'Value' ? parseFloat(value.replace(/,/g, '')) : value
  }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const addresses = results.reduce((obj, transaction) => {
      obj[transaction.From] = (obj[transaction.From] || 0) + transaction.Value;
      return obj;
    }, {});

    const qualified = Object.values(addresses).filter(v => v >= 3000).length;

    console.log('Unique addresses: ', Object.keys(addresses).length);
    console.log('Qualified addresses: ', qualified);
  });
