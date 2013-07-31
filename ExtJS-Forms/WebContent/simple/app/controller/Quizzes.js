// To do: 
// When the user gets the dropdown results incorrect as well, tell them that when they start on the next question
// Verify everything to make sure it's working (flow) - debug
// Add more quizzes
// Clean up/comment code

Ext.define('AM.controller.Quizzes', {
    extend: 'Ext.app.Controller',

    stores: [
        'Quizzes@AM.store'
    ],

    models: [
        'Quiz@AM.model',
        'Question@AM.model',
        'SecondTry@AM.model'
    ],

    views: [
        'Edit@AM.view.quiz',
        'ComboBox@AM.view.quiz',
        'List@AM.view.quiz'
    ],

    refs: [
        {
            ref: 'quizzesPanel',
            selector: 'panel'
        }
    ],

    init: function() {
        this.control({
            'viewport > quizlist': {
                itemclick: this.startQuiz
            },
            'quizedit button[action=check]': {
                click: this.updateQuiz
            },
            'quizcombobox button[action=checkCombo]': {
                click: this.updateQuizSecondTry
            },
            'resultsWindow button[action=endQuiz]':{
            	click: this.endQuiz
            }
        });
    },
    endQuiz: function(){
    	Ext.getCmp('quizWindow').destroy();
    	Ext.getCmp('questionWindow').destroy();
    	Ext.getCmp('comboboxWindow').destroy();
    },
    // Start quiz when user chooses an item from the main grid.
    startQuiz: function(grid, record) { 
    	// Create an instance of the fill-in-the-blank form and show it.
        var edit = Ext.create('AM.view.quiz.Edit').show();
        //Ext.getCmp('questionWindow').addListener('close', this.endQuiz());
        // Load record into the form.
        edit.down('form').loadRecord(record);
        // Set the before and after parts of the question in the form.
        var questions = record.get('questions');
        
        Ext.getCmp('beforeLabel').setText('1. ' + questions[0].before);
        Ext.getCmp('afterLabel').setText(questions[0].after);
        var comboDropDown = Ext.getCmp('userAnswerCase');
        comboDropDown.bindStore(this.createCaseStore(record));
    },
	// Set labels for fill-in-the-blank form to the next question
    setLabelsToNextQuestion: function(questions, questionNum, resultString, component){
    	var questionNumToDisplay = questionNum + 1;
    	// Print the question number followed by the before and after parts of the question
    	Ext.getCmp('beforeLabel').setText(questions[questionNum].before);
        Ext.getCmp('afterLabel').setText(questions[questionNum].after);
        // Clear the previous user answer
        Ext.getCmp('userAnswer').reset();
        Ext.getCmp('userAnswerCase').reset();
    	Ext.getCmp('questionWindow').setTitle('Question ' + questionNumToDisplay);
        component.setText(resultString);
    },
    // User has gotten the question right; increase count of questions gotten
    // correct on the first try
    processCorrectAnswer: function(questions, questionNum, record){
    	// Update record with number of questions gotten correct
        var correctAnswersFirstTry = record.get('correctAnswersFirstTry');
        record.set('correctAnswersFirstTry',correctAnswersFirstTry + 1);
        record.set("correctCaseAnswersFirstTry", record.get("correctCaseAnswersFirstTry")+1);
    },
    // Create a temporary store to hold the second options for the given question.
    createSecondOptionsStore: function(questions, questionNum){
    	// Get the array of second options from the main store
    	var options = questions[questionNum-1].secondTry;
    	// Load the array of second options into the temporary ArrayStore
    	var secondOptionsStore = new Ext.data.ArrayStore({
    		data : options,
    		fields : ['option']
    	});
    	
    	return secondOptionsStore;
    },
    // User has gotten the question wrong; present user with dropdown menu of second options.
    processIncorrectAnswer: function(win, questionNum, questions, record, resultText){
    	// Hide the fill-in-the-blank window
    	win.hide();
    	// Create store with data for combobox
		var secondOptionsStore = this.createSecondOptionsStore(questions, questionNum);
		
		// If combobox itself hasn't been created, create it
    	if(Ext.getCmp('combo') == null){
            Ext.create('AM.view.quiz.ComboBox');
    	}
    	// Find the combobox component and bind to the store
        var comboDropDown = Ext.getCmp('combobox');
        comboDropDown.bindStore(secondOptionsStore);
        var  comboCaseDropDown = Ext.getCmp('userAnswerCaseCombobox');
        comboCaseDropDown.bindStore(this.createCaseStore(record));
    	if (Ext.getCmp('questionResult').name == 'userAnswerIncorrectCaseCorrect'){
    		Ext.getCmp('userAnswerCaseCombobox').hide();
        	Ext.getCmp('correctCaseDisplay').setText('   ' + questions[questionNum-1].correctCase);
        	Ext.getCmp('correctCaseDisplay').show();
    	} else if (Ext.getCmp('questionResult').name == 'userAnswerCorrectCaseIncorrect'){
           	Ext.getCmp('combobox').hide();
           	Ext.getCmp('correctAnswerDisplay').setText(questions[questionNum-1].correctAnswer + ' ');
           	Ext.getCmp('correctAnswerDisplay').show();
    	}
        // Set combobox labels to the correct question
    	var comboboxWin = Ext.getCmp('checkComboButton').up('window');
		Ext.getCmp('beforeLabel1').setText(questions[questionNum-1].before);
    	Ext.getCmp('afterLabel1').setText(questions[questionNum-1].after);
    	Ext.getCmp('comboboxWindow').setTitle('Question ' + questionNum);
        Ext.getCmp('combobox').reset();
        Ext.getCmp('userAnswerCaseCombobox').reset();
        Ext.getCmp('questionResultCombo').setText(resultText);
    	
    	// Show combobox if hidden
    	comboboxWin.show();
    },
    createResultsStore: function(questionInfo){
        var resultsStore = new Ext.data.ArrayStore({
    		fields : ['correctAnswer', 'userAnswerFirstTry', 'userAnswerSecondTry', 'correctCase', 'caseUserAnswerFirstTry', 'caseUserAnswerSecondTry']
    	});
        var questions = questionInfo.get('questions');
        for(var i = 0; i < questions.length; i++){
    		var firstTryString = "NONE";
    		var firstTryCaseString = "NONE";
    		var secondTryString = "NONE";
    		var secondTryCaseString = "NONE";
    		var correctAnswerString = questions[i].before + 
    		questions[i].correctAnswer.bold() + " " + 
    		questions[i].after;
    		var correctCaseAnswerString = questions[i].correctCase.bold();
        	if (questions[i].userAnswerFirstTry != "None" && questions[i].userAnswerFirstTry != null){
        		firstTryString = questions[i].before + 
				questions[i].userAnswerFirstTry.bold() + " " + 
				questions[i].after.substr(0,questions[i].after.indexOf("("));
        		firstTryString = firstTryString.fontcolor("red");
        	} 
        	if (questions[i].userAnswerSecondTry !="None" && questions[i].userAnswerSecondTry != null){
        		secondTryString = questions[i].before + 
    			questions[i].userAnswerSecondTry.bold() + " " + 
    			questions[i].after.substr(0,questions[i].after.indexOf("("));
            	secondTryString = secondTryString.fontcolor("red");
        	} 
        	
        	if (questions[i].caseUserAnswerFirstTry !="None" && questions[i].caseUserAnswerFirstTry != null){
        		firstTryCaseString = questions[i].caseUserAnswerFirstTry.bold();
        		firstTryCaseString = firstTryCaseString.fontcolor("red");
        	}
        	if (questions[i].caseUserAnswerSecondTry != "None"&& questions[i].caseUserAnswerSecondTry != null){
        		secondTryCaseString = questions[i].caseUserAnswerSecondTry.bold();
        		secondTryCaseString = secondTryCaseString.fontcolor("red");
        	}
        	var resultsRecord = {};
        	if(questions[i].userAnswerFirstTry == questions[i].correctAnswer){
        		resultsRecord["correctAnswer"]=correctAnswerString;
        		resultsRecord["userAnswerFirstTry"]= "Correct!".fontcolor("green");
        		resultsRecord["userAnswerSecondTry"]="------";
        	} else if (questions[i].userAnswerSecondTry == questions[i].correctAnswer){
        		resultsRecord["correctAnswer"]=correctAnswerString;
        		resultsRecord["userAnswerFirstTry"]=firstTryString;
        		resultsRecord["userAnswerSecondTry"]="Correct!".fontcolor("green");
        		
        	} else {
        		resultsRecord["correctAnswer"]=correctAnswerString;
        		resultsRecord["userAnswerFirstTry"]=firstTryString;
        		resultsRecord["userAnswerSecondTry"]=secondTryString;
        	}
        	
        	if(questions[i].caseUserAnswerFirstTry == questions[i].correctCase){
        		resultsRecord["correctCase"]=correctCaseAnswerString;
        		resultsRecord["caseUserAnswerFirstTry"]="Correct!".fontcolor("green");
        		resultsRecord["caseUserAnswerSecondTry"]="------";
        	} else if (questions[i].caseUserAnswerSecondTry == questions[i].correctCase){
        		resultsRecord["correctCase"]=correctCaseAnswerString;
        		resultsRecord["caseUserAnswerFirstTry"]=firstTryCaseString;
        		resultsRecord["caseUserAnswerSecondTry"]="Correct!".fontcolor("green");
        		
        	} else {
        		resultsRecord["correctCase"]=correctCaseAnswerString;
        		resultsRecord["caseUserAnswerFirstTry"]=firstTryCaseString;
        		resultsRecord["caseUserAnswerSecondTry"]=secondTryCaseString;
        	}
        	resultsStore.add([resultsRecord]);
        }
        return resultsStore;
    },
    // No more questions; display results
    processEndOfQuestions: function(questionInfo){ 
    	var resultsString = 'You got everything right on the first try!';
    	var resultsStringPart2 = "";
    	// If not all questions were gotten correct on the first try,
    	// display corresponding message
        if(questionInfo.get('correctAnswersFirstTry') < questionInfo.get('questions').length || questionInfo.get('correctCaseAnswersFirstTry') < questionInfo.get('questions').length){
        	resultsString = 'Correct endings on the first try: ' + questionInfo.get('correctAnswersFirstTry');
        	resultsStringPart2 = 'Correct endings on the second try: ' + questionInfo.get('correctAnswersSecondTry');
        	resultsStringPart3 = 'Correct case on the first try: ' + questionInfo.get('correctCaseAnswersFirstTry');
        	resultsStringPart4 = 'Correct case on the second try: ' + questionInfo.get('correctCaseAnswersSecondTry');
        } 
        // Hide unnecessary components of form
        Ext.getCmp('afterLabel').setText('');
        Ext.getCmp('userAnswer').hide();
        Ext.getCmp('checkButton').setText('View results');
        var resultsStore = this.createResultsStore(questionInfo);
        Ext.create('Ext.window.Window', {
            //title: resultsString,
            alias: 'widget.resultsWindow',
            height: 480,
            width: 1200,  
            listeners:{'close':this.endQuiz},
            items:[new Ext.grid.Panel({
            	itemId: 'results', 
            	id: 'results',
            	store: resultsStore, 
                columns: [
                          { text: 'Correct Answer',  dataIndex: 'correctAnswer', width: 200 },
                          { text: 'Your Answer First Try', dataIndex: 'userAnswerFirstTry' , width: 200},
                          { text: 'Your Answer Second Try', dataIndex: 'userAnswerSecondTry' , width: 200},
                          { text: 'Correct Case',  dataIndex: 'correctCase', width: 200 },
                          { text: 'Your Case Answer First Try', dataIndex: 'caseUserAnswerFirstTry' , width: 200},
                          { text: 'Your Case Answer Second Try', dataIndex: 'caseUserAnswerSecondTry' , width: 200}
                ]}), {
            	xtype: 'label',
            	text: resultsString,
            	readOnly: true
            }, {
            	html: '<br \>' + resultsStringPart2,
            	xtype: 'label',
            	//text: resultsStringPart2,
            	readOnly: true
            }, 
            {
            	html: '<br \>' + resultsStringPart3,
            	xtype: 'label',
            	//text: resultsStringPart2,
            	readOnly: true
            }, {
            	html: '<br \>' + resultsStringPart4,
            	xtype: 'label',
            	//text: resultsStringPart2,
            	readOnly: true
            }]
        }).show();    
    },
    createCaseStore: function(record){
    	// Get the array of second options from the main store
    	var options = record.get("cases");
    	// Load the array of second options into the temporary ArrayStore
    	var caseStore = new Ext.data.ArrayStore({
    		data : options,
    		fields : ['cases']
    	});
    	
    	return caseStore;
    },
    // User has clicked button to verify answer; 
    // process user's answer
    verifyQuestion: function(button){
    	// Get the record/values from the button
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();
        win.show();
        var userAnswer = values.userAnswer;
        var userAnswerCase = values.userAnswerCase;
        var questions = record.get('questions');
        var questionNum = record.get('currentQuestion');
        
        // Determine the correct answer to this question
        var correctAnswer = questions[questionNum-1].correctAnswer;
        var correctCase = questions[questionNum - 1].correctCase;
        if (userAnswer != "") {
        	questions[questionNum-1].userAnswerFirstTry = userAnswer;
        } else {
        	questions[questionNum-1].userAnswerFirstTry = 'None';
        }
        
        if (userAnswerCase != ""){
        	questions[questionNum-1].caseUserAnswerFirstTry = userAnswerCase;
        } else {
        	questions[questionNum-1].caseUserAnswerFirstTry = "None";
        }

        // If the user got the question right
        if (userAnswer == correctAnswer && userAnswerCase == correctCase){
            this.processCorrectAnswer(questions, questionNum, record);
            // If this is not the last question
            if (questionNum < questions.length){
            	this.moveToNextQuestion(questionNum, questions, record, "Correct!", Ext.getCmp('questionResult'));
            } else {
            	win.hide();
            	this.processEndOfQuestions(record);
            }
        } else if (userAnswer != correctAnswer && userAnswerCase == correctCase){
        	Ext.getCmp('questionResult').name = 'userAnswerIncorrectCaseCorrect';
        	record.set("correctCaseAnswersFirstTry", record.get("correctCaseAnswersFirstTry") + 1);
        	this.processIncorrectAnswer(win, questionNum, questions, record, "Correct case, wrong ending. Try again!");
        } else if (userAnswer == correctAnswer && userAnswerCase != correctCase){
        	Ext.getCmp('questionResult').name = 'userAnswerCorrectCaseIncorrect';
        	record.set("correctAnswersFirstTry", record.get("correctAnswersFirstTry") + 1);
        	this.processIncorrectAnswer(win, questionNum, questions, record, "Correct ending, wrong case. Try again!");
        } else {
        	Ext.getCmp('questionResult').name = 'userAnswerIncorrectCaseIncorrect';
        	this.processIncorrectAnswer(win, questionNum, questions, record, "Both the ending and the case are incorrect. Try again!");
        }
    },
    // 
    moveToNextQuestion: function(questionNum, questions, record, resultString, component){
    	// Set the labels to the ones for next question
    	this.setLabelsToNextQuestion(questions, questionNum, resultString, component);
        // Set the quiz's currentQuestion status to the next question
        record.set('currentQuestion',questionNum+1);
    	
    },
    verifyQuestionSecondTry: function(button){
    	var button2 = Ext.getCmp('checkButton');
    	var win2 = button2.up('window');
    	var form2 = win2.down('form');
    	var record2 = form2.getRecord();
    	var questionNum = record2.get('currentQuestion');
    	var questions = record2.get('questions');
    	var correctAnswer =  "";
    	var userAnswer = "";
    	var resultString = "";
    	if(Ext.getCmp('questionResult').name == 'userAnswerIncorrectCaseCorrect' || Ext.getCmp('questionResult').name == 'userAnswerIncorrectCaseIncorrect'){
    		correctAnswer = questions[questionNum-1].correctAnswer;
    		userAnswer = Ext.getCmp('combobox').getValue();
    		if (userAnswer != null) {
        		questions[questionNum-1].userAnswerSecondTry = userAnswer;
        	} else {
        		questions[questionNum-1].userAnswerSecondTry = 'None';
        	}
        	if (correctAnswer == userAnswer){
        		var correctAnswersSecondTry = record2.get('correctAnswersSecondTry');
        		record2.set('correctAnswersSecondTry', correctAnswersSecondTry + 1);
        		resultString = "Correct!";
        	} else {
        		resultString += "Wrong ending.";
        	}
    	}
    	if(Ext.getCmp('questionResult').name == 'userAnswerCorrectCaseIncorrect' || Ext.getCmp('questionResult').name == 'userAnswerIncorrectCaseIncorrect'){
    		correctAnswer = questions[questionNum-1].correctCase;
    		userAnswer = Ext.getCmp('userAnswerCaseCombobox').getValue();
    		if (userAnswer != null) {
        		questions[questionNum-1].caseUserAnswerSecondTry = userAnswer;
        	} else {
        		questions[questionNum-1].caseUserAnswerSecondTry = 'None';
        	}
        	if (correctAnswer == userAnswer){
        		var correctCaseAnswersSecondTry = record2.get('correctCaseAnswersSecondTry');
        		record2.set('correctCaseAnswersSecondTry', correctCaseAnswersSecondTry + 1);
        		resultString = "Correct!";
        	} else {
        		resultString += "Wrong case.";
        	}
    	}
    	resultString += " Here's the next question:";
    	var comboboxWin = Ext.getCmp('checkComboButton').up('window');
    	comboboxWin.hide();
    	Ext.getCmp('correctCaseDisplay').hide();
    	Ext.getCmp('userAnswerCaseCombobox').show();
    	Ext.getCmp('correctAnswerDisplay').hide();
    	Ext.getCmp('combobox').show();
        if (questionNum < questions.length){
        	this.moveToNextQuestion(questionNum, questions, record2, resultString, Ext.getCmp('questionResult'));
        	win2.show();
        } else {
        	this.processEndOfQuestions(record2);
        }
    	Ext.getCmp('questionResult').name = '';
    },
    updateQuiz: function(button) {
    	this.verifyQuestion(button);
    },
    updateQuizSecondTry: function(button) {
    	this.verifyQuestionSecondTry(button);
    }
});
