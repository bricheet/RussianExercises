Ext.define('AM.view.quiz.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.quizlist',

    title : 'All Quizzes',
    store: 'Quizzes',

    columns: [
        {header: 'Quiz Name',  dataIndex: 'name',  flex: 1}    ]
});
