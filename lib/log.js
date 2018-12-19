'use strict';
const fs = require('fs')
var path = require('path');
var appDir = path.dirname(require.main.filename);
const logsPath = appDir + '/logs';

const appendFile = (dataToLog, filename) => {
    fs.appendFile(`${logsPath}/${filename}.log`, `${JSON.stringify(dataToLog)}\n`, function(err) {
      if (err) throw err;
    });
}

module.exports = (data, filename = 'main') => {
    // deep copy of data
    let dataToLog = JSON.parse(JSON.stringify(data));
    const date = new Date(); 

    if (Array.isArray(dataToLog)){
        dataToLog.forEach((dataByZoom, zoom) => {
            if (dataByZoom) {
                dataByZoom.timestamp = date.getTime();
                dataByZoom.zoom = zoom;
                delete dataByZoom.jobs;
                appendFile(dataByZoom, filename);
            }
        });
    } else {
        dataToLog.timestamp = date.getTime();
        delete dataToLog.jobs;
        appendFile(dataToLog, filename);
    }
}