Ext.define('AM.view.quiz.Edit', {
	extend : 'Ext.window.Window',
	alias : 'widget.quizedit',

	requires : [ 'Ext.form.Panel' ],

	title : 'Question 1',
	id: 'questionWindow',
	layout : 'fit',
	autoShow : true,
	width : 550, 
	height: 110,

	initComponent : function() {
		this.items = [ {
			xtype : 'label',
			text: '',
			id : 'questionResult',
			readOnly: true, 
			name:'',

		},{
			xtype : 'form',
			padding : '5 5 0 5',
			border : false,
			style : 'background-color: #fff;',
			layout : 'column',
			itemCls : 'keyboardInput',
			id: 'quizWindow',
			html:'<br\>',

			items : [ {
				xtype : 'label',
				name : 'before',
				id : 'beforeLabel',
				readOnly: true
			}, {
				itemCls : 'keyboardInput',
				xtype : 'textfield',
				name : 'userAnswer',
				id : 'userAnswer',
				//http://jsfiddle.net/g5VN8/1/
				listeners : {
					afterrender: function(cmp){
						VKI_attach(cmp.inputEl.dom);
					}
				}
			}, {
				xtype : 'label',
				name : 'after',
				id : 'afterLabel',
				readOnly: true
			} ,{
				xtype : 'label',
				id : 'caseLabel',
				text: 'Case: ',
				readOnly: true
			},  {
				xtype : 'combobox',
				name : 'userAnswerCase',
				id : 'userAnswerCase',
				displayField: 'cases',
				valueField: 'cases'
			} ],
			
		}
		];

		this.buttons = [ {
			text : 'Check',
			action : 'check', 
			id : 'checkButton'
		} ];

		this.callParent(arguments);
	}
});
