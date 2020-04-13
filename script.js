const stockApp = {};
let apiKey = `I57N7ZBNDACAALUE`;

stockApp.init = function(ticker,interval,timeSeries){
    $.ajax({
        url:`https://www.alphavantage.co/`,
        method:`GET`,
        dataType:`json`,
        data:{
            apiKey: apiKey,
            timeSeries: `function=${timeSeries}`,
            symbol: ticker,
            interval: `TIME_SERIES_${interval.toUpperCase()}`
        }
    }).then(function(results){
        console.log(results);
    })
}

$(function(){
    stockApp.init(`aapl`,`1 min`, `intraday`)
})