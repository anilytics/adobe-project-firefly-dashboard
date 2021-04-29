function differenceAsPercent(previous, recent) {
    return Number((recent - previous) / previous * 100).toFixed(2);
}
/*
    Data transformation logic: Temp way
    Ideally create a schema and tranform data! 
*/
const createTableFromRawData = (gaLastYear, aaLastWeek) => {
   const metricsNameLookup = ['Visitors', 'Visits', 'Orders', 'Rev/Visitor', 'Revenue', 'AOV'];
    let dashFormat = [];
    try {
        aaLastWeek.forEach(function (item, index) {
            
            const isDollarMetric = /(Rev\/Visitor|Revenue|AOV)/i.test(metricsNameLookup[index]);
            let metState = differenceAsPercent(parseInt(gaLastYear[index]),aaLastWeek[index])
            
            let metric = {
                metricName: metricsNameLookup[index],
                metricValue: Number(aaLastWeek[index]),
                metricChange: Number(metState),
                metricStatus: metState < 0 ? 'down' : 'up',
                metricPrefix: isDollarMetric ? '$' : ''
            }
            
            dashFormat.push(metric);
            
        });
        return dashFormat;
    } catch (error) {
        throw new Error("data transformation error " + error);
    }
};

module.exports = {
    createTableFromRawData,
}