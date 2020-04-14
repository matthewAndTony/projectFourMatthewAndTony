const stockApp = {};
stockApp.apiKey = `I57N7ZBNDACAALUE`;


stockApp.getTicker = function(ticker){
    ticker.preventDefault();
    console.log($(this).text().toUpperCase());
};
$('.tickerSearch').on('select', getTicker(ticker));

// stockApp.getInterval();
// stockApp.getTimeSeries();

stockApp.init = function(ticker,interval,timeSeries,fromCurrency,){
    $.ajax({
        url:`https://www.alphavantage.co/query`,
        method:`GET`,
        dataType:`json`,
        data:{
            interval: interval,
            function: `TIME_SERIES_${timeSeries.toUpperCase()}`,
            symbol: ticker.toUpperCase(),
            apikey: stockApp.apiKey,
            from_currency:fromCurrency
        }
    }).then(function(results){
        // createWatchlist();
        // updateNews();
        // console.log(results);
    })
}

$(function(){
    stockApp.init(`tsla`,`1min`, `intraday`)
})