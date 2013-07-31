Ext.define('AM.view.quiz.ComboBox', {
	extend : 'Ext.window.Window',
	alias : 'widget.quizcombobox',

	requires : [ 'Ext.form.Panel' ],
	id: 'comboboxWindow',
	title: 'Question 1',
	layout : 'fit',
	autoShow : true,
	width : 550, 
	height: 110,


	initComponent : function() {
		this.items = [ {
			xtype : 'label',
			text: '',
			id : 'questionResultCombo',
			readOnly: true
		},{
			xtype : 'form',
			padding : '5 5 0 5',
			border : false,
			style : 'background-color: #fff;',
			layout : 'column',
			id : 'combo',
			html:'<br\>',


			items : [ {
				xtype : 'label',
				name : 'before',
				id : 'beforeLabel1',
				readOnly: true
			}, {
				xtype : 'combobox',
				name : 'userAnswer',
				id : 'combobox',
				displayField : 'option',
				valueField : 'option'
			}, {
				xtype: 'label',
				name: 'correctAnswerDisplay',
				id: 'correctAnswerDisplay',
				text:''
			},{
				xtype : 'label',
				name : 'after',
				id : 'afterLabel1',
				readOnly: true
			},{
				xtype : 'label',
				id : 'caseLabelCombobox',
				text: 'Case: ',
				readOnly: true
			},  {
				xtype : 'combobox',
				name : 'userAnswerCaseCombobox',
				id : 'userAnswerCaseCombobox',
				displayField: 'cases',
				valueField: 'cases'
			}, {
				xtype: 'label',
				name: 'correctCaseDisplay',
				id:'correctCaseDisplay',
				text:''
			}]
		} ];

		this.buttons = [ {
			text : 'Check',
			action : 'checkCombo',
			id : 'checkComboButton'
		} ];

		this.callParent(arguments);
	}
});
