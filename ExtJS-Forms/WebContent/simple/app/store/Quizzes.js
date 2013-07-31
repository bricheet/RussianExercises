Ext.define('AM.store.Quizzes', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Quiz',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/quizzes.json',
            update: 'data/updateQuizzes.json'
        },
        reader: {
            type: 'json',
            root: 'quizzes',
            successProperty: 'success'
        },
        listeners: {
            'load' :  function(store,records,options) {
                console.log(records);
            }
        }
    }
}); 