const http = require('http');

const get = (url, callback) => {
    return new Promise((resolve, reject) => {
        try {
            http.get(url, (res) => {
                let buffer = '';

                res.on('data', (chunk) => {
                    buffer += chunk;
                });

                res.on('end', () => {
                    const data = JSON.parse(buffer);
                    resolve(callback(data));
                });

                res.on('error', (err) => {
                    reject(err);
                });
            }); 
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = {
    get,
}