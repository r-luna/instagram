angular.module('insta', [])
.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
})
.controller('MyController', function($scope, $http, $sce) {
	
    $scope.searchCriteria = 'cat';
    $scope.pageObjects = [];
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
                $scope.pageObjects.push(response);
            }
        })
        .error(function(err){
            $scope.error = err;   
        });
    };

    $scope.previousPage = function(){
        if ($scope.pageObjects.length === 1){
            return;
        }
        var len = $scope.pageObjects.length -1;
        var pgn = $scope.pageObjects[len].pagination.next_url || null;
        var min = $scope.pageObjects[len].pagination.min_tag_id;
        $scope.pageObjects.pop();
        if (!min){
            return;
        }
        pgn = pgn.replace(/(?![max_tag_id\=])[0-9]+$/,min);
        $scope.searchInstagram(pgn,true);
    };

    $scope.nextPage = function(){
        var pgn = $scope.pageObjects[$scope.pageObjects.length-1].pagination.next_url || null;
        if (!pgn){
            return;
        }
        $scope.searchInstagram(pgn,false);
    };
    
});