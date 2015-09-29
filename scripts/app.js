angular.module('insta', [])
.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
})
.controller('MyController', function($scope, $http) {
	$scope.ndx = 0; // current index being viewed within the cached responses
    $scope.searchCriteria = null;
    $scope.pageObjects = []; // cache api responses here
    $scope.error = null; // if error in api call
    $scope.currentPage = null;
    $scope.nextBtnVal = 'Load more...';
    
    
    function setCurrentPage(){
        $scope.currentPage = $scope.pageObjects[$scope.ndx];
    }
    
    function setNextBtnValue(){
        if ($scope.ndx === $scope.pageObjects.length -1){
            $scope.nextBtnVal = 'Load more...';
        } else {
            $scope.nextBtnVal = 'Next';
        }
    }
    
    function searchInstagram(url,isPrev) {
        var cid = '63d551fcdc4f487c8c51ce690a2fe923';
        var url = url || 'https://api.instagram.com/v1/tags/' + $scope.searchCriteria + '/media/recent?client_id=' + cid + '&callback=JSON_CALLBACK';
        
        if (url.indexOf('angular.callbacks') !== -1){
            url = url.replace(/angular\.callbacks\._[0-9]+/,'JSON_CALLBACK');
        }
        
        $http.jsonp(url)
        .success(function(response, status, headers, config) {
            if (!isPrev){
                if (response.data.length !== 0){
                    $scope.pageObjects.push(response);
                    $scope.ndx =  $scope.pageObjects.length -1;
                    setCurrentPage();
                } else {
                    $scope.searchCriteria = null;
                    $scope.theForm.$setPristine();
                    $scope.error = 'Nothing was found. Try different search criteria.';   
                }
            }
        })
        .error(function(data,status,headers,config){
            if (status === 404){
                resetData();
                $scope.error = 'Instagram didn\'t like your search string. Try not to use special characters';
                $scope.theForm.$setPristine();
            }
        });
    }
    
    function resetData(){
        $scope.pageObjects = [];
        $scope.currentPage = null;
    }
    
    $scope.submitForm = function(){
        $scope.error = null;
        if (!$scope.searchCriteria){
            return;   
        }
        resetData();
        searchInstagram();
    };

    $scope.previousPage = function(){
        if ($scope.pageObjects.length === 1 || $scope.ndx === 0){
            return;
        }
        $scope.ndx--;
        setNextBtnValue();
        setCurrentPage();
    };

    $scope.nextPage = function(){
        var pgn = $scope.pageObjects[$scope.ndx].pagination.next_url || null;
        if (!pgn){
            return;
        }
        if ($scope.ndx === $scope.pageObjects.length -1){
            searchInstagram(pgn,false);
        } else {
            $scope.ndx++;
            setNextBtnValue();
            setCurrentPage();
        }
    };
    
    $scope.returnLength = function(){
        var currentPage = 0;
        var totalImages = 0;
        var objs = $scope.pageObjects;
        for (var i=0;i<objs.length;i++){
            totalImages = totalImages + objs[i].data.length;
        }
        return 'You are on page ' + ($scope.ndx + 1 ) + ' of ' + objs.length + ' pages consisting of ' + totalImages + ' cached images.';
    };
    
});