angular.module('insta', ['ngAnimate'])
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
    $scope.infoText = null;
    $scope.headers = null;
    
    function setCurrentPage(){
        $scope.currentPage = $scope.pageObjects[$scope.ndx];
    }
    
    function setInfo(){
        var totalImages = 0;
        var objs = $scope.pageObjects;
        for (var i=0;i<objs.length;i++){
            totalImages = totalImages + objs[i].data.length;
        }
        $scope.infoText = 'You are on page ' + ($scope.ndx + 1 ) + ' of ' + objs.length + ' pages consisting of ' + totalImages + ' cached images.';
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
        var url = url || 'https://api.instagram.com/v1/tags/' + encodeURIComponent($scope.searchCriteria) + '/media/recent?client_id=' + cid + '&count=30&callback=JSON_CALLBACK';
        
        if (url.indexOf('angular.callbacks') !== -1){
            url = url.replace(/angular\.callbacks\._[0-9]+/,'JSON_CALLBACK');
        }
        
        $http.jsonp(url)
        .then(function(response){
            if (!isPrev){
                if (response.data.data.length !== 0){
                    $scope.pageObjects.push(response.data);
                    $scope.ndx =  $scope.pageObjects.length -1;
                    $scope.error = null;
                    setInfo();
                    setCurrentPage();
                } else {
                    $scope.searchCriteria = null;
                    $scope.infoText = null;
                    $scope.theForm.$setPristine();
                    $scope.error = 'Nothing was found. Try different search criteria.';   
                }
            }
        },function(data){
            if (data.status === 404){
                resetData();
                $scope.searchCriteria = null;
                $scope.infoText = null;
                $scope.error = 'Instagram returned 404.... try searching again....';
                $scope.theForm.$setPristine();
            } else if (data.status === 503){
                resetData();
                $scope.searchCriteria = null;
                $scope.infoText = null;
                $scope.error = 'Instagram returned 503 (server unavailable).... you\'re searching too quickly!';
                $scope.theForm.$setPristine();
            } else {
                console.log(data);   
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
        $scope.infoText = 'Searching Instagram for photos tagged with "' + $scope.searchCriteria + '".';
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
        setInfo();
    };

    $scope.nextPage = function(){
        var pgn = $scope.pageObjects[$scope.ndx].pagination.next_url || null;
        if (!pgn){
            return;
        }
        if ($scope.ndx === $scope.pageObjects.length -1){
            $scope.infoText = 'Loading...';
            searchInstagram(pgn,false);
        } else {
            $scope.ndx++;
            setNextBtnValue();
            setCurrentPage();
            setInfo();
        }
    };
    

    
});