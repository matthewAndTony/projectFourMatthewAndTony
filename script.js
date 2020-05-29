const newsApp = {};
newsApp.apiKey = `f9648353dfc841bb861714d68d34c9c2`;
const stockApp = {};
stockApp.apiKey = `I57N7ZBNDACAALUE`;
const addedToWatchList = {};

// End Point API Search - When the user submits or clicks the submit button, it will the search suggestions back to the user.
stockApp.searchEndpoint = function (search) {
    $.ajax({
        url: `https://www.alphavantage.co/query`,
        method: `GET`,
        dataType: `json`,
        data: {
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
                <p>CLICK TO ADD TO WATCHLIST</p>
            </li>`)
        })
    })
}
//Ticker Information API - When the user selects which ticker they would like to add by clicking, the ticker's information will be displayed in an LI under the watchlist.
stockApp.searchStock = function (ticker, timeSeries, stock, currency) {
    $.ajax({
        url: `https://www.alphavantage.co/query`,
        method: `GET`,
        dataType: `json`,
        data: {
            function: `TIME_SERIES_${timeSeries.toUpperCase()}`,
            symbol: ticker.toUpperCase(),
            apikey: stockApp.apiKey,
        }
    }).then(function (results) {
        const lastRefresh = results['Meta Data']["3. Last Refreshed"];
        const todaysResults = results[`Time Series (Daily)`][lastRefresh]
        const todaysOpen = todaysResults['1. open']; //Get Open Price
        const todaysClose = todaysResults['4. close']; //Get Closing Price
        const todaysChanges = todaysOpen - todaysClose; //Get Change in Dollars
        const todaysChangesPercent = (todaysOpen - todaysClose) / todaysOpen; //Get Change in Percent
        const todaysVolume = todaysResults['5. volume']; //Get Volume

        
        const monthData = results[`Time Series (Daily)`]


        
        //////////////////////////////////////////////////
        $('.articleSection').empty()
        addedToWatchList[ticker] = {
            Symbol: ticker,
            Name: stock,
            Currency: currency,
            Open: todaysOpen,
            Close: todaysClose,
            Changes: todaysChanges,
            ChangePercentage: todaysChangesPercent,
            Volume: todaysVolume
        }
        //
        addedToWatchList[ticker][`monthDataArray`] = [] 
        addedToWatchList[ticker][`closePriceArray`] = []
        for (let key in monthData) {
            addedToWatchList[ticker][`monthDataArray`].push(key)
            addedToWatchList[ticker][`closePriceArray`].push(monthData[key]["4. close"])
        }       
        //
        $('.watchList').empty();
        for (let item in addedToWatchList) {
            const currentObject = addedToWatchList[item];

            //////////////
            if (addedToWatchList[item]!= undefined){
            $('.watchList').append(`<ul class="${item}List stockWatchItem"></ul>`);//Creating Stock UL for Watchlist
            for (let key in currentObject) {
                if (currentObject[key] != undefined && currentObject[key]!= addedToWatchList[item][`monthDataArray`] && currentObject[key]!= addedToWatchList[item][`closePriceArray`] )
                    $(`.${currentObject.Symbol}List`).append(`<li class="${currentObject,key}">${key}:<span> ${currentObject[key]}</span></li>`)
            }
            //////////////
            
            /////////////
            $(`.${item}List`).append(`<canvas id="${item}Chart"></canvas>`);//Creating Graph on DOM
            stockApp.createGraph(currentObject.monthDataArray, currentObject.closePriceArray, item)//Creating Graph JS /CALLING FUNCTION
            $('.chartjs-render-monitor').css({'height':'500px'})
            /////////////


            // $(`.${item}List`).append(`<button class="unsubscribe">Remove from Watchlist</button>`);//Create remove from watchlist button

            newsApp.init(item);//Gets the news for the watch list items
            }

        }
    })
}
//Access Stock News API - 
newsApp.init = function (query) {
    $.ajax({
        url: `https://proxy.hackeryou.com`,
        dataType: `json`,
        method: `GET`,
        data: {
            reqUrl: `https://newsapi.org/v2/everything`,
            params: {
                apiKey: newsApp.apiKey,
                q: query,
                sortBy: 'relevancy',
                pageSize: 6,
            }
        }
    }).then(function (results) {
        results.articles.forEach(function (item) {
            $('.articleSection').append(
                `<a href="${item.url}">
                <article>
                <div class="imageContainer articleImage"><img src=${item.urlToImage}></div>
                <div class="articleContentContainer">
                <h2 class="articleTitle">${item.title}</h2>
                <p class="articleAuthor">${item.author}</p>
                <p class="articleContent">${item.description}</p>
                </div>
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
    $('#searchTickerInput').val("");
})
// So you can submit the answer instead of clicking the submit button
$('#searchTickerInput').on('keypress', function (e) {
    if (e.which == 13) {
        $('.tickerSearchResults').empty();
        const searchItem = $('#searchTickerInput').val();
        $('.articleSection').empty();//Empty your articles
        stockApp.searchEndpoint(searchItem);
        $('#searchTickerInput').val("");
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



// Document ready
$(function () {
    newsApp.init('nasdaq, nyse, tsx');
})

//Function that creates a graph when given Y Array and X Array
stockApp.createGraph = function(x, y, ticker){
    // chart.js stuff
    let ctx = $(`#${ticker}Chart`);
    
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x.reverse(),
            datasets: [{
                label: 'Closing Price',
                data: y.reverse(),
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}
