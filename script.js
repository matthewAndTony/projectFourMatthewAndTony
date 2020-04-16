const stockNews = {};
stockNews.apiKey = `f9648353dfc841bb861714d68d34c9c2`;
stockNews.init = function (query) {
    $.ajax({
        url: `https://newsapi.org/v2/everything`,
        method: `GET`,
        dataType: `json`,
        data: {
            apiKey: stockNews.apiKey,
            q: query,
            sortBy: 'relevancy',
        }
    }).then(function (results) {
        console.log(results);
    });
};

$(function () {
    stockNews.init('stocks')
});



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
            


