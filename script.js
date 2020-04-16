const stockApp = {};
stockApp.apiKey = `I57N7ZBNDACAALUE`;
const apiCall =
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
})
// console.log(apiCall);
apiCall.data={
    function: `SYMBOL_SEARCH`,
    keywords: 'bam',
    apikey: stockApp.apiKey
}
console.log(apiCall.data)

// Search Endpoint Suggestions --- CREATE DIV/LI BELOW forEACH result?
stockApp.searchEndpoint = function(search){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            function: `SYMBOL_SEARCH`,
            keywords: search,
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        console.log(results);
    })
}

// Access information for Ticker
stockApp.searchStock = function(ticker,interval,timeSeries){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            interval: interval,
            function: `TIME_SERIES_${timeSeries.toUpperCase()}`,
            symbol: ticker.toUpperCase(),
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        // console.log(results);
    })
}

// FORREX
stockApp.forEX = function(from,to){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            function: `CURRENCY_EXCHANGE_RATE`,
            from_currency: from.toUpperCase(),
            to_currency: to.toUpperCase(),
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        console.log(results);
    })
}

// Technical Indicators
stockApp.techIndicate = function(symbol, interval, timePeriod, seriesType){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            function: `SMA`,
            symbol:symbol,
            interval: interval,
            time_period:timePeriod,
            series_type: seriesType,
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        console.log(results);
    })
}

$(function(){
    stockApp.searchEndpoint('brookfield');
    // stockApp.searchStock('msft','1min','intraday');
    // stockApp.forEX('CAD','USD')
    // stockApp.techIndicate('tsla', '1min', 60, 'open');
})