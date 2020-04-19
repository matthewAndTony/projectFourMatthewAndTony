const newsApp = {};
newsApp.apiKey = `f9648353dfc841bb861714d68d34c9c2`;

const stockApp = {};
stockApp.apiKey = `I57N7ZBNDACAALUE`;

const addedToWatchList = {};
const watchListSearchItems = [];


// End Point API Search - When the user submits or clicks the submit button, it will the search suggestions back to the user.
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
        const bestMatches = results.bestMatches;
        bestMatches.forEach(function (item) {
            $('.tickerSearchResults').append(`
            <li class="searchResults" id="${item['1. symbol']}">
                <p class="resultTicker">${item['1. symbol']}</p>
                <p class="resultName">${item['2. name']}</p>
                <p class="resultRegion">${item['4. region']}</p>
                <p class="resultCurrency">${item['8. currency']}</p>
                <p>Click to add to Watchlist!</p>
            </li>`)
        })
    })
}

//Ticker Information API - When the user selects which ticker they would like to add by clicking, the ticker's information will be displayed in an LI under the watchlist.

stockApp.searchStock = function(ticker,timeSeries, stock, currency){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            function: `TIME_SERIES_${timeSeries.toUpperCase()}`,
            symbol: ticker.toUpperCase(),
            apikey: stockApp.apiKey,
        }
    }).then(function(results){
        const lastRefresh = results['Meta Data']["3. Last Refreshed"];
    
        const todaysResults = results[`Time Series (Daily)`][lastRefresh]        
        
        const todaysOpen = todaysResults['1. open']; //Get Open Price
        const todaysClose = todaysResults['4. close']; //Get Closing Price
        const todaysChanges = todaysOpen - todaysClose; //Get Change in Dollars
        const todaysChangesPercent = (todaysOpen - todaysClose)/todaysOpen; //Get Change in Percent
        const todaysVolume = todaysResults['5. volume']; //Get Volume        



        watchListSearchItems.push(stock, ticker)//Create an array of items to search 
        watchListSearchItems.forEach(function(item){ //News Api Search for Each item in the Array
            newsApp.init(item);
        })

        
        
        addedToWatchList[ticker] = {
            Symbol: ticker,
            Name: stock,
            Currency: currency,
            Open : todaysOpen,
            Close: todaysClose,
            Changes: todaysChanges,
            ChangePercentage: todaysChangesPercent,
            Volume: todaysVolume
        }

        $('.watchList').empty();
        
        for (let item in addedToWatchList) {
            const currentObject = addedToWatchList[item];
            for (let key in currentObject){
                if (currentObject[key] != undefined)
                $('.watchList').append(
                    `<li>${key}: ${currentObject[key]}</li>`
                )
            }
        }


    })
}

//Access Stock News API - 
newsApp.init = function (query) {
    $.ajax({
        url: `https://newsapi.org/v2/everything`,
        method: `GET`,
        dataType: `json`,
        data: {
            apiKey: newsApp.apiKey,
            q: query,
            sortBy: 'relevancy',
            pageSize: 3,
        }
    }).then(function (results) {
        results.articles.forEach(function (item) {
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

// Search Endpoint Suggestions --- CREATE DIV/LI BELOW forEACH result?
$('.tickerSearchButton').on('click', function () {
    $('.tickerSearchResults').empty();
    
    const searchItem = $('#searchTickerInput').val();

    $('.articleSection').empty();//Empty your articles

    stockApp.searchEndpoint(searchItem);
})
// So you can submit the answer instead of clicking the submit button
$('#searchTickerInput').on('keypress', function (e) {
    if(e.which == 13) {
        $('.tickerSearchResults').empty();
        
        const searchItem = $('#searchTickerInput').val();
        
        $('.articleSection').empty();//Empty your articles
        
        stockApp.searchEndpoint(searchItem);
    }
    
})

// Access information for Ticker
$('.tickerSearchResults').on('click', '.searchResults', function () {
    const ticker = $(this).attr('id')
    const stock = $(this).children('.resultName').text();
    const currency = $(this).children('.resultCurrency').text();

    $(`.tickerSearchResults`).empty()

    stockApp.searchStock(ticker, 'daily', stock, currency);
});