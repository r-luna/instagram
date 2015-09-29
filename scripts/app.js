angular.module('insta', [])
.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
})
.controller('MyController', function($scope, $http, $sce) {
	
    $scope.searchCriteria = 'cat';
    $scope.results = {
        currentIndex:0,
        pageObjects: []
    };
    $scope.error = null;

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.searchInstagram = function(url,isPrev) {
        var cid = '63d551fcdc4f487c8c51ce690a2fe923';
        var ndx = ndx || 0;
        var url = url || 'https://api.instagram.com/v1/tags/' + $scope.searchCriteria + '/media/recent?client_id=' + cid + '&callback=JSON_CALLBACK';
        
        if (url.indexOf('angular.callbacks') !== -1){
            url = url.replace(/angular\.callbacks\._[0-9]+/,'JSON_CALLBACK');
        }
        
        $http.jsonp(url)
        .success(function(response) {
            if (!isPrev){
                $scope.results.pageObjects.push(response);
            }
        })
        .error(function(err){
            $scope.error = err;   
        });
    };

    $scope.previousPage = function(){
        var len = $scope.results.pageObjects.length -1;
        var pgn = $scope.results.pageObjects[len].pagination.next_url || null;
        var min = $scope.results.pageObjects[len].pagination.min_tag_id;
        $scope.results.pageObjects.pop();
        if (!min){
            return;
        }
        pgn = pgn.replace(/(?![max_tag_id\=])[0-9]+$/,min);
        $scope.searchInstagram(pgn,true);
    };

    $scope.nextPage = function(){
        var pgn = $scope.results.pageObjects[$scope.results.pageObjects.length-1].pagination.next_url || null;
        if (!pgn){
            return;
        }
        $scope.searchInstagram(pgn,false);
    };
    
});