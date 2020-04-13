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
    stockNews.init('aapl')
});