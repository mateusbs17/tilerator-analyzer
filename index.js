const   fs = require('fs'),
        yaml = require('js-yaml'),
        dashboard = require('./lib/dashboard'),
        log = require('./lib/log'),
        conf = yaml.safeLoad(fs.readFileSync('./config.dev.yaml', 'utf8'))

dashboard.fetchByState('active').then((completedJobs) => {
    // console.log(completedJobs);
    log(completedJobs, `${conf.use}/active`);
    completedJobs.forEach((element) => {
        delete element.jobs;
    });
    delete completedJobs.jobs;
    console.log(completedJobs);
    // completedJobs.map((collection) => {
    //     console.log(collection.missing);
    // }); 
});

dashboard.fetchAll().then((allJobs) => {
    let all = dashboard.getOverallStats();
    log(all, `${conf.use}/main`);
    console.log(all);
    // all.map((collection) => {
    //     console.log(collection);
    // }); 
});