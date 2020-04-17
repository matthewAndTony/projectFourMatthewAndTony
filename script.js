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

// Search Endpoint Suggestions --- CREATE DIV/LI BELOW forEACH result?
$('.tickerSearchButton').on('click', function () {
    $('.tickerSearchResults').empty();
    console.log('testing')
    const searchItem = $('#searchTickerInput').val();
    stockApp.searchEndpoint(searchItem);
})
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
    }).then(function (results) {
        // console.log(results);
        const bestMatches = results.bestMatches;
        console.log(bestMatches[0])
        bestMatches.forEach(function (item) {
            console.log(item['1. symbol'], item['2. name'], item['4. region'], item['8. currency'])

            $('.tickerSearchResults').append(`
            <li class="searchResults" id="${item['1. symbol']}">
                <p class="resultTicker">${item['1. symbol']}</p>
                <p class="resultName">${item['2. name']}</p>
                <p class="resultRegion">${item['4. region']}</p>
                <p class="resultCurrency">${item['8. currency']}</p>
            </li>`)
        })
        
        
    })
}

// Access information for Ticker
$('.tickerSearchResults').on('click', '.searchResults', function () {
    console.log('does it work')
    const ticker = $(this).attr('id')
    console.log(ticker)

    stockApp.searchStock(ticker,'5min', 'intraday')
    
    
})
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
        const timeSeriesData = results[`Time Series (${interval})`];
        console.log(timeSeriesData);
        
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
    // stockApp.searchEndpoint('brookfield');
    // stockApp.searchStock('msft','1min','intraday');
    // stockApp.forEX('CAD','USD')
    // stockApp.techIndicate('tsla', '1min', 60, 'open');
})