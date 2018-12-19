'use strict';

const processData = (raw) => {
    let analysis = [];

    if (!raw) return analysis;
    raw.forEach((job) => {
        if (typeof analysis[job.data.zoom] === 'undefined' || analysis[job.data.zoom].length === 0){
            analysis[job.data.zoom] = {};
            analysis[job.data.zoom].jobs = [];
        }
        if (typeof job.progress_data !== 'undefined'){
            analysis[job.data.zoom].jobs.push(job.progress_data);
        }
    });
    analysis.forEach((collection, zoom) => {
        const totalTiles = Math.pow(2, zoom) * Math.pow(2, zoom);
        const data = analyzeCollectionData(collection, totalTiles);
        // console.log(data);
        analysis[zoom] = {
            ...collection,
            ...data,
            totalTiles,
        }      
    })

    return analysis;
}

const getAllJobsFromCollections = (collections) => {
    let mergedCollection = [];

    Object.keys(collections).map((key) => {
        collections[key].map((zoom) => {
            mergedCollection.push(...zoom.jobs);
        });
    });
    return mergedCollection;
}

const calculateTotalTiles = () => {
    let totalTiles = 0;
    for (var i = 0; i <= 15; i++) {
        totalTiles += Math.pow(2, i) * Math.pow(2, i);
    }
    return totalTiles;
}

const processOverallStats = (collections) => {
    const jobs = getAllJobsFromCollections(collections);
    const totalTiles = calculateTotalTiles();
    return {
        jobs,
        ...analyzeCollectionData({ jobs }, totalTiles),
        totalTiles,
    }
}

/**
 * Analyze overall data given collection of jobs
 * @param  Jobs[Array] collection Array of jobs with progress_data available
 * @param  integer totalTiles # of total tiles the collection should have processed
 */
const analyzeCollectionData = (collection, totalTiles) => {
    let result = {};

    result.processed = collection.jobs.reduce((acc, progress_data) => {
        return acc + parseInt(progress_data.processed);
    }, 0);
    result.itemsPerSec = collection.jobs.reduce((acc, progress_data) => {
        return acc + parseInt(progress_data.itemsPerSec);
    }, 0) / collection.jobs.length;
    result.tilegenok = collection.jobs.reduce((acc, progress_data) => {
        return acc + parseInt(progress_data.tilegenok);
    }, 0);
    result.tilenodata = collection.jobs.reduce((acc, progress_data) => {
        return acc + parseInt(progress_data.tilenodata);
    }, 0);
    result.processedRate = (result.processed / totalTiles) * 100 + '%';
    result.missing = totalTiles - result.processed;
    result.missing = result.missing >= 0 ? result.missing : 0;
    result.okTilesRate = (result.tilegenok / result.processed) * 100 + '%';

    return result;
};

module.exports = {
    processData,
    processOverallStats,
}