const   fs = require('fs'),
        yaml = require('js-yaml'),
        dashboard = require('./lib/dashboard'),
        log = require('./lib/log'),
        conf = yaml.safeLoad(fs.readFileSync('./config.dev.yaml', 'utf8'))

const states = [
    'complete',
    'active',
    'inactive',
    'delayed',
    'failed',
]

states.map((state) => {
    dashboard.fetchByState(state).then((completedJobs) => {
        log(stateJobs, `${conf.use}/${state}`);
        stateJobs.forEach((element) => {
            delete element.jobs;
        });
        delete stateJobs.jobs;
        stateJobs.map((collection) => {
            console.log(collection.missing);
        }); 
    });
});


dashboard.fetchAll().then((allJobs) => {
    let all = dashboard.getOverallStats();
    log(all, `${conf.use}/main`);
    // console.log(all);
});