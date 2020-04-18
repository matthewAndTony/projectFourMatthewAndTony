const stockNews = {};
const savedWatchList = {};
stockNews.apiKey = `f9648353dfc841bb861714d68d34c9c2`;
stockNews.init = function (query) {
    $('.articleSection').empty();
    $.ajax({
        url: `https://newsapi.org/v2/everything`,
        method: `GET`,
        dataType: `json`,
        data: {
            apiKey: stockNews.apiKey,
            q: query,
            sortBy: 'relevancy',
            pageSize: 9,
        }
    }).then(function (results) {
        console.log(results);
        results.articles.forEach(function (item) {
            console.log(item.title)
            $('.articleSection').append(
                `<a href="${item.url}">
                <article>
                <div class="imageContainer articleImage"><img src=${item.urlToImage}></div>
                <h2 class="articleTitle">${item.title}</h2>
                <p class="articleAuthor">${item.author}</p>
                <p class="articleContent">${item.description}</p>
                </article>
                </a>`
            )
            
        })
    });
};
$(function () {
    stockNews.init('stocks')
});

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
    stockApp.searchStock()
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
    const ticker = $(this).attr('id')
    const stock = $(this).children('.resultName').text();
    const currency = $(this).children('.resultCurrency').text();

    console.log(ticker)
    console.log(stock)

    $(`.tickerSearchResults`).empty()
    stockApp.searchStock(ticker, '5min', 'daily', stock, currency);
    stockNews.init(savedWatchList[0])
    });
    

stockApp.searchStock = function(ticker,interval,timeSeries,stock, currency){
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
        const todaysChanges = todaysOpen - todaysClose; //Get Change in Dollars
        const todaysChangesPercent = (todaysOpen - todaysClose)/todaysOpen; //Get Change in Percent
        const todaysVolume = todaysResults['5. volume']; //Get Volume        
        savedWatchList[ticker] = [ticker, stock, currency, todaysOpen, todaysClose, todaysChanges, todaysChangesPercent, todaysVolume];
        $('.watchList').append(
            `<li>Stock Symbol ${ticker}</li>
            <li>Stock Name ${stock}</li>
            <li>Stock Currency ${currency}</li>
            <li>Stock Open ${todaysOpen}</li>
            <li>Stock Close ${todaysClose}</li>
            <li>Today's Changes ${todaysChanges}</li>
            <li>Today's Changes in % ${todaysChangesPercent}</li>
            <li>Today's Volume ${todaysVolume}</li>`
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


// Pseudo Code for Project Four


// on page load display default state
    // run api call to news api, get 5 articles (default values on start NYSE, TSX and NASDAQ)
    // attach event listener to form (search bar)
        // on submit get search input value (search button onClick) // on submit empty stock search result <ul>
            // make 2 API calls
                // to stock API using search value (search endpoints results )
                    // append to a <ul> which will have 5 stocks that are the results of search endpoint above
                    // event listener for click on the <li> generates a <div> underneath the search section
                    // creating a button (favorites/add to watch list)
                        // on click we will put the stock information into an array and that array will be used to generate our watch list
                    // 
                    // append a div with stock information
                    // append a div with more data on the stock 
                // to news API using search value (results from above search into news API)
                // empty default articles
                // append to a <ul> which will have 5 articles that are the results of the search above (see wire frames for reference)

    // searching for new stock 
        // click enter
        // on submit empty ul which contains previous search results ends the previously selected stocks and search the api for the new request

    // newsApi
    // we go through the watch list array and search the news api with company name (i.e. apple inc.) and stock ticker (i.e. aapl)
    // with the results we will empty out the old articles and generate new articles 