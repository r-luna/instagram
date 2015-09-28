angular.module('insta', [])
.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
})
.controller('MyController', function($scope, $http, $sce) {
	
    $scope.searchCriteria = '';

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.searchYouTube = function(keyword) {

        $scope.keyword = keyword;

        var url = 'https://api.instagram.com/v1/tags/';
        var request = {
            callback: 'JSON_CALLBACK',
            client_id: '63d551fcdc4f487c8c51ce690a2fe923'
        };

        $http({
            method: 'GET',
            url:  + '/media/recent',
            params: request
        })
        .then(function(response) {
            $scope.results = response.data.items;
        },
        function(response) {
            alert('error');
        });
    };

});