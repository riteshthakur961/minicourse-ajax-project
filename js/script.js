function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + "," + cityStr;
    $greeting.text('so, you would like to live in ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location= ' + address + '';
    $body.append('<img class="bgimg" src="'+streetviewUrl+'">');

    // YOUR CODE GOES HERE!
    // load nytimes
    // obviously, replace all the "X"s with your own API key
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=0d74b498b34b48e78cf8d0776de8ffb7';
    $.getJSON(nytimesUrl, function(data){
        //console.log(data);
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        }

    //As of jQuery 1.8, .error() is deprecated. Use .fail() instead.
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // load wikipedia data
    //https://www.mediawiki.org/wiki/API:Main_page#The_endpoint
    //https://www.mediawiki.org/wiki/API:Cross-site_requests
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    // There is no error handling in JSON-P , hence Using a Timeout can help us work aound a solution for handling errors
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    //http://api.jquery.com/jquery.ajax/
    //http://json-jsonp-tutorial.craic.com/index.html
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",

        //as of jquery 1.8 the use of success as a callback is deprecated, use .done(function(){//.....}) instead
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            //Since there is no need for a timeout , when the AJAX request has been responded by the server
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);