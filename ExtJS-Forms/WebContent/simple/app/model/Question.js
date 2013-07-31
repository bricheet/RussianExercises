Ext.define('AM.model.Question', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.reader.Json'
    ],

    // TODO replace email with text of the quiz
    fields: ['id', 'name', 'before', 'correctAnswer', 'after', 'userAnswerFirstTry', 'userAnswerSecondTry', 'correctAnswer', 'correctCase', 'caseUserAnswerFirstTry', 'caseUserAnswerSecondTry']
}); 