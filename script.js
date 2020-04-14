const stockApp = {};
stockApp.apiKey = `I57N7ZBNDACAALUE`;


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
        // console.log(results);
    })
}


$(function(){
    stockApp.init(`tsla`,`1min`, `intraday`)
    stockApp.search('goo');
})