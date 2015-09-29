angular.module('insta', [])
.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
})
.controller('MyController', function($scope, $http, $sce) {
	
    $scope.searchCriteria = '';
    $scope.results = null;
    $scope.error = null;

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.searchInstagram = function(keyword) {
        var cid = '63d551fcdc4f487c8c51ce690a2fe923';
        var url = 'https://api.instagram.com/v1/tags/' + $scope.searchCriteria + '/media/recent?client_id=' + cid + '&callback=JSON_CALLBACK';

        $http.jsonp(url)
        .success(function(response) {
            $scope.results = response;
        })
        .error(function(err){
            $scope.error = err;   
        });
    };

});