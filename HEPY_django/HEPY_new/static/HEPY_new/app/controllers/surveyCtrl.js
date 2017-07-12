(function () {
    "use strict";

    angular.module("HEPY").controller('SurveyCtrl', ["$scope", "HepyService", function (sc, hepyService) {

		sc.displayNr = -1; 		// Index of currently displayed question in carousel
		sc.actualDisplayNumber = 1;	// Displayed question number shown to user (how many questions did the user see, ignores hidden questions)
		sc.alertLevel = -1;		// Controls which alert message to display at the end of survey
		sc.moveOn = false;		// If false, "next" button will be greyed out
		sc.userConsent = false;	// Tells us if user consented to send his answers for research - by default user consent must be set to false
		sc.resultText = [];

        sc.questionnaire = 0;
        sc.questions = new Array();
        sc.consentQuestion = {};
        
        sc.questionnaireLoaded = false;
        sc.questionsLoaded = false;
        sc.answersLoaded = false;
        sc.commentsLoaded = false;
        sc.disablesLoaded = false;
        sc.answerWeightsLoaded = false;

        sc.tempQuestions = new Array();
        sc.tempAnswers = new Array();
        sc.tempComments = new Array();
        sc.tempDisables = new Array();
        sc.tempAnswerWeights = new Array();
        sc.linked = false;
        
        var linkRunner = setInterval(function(){linkSurveyData()}, 1000);
        
		function update_comment_visibility()
		{
			var bork = false;
			for(var i = 0; i < sc.questions[sc.displayNr].comments.length; i++)
			{
				sc.questions[sc.displayNr].comments[i].displayed = false;
				bork = false;
				for(var j = 0; j < sc.questions[sc.displayNr].comments[i].answersThatEnable.length; j++)
				{
					var rqa = sc.questions[sc.displayNr].comments[i].relatedQAs[j];
					for(var k = 0; k < sc.questions[rqa].answers.length; k++)
					{
						if(sc.questions[rqa].answers[k].pk == sc.questions[sc.displayNr].comments[i].answersThatEnable[j])
						{
							if(sc.questions[rqa].answers[k].selected == true)
							{
								sc.questions[sc.displayNr].comments[i].displayed = true;
								bork = true;
                            	break;
                            }
                        }
					}
					if(bork)
						break;
				}
			}
		}

		// Function is called when radio button selection changes
		sc.change = function(pk){
			sc.moveOn = true;	// Enable "next" button

			// When radio button selection changes, reset selected variable of other answers in the question
			for(var i = 0; i < sc.questions[sc.displayNr].answers.length; i++)
			{
                if (pk == sc.questions[sc.displayNr].answers[i].pk)
                    sc.questions[sc.displayNr].answers[i].selected = true;
                else
                    sc.questions[sc.displayNr].answers[i].selected = false;
            }
            update_comment_visibility();
		};

		sc.changeCheckbox = function(){
			update_comment_visibility();
		};

		// Called when returning to previous question
		sc.back = function()
		{
			// Make current question inactive (hide on front-end)
			sc.questions[sc.displayNr].active = false;

			// if not on first question
			if(sc.displayNr > 0)
			{
				// itterate thorugh hidden (ninja) questions in reverse until we find one that is not hidden
				do
				{
					if(sc.questions[sc.displayNr].ninja)  // if question is hidden reset it's ninja flag to default
						sc.questions[sc.displayNr].ninja = false;
					sc.displayNr--;
				}while(sc.questions[sc.displayNr].ninja);
				sc.actualDisplayNumber--; // decrease number displayed to user by 1
            }

            // Activate question that was not hidden
			sc.questions[sc.displayNr].active = true;
			sc.moveOn = true; // enable "next" button, since anwsers were already chosen on this question
		};

		// Called after the last (non-hidden) question is answered
		function end()
		{
			var green = 0;
			var yellow = 0;
			var red = 0;
			var pinky = 0;
			var alertlevel = 1;
			var risk_type = false;
			var vacinated_for_A_B = false;
			var pack = {answeredWith: new Array()};		// list of selected answers
			
			var vac_skip = false;
			var risk_skip = false;
			// Count weight values for answered questions
			sc.questions.forEach(function(question)
			{
				if(!question.ninja)
				{
                    question.comments.forEach(function (comment)
					{
                        if (comment.displayed == true)
                        	sc.resultText.push(comment.short_text);
					});
                }
				question.answers.forEach(function(answer)
                {
                	// if answer was selected, add it to pack
                	if(answer.selected && (answer.pk != sc.consentQuestion.consentConfirmPK || answer.pk != sc.consentQuestion.consentRefusePK))
						pack["answeredWith"].push(answer.pk);

                	if(answer.selected && answer.weights.length != 0)
					{
						if(!risk_skip || !vac_skip)
						{
							answer.weights.forEach(function (weight)
							{
								if (weight.length != 0)
								{
									if (!risk_skip && weight.type == "risk")
									{
										risk_type = true;
										risk_skip = true;
									}
									if (!vac_skip && weight.type == "not_a_b")
									{
										if (weight.value = 1.0)
										{
											vacinated_for_A_B = false;
											vac_skip = true;
										}
										else
											vacinated_for_A_B = true;
									}
								}
							});
						}
                    }
				});
			});

			//if(!risk_type && vacinated_for_A_B)
				

			// Set alert level variable that controls alert display
			sc.alertLevel = alertlevel;
			sc.alertLevel = 1;
			/*
			ZELENA, vsi odgovori zeleni, ali do vključno trije rumeni
			RUMENA, če so zeleni in vsaj štirje rumeni; če sta 1 ali 2 roza in ostali zeleni/rumeni
			RDEČA, vsaj 1 rdeč; ali če 3 roza
			 */

			// Check through all answers on consent question
			for(var i = 0; i < sc.consentQuestion.answers.length; i++)
			{
				// If selected answer matched consent confirm answer ID, then the user consented
				if(sc.consentQuestion.answers[i].pk == sc.consentQuestion.consentConfirmPK)
					if(sc.consentQuestion.answers[i].selected)
						sc.userConsent = true;
			}

			// If user did not consent, drop all data in pack (do not send) and exit
			if(sc.userConsent == false)
			{
                pack = null;
                return;
            }

            // If user did consent, send data and exit
			if(sc.userConsent == true)
				hepyService.sendData(pack);

			return;
		}

		// Called when procceding to next question
		sc.next = function()
		{
			// Make current question inactive (hide on front-end)
			sc.questions[sc.displayNr].active = false;

			var skip; // do we skip the question?

			do
			{
				skip = false; // reset variable

				// Go the the next question if any, otherwise procced to the results
				if(sc.displayNr < sc.questions.length - 1)
					sc.displayNr++;
				else
					end();

				// Following nested for-loop is not n^3, but more like n*m*o, where:
				//  n = number of disables that apply to the question
				//  m = number of required answers that disable has
				//  o = number of answers on question that has at least one of required answers
				// Usually n*m*o ends up around 8-10

				// Check through possible disables for current question
				for(var i = 0; i < sc.questions[sc.displayNr].disables.length && !skip; i++)
				{
					// Check through answers required for these disables to apply
					for(var j = 0; j < sc.questions[sc.displayNr].disables[i].requiredAnswers.length && !skip; j++)
					{
						var relatedQID = sc.questions[sc.displayNr].disables[i].relatedQAs[j]; // question index of required answer

						// Check through all answers on question that has at least one required answer
						for(var k = 0; k < sc.questions[relatedQID].answers.length; k++)
						{
							// If the answer in required answer
							if(sc.questions[relatedQID].answers[k].pk == sc.questions[sc.displayNr].disables[i].requiredAnswers[j])
							{
								// and if required answer is also selected
								if(sc.questions[relatedQID].answers[k].selected)
								{
									// then skip current question
									sc.questions[sc.displayNr].ninja = true;
                                    skip = true;
                                    break;
                                }
							}
						}
					}
				}
			}while(skip); // continue looping through questions until we find one that is not disabled

			sc.questions[sc.displayNr].active = true; // show question to the user
			sc.moveOn = false; // disable "next" button (until user answers)

			// if the question already has an answer selected or if this is a multiple-selection question
			// then re-enable "next" button
			for(var i = 0; i < sc.questions[sc.displayNr].answers.length; i++)
			{
				if(sc.questions[sc.displayNr].answers[i].selected == true || sc.questions[sc.displayNr].type == "checkbox")
				{
                    sc.moveOn = true;
                    break;
                }
			}

			// Increase displayed number by 1
			sc.actualDisplayNumber++;
		};

        hepyService.getQuestionnaire().then(function (questionnaire)
        {
            // We get all the data from the database about our questionnaire and save it in scope
            sc.questionnaire = questionnaire[0];
            sc.questionnaireLoaded = true;
            linkSurveyData();
        });
        
        hepyService.getQuestions().then(function (questions)
        {
            sc.tempQuestions = questions;
            sc.questionsLoaded = true;
            linkSurveyData();
        });
        
        hepyService.getAnswers().then(function (answers)
        {
            sc.tempAnswers = answers;
            sc.answersLoaded = true;
            linkSurveyData();
        });
        
        hepyService.getComments().then(function (comments)
		{
			sc.tempComments = comments;
			sc.commentsLoaded = true;
			linkSurveyData();
		});
        
        hepyService.getDisables().then(function (disables)
        {
            sc.tempDisables = disables;
            sc.disablesLoaded = true;
            linkSurveyData();
        });
        
        hepyService.getAnswerWeights().then(function (disables)
        {
            sc.tempAnswerWeights = disables;
            sc.answerWeightsLoaded = true;
            linkSurveyData();
        });

		// Service calls this function after it gets questions from the database
		function linkSurveyData()
		{
            if(sc.linked)
                return;
            if(!sc.questionnaireLoaded || !sc.questionsLoaded || !sc.answersLoaded || 
                !sc.disablesLoaded || !sc.answerWeightsLoaded ||!sc.commentsLoaded)
                return;
            
            sc.linked = true;
            clearInterval(linkRunner);


			// Add aditional parameters to questions
			for(var i = 0; i < sc.tempQuestions.length; i++)
			{
				// Add property 'active' to indicate which question is displayed
                sc.tempQuestions[i].tid = i;
				sc.tempQuestions[i].active = false;// Required for Bootstrap UI Carousel
				sc.tempQuestions[i].answers = [];	// array filled by getAnswers
				sc.tempQuestions[i].comments = []; // array filled by getComments
				sc.tempQuestions[i].disables = []; // array filled by getDisables
				sc.tempQuestions[i].ninja = false; // ninja == disabled == hidden (ninja is not reserved in JS ^^)
				// if question is ninja, then do not send it's answer in a result
			}

			sc.displayNr = 0; // Tells us which question is active
            sc.questions = new Array(); // Prepare scope variable for question storage

            // Only keep questions from selected questionnaire (select questionnaire in *service.js
            for(var i = 0; i < sc.tempQuestions.length; i++)
            {
                if(sc.tempQuestions[i].questionnaire == sc.questionnaire.pk)
                    sc.questions.push(sc.tempQuestions[i]);
            }

            // Create consent question on scope for quick access later
			sc.consentQuestion = {};
            sc.consentQuestion.tid = sc.questions.length;
            sc.consentQuestion.pk = -1;
            sc.consentQuestion.questionnaire = sc.questionnaire.pk;
            sc.consentQuestion.text = sc.questionnaire.consentQuestionText;
            sc.consentQuestion.order = sc.questionnaire.consentShowOrder;
            sc.consentQuestion.type = "radio";
            sc.consentQuestion.active = false;
            sc.consentQuestion.answers = [];
            sc.consentQuestion.disables = [];
            sc.consentQuestion.comments = [];
            sc.consentQuestion.ninja = false;

            // -1 private key is accept, -2 is refuse
            sc.consentQuestion.answers.push({pk: -1, question: -1, text: sc.questionnaire.consentAcceptText, order: 1, weights: []});
            sc.consentQuestion.answers.push({pk: -2, question: -1, text: sc.questionnaire.consentRefuseText, order: 2, weights: []});
            sc.consentQuestion.consentConfirmPK = -1;
            sc.consentQuestion.consentRefusePK = -1;

            // Add consent question to question set, just before ordering
            sc.questions.push(sc.consentQuestion);

			sc.questions.sort(function (a, b)
			{
				return a.order - b.order;
			});

			// Mark first one as active
			sc.questions[0].active = true;
		
		// Service calls this function after it gets answers from the database
		
			// Go through all the data we get
			for(var i = 0; i < sc.tempAnswers.length; i++)
			{
				sc.tempAnswers[i].selected = false; // did user select this question
				sc.tempAnswers[i].weights = -1;		 // answer weights (or in our case alert level)

				for(var j = 0; j < sc.questions.length; j++)
				{
					// Add answer to the correspoinding question
					if(sc.questions[j].pk == sc.tempAnswers[i].question)
                        sc.questions[j].answers.push(sc.tempAnswers[i]);
				}
			}

			// Sort answers on each question in ascending order
			for(var i = 0; i < sc.questions.length; i++)
			{
				sc.questions[i].answers.sort(function(a, b)
				{
					return a.order - b.order;
				});
			}
		

		// Service calls this function after it gets comments from the database
		
			// Go through all the data we get
			for(var i = 0; i < sc.tempComments.length; i++)
			{
				sc.tempComments[i].displayed = false;
				sc.tempComments[i].relatedQAs = new Array();
				// Sort answersThatEnable in ascending order
				sc.tempComments[i].answersThatEnable.sort(function (a, b)
				{
					return a.answersThatEnable - b.answersThatEnable;
				});

				// Find corresponding question IDs
				// Check through answers that enable current comment
				for(var j = 0; j < sc.tempComments[i].answersThatEnable.length; j++)
				{
					// Check thorugh every possible questions
					for(var k = 0; k < sc.questions.length; k++)
					{
						// If answer we seek is in this question
						for(var l = 0; l < sc.questions[k].answers.length; l++)
						{
                            if (sc.questions[k].answers[l].pk == sc.tempComments[i].answersThatEnable[j])
                                sc.tempComments[i].relatedQAs.push(k); // Add question id to related
                        }
					}
				}

				// Attach comment to question it belongs to
				for(var j = 0; j < sc.questions.length; j++)
				{
					// Add comment to the correspoinding question
					if(sc.questions[j].pk == sc.tempComments[i].question)
                        sc.questions[j].comments.push(sc.tempComments[i]);
				}
            }
		
		// Service calls this function after it gets disables from the database
		
			// Go through all the data we get
			for(var i = 0; i < sc.tempDisables.length; i++)
			{
				// Sort requiredAnswers in ascending order
				sc.tempDisables[i].requiredAnswers.sort(function (a, b)
				{
					return a.requiredAnswers - b.requiredAnswers;
				});

				// Array of question IDs (array index)
				// It tells us on which question each requiredAnswers is attached to (for faster runtime look-up)
				sc.tempDisables[i].relatedQAs = [];

				// Find corresponding question IDs
				// Check through required answers on current disable
				for(var j = 0; j < sc.tempDisables[i].requiredAnswers.length; j++)
				{
					// Check thorugh every possible questions
					for(var k = 0; k < sc.questions.length; k++)
					{
						// If answer we seek is in this question
						for(var l = 0; l < sc.questions[k].answers.length; l++)
						{
                            if (sc.questions[k].answers[l].pk == sc.tempDisables[i].requiredAnswers[j])
                                sc.tempDisables[i].relatedQAs.push(k); // Add question id to related
                        }
					}
				}

				// Attach this disable to every question it can disable
				for(var j = 0; j < sc.questions.length; j++)
				{
					// Add disable to the correspoinding question
					if(sc.questions[j].pk == sc.tempDisables[i].question)
						sc.questions[j].disables.push(sc.tempDisables[i]);
				}
            }
		

		// Service calls this function after it gets weights from the database
		
			// Check through every question
			for(var j = 0; j < sc.questions.length; j++)
			{
				// Check through every answer on this question
				for(var k = 0; k < sc.questions[j].answers.length; k++)
				{
					sc.questions[j].answers[k].weights = new Array();

					// Check through all the answer weights we got
					for(var i = 0; i < sc.tempAnswerWeights.length; i++)
					{
						// If current weight belongs to current answer
						if(sc.questions[j].answers[k].pk == sc.tempAnswerWeights[i].answer)
							sc.questions[j].answers[k].weights.push(sc.tempAnswerWeights[i]); // add weight value to the answer
					}
				}
			}

            sc.tempQuestions = null;
            sc.tempAnswers = null;
            sc.tempComments = null;
            sc.tempDisables = null;
            sc.tempAnswerWeights = null;
		}
	}]);
})();