(function () {
	"use strict";

	angular.module("HEPY").factory("HepyService", ["$http", "$q",
	function ($http, $q) {
	    var that = this;
	    $http.defaults.xsrfCookieName = 'csrftoken';
		$http.defaults.xsrfHeaderName = 'X-CSRFToken';
		
	    var baseUrl = "/HEPY/rest/";	// Deploy
		//var baseUrl = "http://127.0.0.1:8000/HEPY/rest/";		// Dev


		function getQuestionnaire() {
			var req = $http.get(baseUrl + "questionnaireHEPY/?format=json");

			return req.then(_handleSuccess, _handleError);
		}

		function getQuestions() {
	        var req = $http.get(baseUrl + "questionsHEPY/?format=json");

	        return req.then(_handleSuccess, _handleError);
	    }

	    function getAnswers() {
			var req = $http.get(baseUrl + "answersHEPY/?format=json");

			return req.then(_handleSuccess, _handleError);
		}

		function getComments() {
			var req = $http.get(baseUrl + "commentsHEPY/?format=json");

			return req.then(_handleSuccess, _handleError);
		}

		function getDisables() {
			var req = $http.get(baseUrl + "disablesHEPY/?format=json");

			return req.then(_handleSuccess, _handleError);
		}

		function getAnswerWeights() {
			var req = $http.get(baseUrl + "answerWeightsHEPY/?format=json");

			return req.then(_handleSuccess, _handleError);
		}
		
		function sendData(answeredQuestions) {
			//$http.post(baseUrl + "send-data.php", answeredQuestions);
			$http.post(baseUrl + "sendAnswersHEPY/", answeredQuestions);
		}

	    // Return API
	    return ({
			getQuestionnaire: getQuestionnaire,
	        getQuestions: getQuestions,
			getAnswers: getAnswers,
			getComments: getComments,
			getDisables: getDisables,
			getAnswerWeights: getAnswerWeights,
			sendData: sendData
	    });

	    // Private Methods
	    function _handleError(response) {
	        if (!angular.isObject(response.data) || !response.data.message) {
	            return $q.reject("Unknown error occured!");
	        }

	        return $q.reject(response.data.message);
	    }

	    function _handleSuccess(response) {
	        return response.data;
	    }
	}]);
})();
