
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

    // YOUR CODE GOES HERE!

    // fetch street and city values and append an image link to the body
    var street = $('#street').val();
    var city = $('#city').val();

    $greeting.text('So you want to live at ' + street + ', ' + city);
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x600&location=' + street + ',' + city + '">');

    $nytHeaderElem.text('Articles about ' + city);
    //NY Times AJAX request
    $.getJSON('https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=c33d5d3fcc73437bbaa52fc3159f21fa&sort=newest&q=' + city, function (data){
    //  console.log(data); to see if anything loads
    //for of loop to iterate through the array of articles and print out a header and snippet from the article
      for (var doc of data.response.docs) {
        var headline = doc.headline.print_headline;
        var url = doc.web_url;
        var intro = doc.snippet;
        $nytElem.append('<li><a href="' + url + '"> <h3>' + headline + '</h3></a><p>' + intro + '</p></li>' );
      }
    }).error(function(){$nytElem.text('Articles could not be loaded')});

    // wikipedia timeout error handling
    var wikiRequestTimeout = setTimeout(function(){$wikiElem.text("failed to get wikipedia resources");}, 8000);
    // calling Wikipedia articles
    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + city,
      dataType: "jsonp",
      success: function(search){
          for ( i = 0; i < search[1].length; i++ ){
            var title = search[1][i];
            var intro = search[2][i];
            var link = search[3][i];
            $wikiElem.append('<li><a href="' + link + '"><h3>' + title + '</h3></a><p>' + intro + '</p></li>');
          };
          clearTimeout(wikiRequestTimeout);
      }
    })

    return false;
};

$('#form-container').submit(loadData);
