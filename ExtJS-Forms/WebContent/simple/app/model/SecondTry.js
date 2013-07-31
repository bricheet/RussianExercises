Ext.define('AM.model.SecondTry', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.reader.Json'
    ],

    // TODO replace email with text of the quiz
    fields: ['option']
}); 