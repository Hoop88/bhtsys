/**
 * Thanks: http://extjs.com/forum/showthread.php?t=20662
 */
Ext.ux.MaximizeTool = function() {
	this.init = function(ct) {
		var maximizeTool = {
			id : 'maximize',
			handler : handleMaximize,
			scope : ct,
			qtip : '扩大'
		};
		ct.tools = ct.tools || [];
		var newTools = ct.tools.slice();
		ct.tools = newTools;
		for (var i = 0, len = ct.tools.length;i < len; i++) {
			if (ct.tools[i].id == 'maximize')
				return;
		}
		ct.tools[ct.tools.length] = maximizeTool;
	};

	function handleMaximize(event, toolEl, panel) {
		panel.originalOwnerCt = panel.ownerCt;
		panel.originalPosition = panel.ownerCt.items.indexOf(panel);
		panel.originalSize = panel.getSize();

		if (!toolEl.window) {
			var defaultConfig = {
				id : (panel.getId() + '-MAX'),
				width : (Ext.getBody().getSize().width - 100),
				height : (Ext.getBody().getSize().height - 100),
				title:'扩大窗口',
				resizable : false,
				draggable : false,
				closable : true,
				closeAction : 'hide',
				hideBorders : true,
				plain : true,
				modal:true,
				layout : 'fit',
				autoScroll : false,
				border : false,
				bodyBorder : false,
				frame : true,
				pinned : true,
				bodyStyle : 'background-color: #ffffff;'
			};
			toolEl.window = new Ext.Window(defaultConfig);
			toolEl.window.on('hide', handleMinimize, panel);
		}
		if (!panel.dummyComponent) {
			var dummyCompConfig = {
				title : panel.title,
				width : panel.getSize().width,
				height : panel.getSize().height,
				html : '&nbsp;'
			};
			panel.dummyComponent = new Ext.Panel(dummyCompConfig);
		}
		
		toolEl.window.add(panel);
		if (panel.tools['toggle'])
			panel.tools['toggle'].setVisible(false);
		if (panel.tools['close'])
			panel.tools['close'].setVisible(false);
		panel.tools['maximize'].setVisible(false);

		panel.originalOwnerCt.insert(panel.originalPosition,
				panel.dummyComponent);
		panel.originalOwnerCt.doLayout();
		panel.dummyComponent.setSize(panel.originalSize);
		panel.dummyComponent.setVisible(true);
		panel.dummyComponent.getEl().mask('扩大中...');
		toolEl.window.show(this);
	};

	function handleMinimize(window) {
		this.dummyComponent.getEl().unmask();
		this.dummyComponent.setVisible(false);
		this.originalOwnerCt.insert(this.originalPosition, this);
		this.originalOwnerCt.doLayout();
		this.setSize(this.originalSize);
		this.tools['maximize'].setVisible(true);
		if (this.tools['toggle'])
			this.tools['toggle'].setVisible(true);
		if (this.tools['close'])
			this.tools['close'].setVisible(true);
	}

};

// EOP
