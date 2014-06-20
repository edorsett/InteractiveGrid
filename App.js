Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    launch: function() {
    	console.log("my second app");
    	//this._loadData();
    	
    	this.pulldownContainer = Ext.create('Ext.container.Container', {
    		id: 'pulldown-container-id',
    		layout: {
    			type: 'hbox',
    			align: 'stretch'
    		}
    	});
    	
    	this.add(this.pulldownContainer);
    	this._loadIterations();
     },
    
    _loadIterations: function() {
    	this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
    		fieldLabel: 'Iteration',
    		labelAlign: 'right',
    		width: 300,
    		listeners: {
    			ready: function(combobox){
    				//this._loadData();
    				this._loadSeverities();
    			},
    			select: function(combobox, records) {
    				this._loadData();
    			},
    			
    			scope: this
    		},
    	});
    	
    	this.pulldownContainer.add(this.iterComboBox);
    },
    
    _loadSeverities: function() {
    	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
    		model: 'Defect',
    		field: 'Severity',
    		fieldLabel: 'Severity',
    		labelAlign: 'right',
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    				//this._loadSeverities();
    			},
    			select: function(combobox, records) {
    				this._loadData();
    			},
    			scope: this
    		},
    	});
    	this.pulldownContainer.add(this.severityComboBox);
    },
    
    //Get data from Rally
    _loadData: function() {
    	   
    	   var selectedIterRef = this.iterComboBox.getRecord().get('_ref');
    	   var selectedSevValue = this.iterComboBox.getRecord().get('value');
    	   
    	   var myFilters = [{ property: 'Iteration', operation: '=', value: selectedIterRef },
				{ property: 'Severity', operation: '=', value: selectedSevValue }];
    	   
    	   //if store exists, just load data
    	   if(this.defectStore) {
			   this.defectStore.setFilter(myFilters);
			   this.defectStore.load();
    	   } else {
			   //add store
			   this.defectStore = Ext.create('Rally.data.wsapi.Store', {
					model: 'Defect',
					autoLoad: true,
					filters: myFilters,
					listeners: {
						load: function(myStore, myData, success) {
							//process data
							console.log("got my data", myStore, myData, success);
							if (!this.myGrid) {
								this._createGrid(myStore);
							}
							
						},
						scope: this
					},
				fetch: ['FormattedID', 'Name', 'Severity', 'Iteration']
				}); 
			} //end if   

    },
    
    //Put data into table and display
    _createGrid: function(myStoryStore) {
    	this.myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: ['FormattedID', 'Name', 'Severity', 'Iteration']
		 });
 
		 this.add(this.myGrid);
         //console.log("what is this?", this);
    },
});