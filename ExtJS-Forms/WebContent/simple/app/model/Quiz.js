Ext.define('AM.model.Quiz', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.reader.Json'
    ],

    // TODO replace email with text of the quiz
    fields: ['id', 'name', 'currentQuestion','questions', 'correctAnswersSecondTry', 'correctAnswersFirstTry', 'cases', 'correctCaseAnswersFirstTry', 'correctCaseAnswersSecondTry'],
    hasMany:[{name:'questions',
    		model:'Question@AM.model'}, {name:'secondTry', model: 'SecondTry@AM.model'}]
}); 