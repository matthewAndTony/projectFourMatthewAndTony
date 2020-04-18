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
    const ticker = $(this).attr('id');
    const stock = $(this).children('.resultName').text();
    console.log(ticker);
    console.log(stock);
    

    $(`.tickerSearchResults`).empty()
    stockApp.searchStock(ticker,'5min', 'daily');
    
})
stockApp.searchStock = function(ticker,interval,timeSeries){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            // interval: interval,
            function: `TIME_SERIES_${timeSeries.toUpperCase()}`,
            symbol: ticker.toUpperCase(),
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        const lastRefresh = results['Meta Data']["3. Last Refreshed"];
    
        const todaysResults = results[`Time Series (Daily)`][lastRefresh]
        console.log(results);
        
        console.log(todaysResults);
        
        const todaysOpen = todaysResults['1. open']; //Get Open Price
        const todaysClose = todaysResults['4. close']; //Get Closing Price
        const todaysChanges = todaysOpen - todaysClose; //Get Change in Dolars
        const todaysChangesPercent = (todaysOpen - todaysClose)/todaysOpen; //Get Change in Percent
        const todaysVolume = todaysResults['5. volume']; //Get Volume        
        
        $('.watchList').append(
            `<li>Stock Symbol${ticker}</li>
            <li>Stock Name</li>
            <li>Stock Currency</li>
            <li>Stock Open</li>
            <li>Stock Close</li>
            <li>Today's Changes</li>
            <li>Today's Changes in %</li>
            <li>Today's Volume </li>`
        )
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