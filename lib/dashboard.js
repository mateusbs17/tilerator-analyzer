'use strict'

const analyzer = require('./analyzer');
const http = require('./http-interceptor');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const conf = yaml.safeLoad(fs.readFileSync(`${appDir}/config.dev.yaml`, 'utf8'));
const baseUrl = conf.servers[conf.use].url;
const order = "asc"
const limit = 1000

const states = [
    'complete',
    'active',
    'inactive',
    'delayed',
    'failed',
]

let cache = {};

const fetchByState = (state) => {
    return http.get(`${baseUrl}/${state}/0..${limit}/${order}`, (data) => {
        data = data || {};
        let analysis = analyzer.processData(data);
        cache[`${state}`] = analysis;
        
        return analysis;
    });
}

const updateCache = () => {
    return Promise.all(states.map((state) => fetchByState(state)));
}

const fetchAll = (refreshCache = false) => {
    return new Promise((resolve) => {
        if (refreshCache || Object.getOwnPropertyNames(cache).length === 0) {
            updateCache().then(() => {
                resolve(cache);
            });
        } else {
            resolve(cache);
        }
    });
}

const getOverallStats = () => {
    return analyzer.processOverallStats(cache);
}

module.exports = {
    fetchAll,
    fetchByState,
    getOverallStats,
    cache,
}