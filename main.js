var cdnPortal = (function(){

	function init() {
		initEvents();
		msgDetail();
		selectTabOption();
		tableOptions();
	};

	function initEvents() {
		//set variables
		tabLocation = 'packages-tab';
		tabId = '#packages';
		//checkbox events
		$(".chkAll").on('click', showCheckedAll);
		$(".chkNone").on('click', unChecked);
		$(".toggle-select").on('click', showTabOptions);
		$(".chkAllMain").on('change', function() {
			if($(this).is(':checked')) {
				showCheckedAll();
			} else {
				unChecked();
			}
		});
		//tab events
		$('ul.main-nav li a, ul.nav-details li a').click(showTabs);
		//hide undo button
		$('li.undo-btn').hide();
	}

	function showCheckedAll() {
		this.checked;
		$(".toggle-select").each(function() {
			this.checked = true;
			
			if (tabLocation!=='#inbox') {
				$('li.tab-btns').css('display', 'inline');
			} else {
				$('li.inbox-btns').css('display', 'inline');
			}
			
		});
	}

	function unChecked() {
		$(".toggle-select").each(function() {
			this.checked = false;
			$('li.tab-btns, li.inbox-btns').hide();
		});
	}

	function showTabOptions() {
	var tabBtns = $('li.tab-btns');
	var deleteBtn = $('li.tab-delete');
	var tabInbox = $('li.inbox-btns');
	var detailBtns = $('li.tab-detail');
		if ($('.toggle-select:checked')) {
			if(tabLocation=='inbox-tab') {
				hideTabOptions();
				tabInbox.css('display', 'inline');
			} else if ((tabLocation=='assets-tab') || (tabLocation=='research-tab')) {
				hideTabOptions();
				deleteBtn.css('display', 'inline');
			} else if (tabLocation=='recipients-tab') {
				hideTabOptions();
				detailBtns.css('display', 'inline');
				deleteBtn.css('display', 'inline');
			} else {
				hideTabOptions();
				tabBtns.css('display', 'inline');
				detailBtns.css('display', 'inline');
			}
		}
	}

	function showTabs() {
		tabLocation = $(this).attr('id');
		//toggle active state
		$('a.active').removeClass('active');
		$(this).addClass('active');

	 	$(".msg-table tr").show();
	 	$('li.tab-btns, li.inbox-btns, li.undo-btn').hide();
	 	$(this).css('cursor', 'pointer');

	 	//hide or show clicked tabs
	 	hideAllTabs();
	 	tabId = '#' + tabLocation.slice(0,-4);
	 	console.log(tabId);
	 	$(tabId).show();
	 	
	 	//assign tabs to respective pages
	 	if (tabId=='#inbox') {
			$('#inbox-inner').insertBefore('ul.tab-options').show();
		} else {
			$('#inbox-inner').hide();
		}
		if ((tabId=='#assets') || (tabId=='#inbox')){
			$('li.search-box').hide();
		} else {
			$('li.search-box').show();
		}
	 	unChecked();
	}

	function hideTabOptions() {
		$('li.tab-btns, li.inbox-btns').hide();
	}

	//hide or show tabs
	function hideAllTabs() {
		$('#packages, #content, #inbox, #research, #recipients, #assets, #activity, #inbox-inner').hide();
	}

	function msgDetail() {
		$('a.msg-details').click(function() {
			tabId = '#recipients';
			$('a.active').removeClass('active');
			$('a#recipients-tab').addClass('active');
			$('#recipients, #detail-content, li.search-box').show();
			$('.package, #inbox-inner').hide();


			var mainNav = $('ul.main-nav li a');
			$(mainNav).click(function() {
				$('.package').show();
				$('#detail-content').hide();
				//showTabs();
			});
			//remove 'new' class when email subject is clicked 
			var rowData = $('a.msg-details').closest('tr');
			if(rowData.hasClass('new')) {
				rowData.removeClass('new');
			}
		});

		//prefill search box after activity is clicked
		$('.search-term').click(function(e) {
			var searchTerm = $(e.target).text();
			if(tabId =='#activity') {
			$('#detail-search-box').val(searchTerm);
			} 
			$('ul.main-nav li a, ul.nav-details li a').click(function(){
				$('#detail-search-box').val('');
			});
		});

		//remove checkbox from activity tab
		var chkAllParent = $('.toggle-select').parent('li');
		if (tabId=='#activity') {
			if(chkAllParent) {
				chkAllParent.hide();
				$('li.dropdown').hide();
				$('.toggle-select').hide();
			}
		} else {
			$('.toggle-select').show();
			chkAllParent.show();
			$('li.dropdown').show();
		}
	}

	function selectTabOption() {
		//Show tab options when a checkbox is selected
		$('li.tab-btns, li.inbox-btns').click(function() {
			var btnClicked = event.target.innerHTML;
			if (btnClicked =="Recall from All") {
				var msgTxt = "recalled";
			} else if ((btnClicked =="Revoke Forwarding") || (btnClicked =="Revoke")) {
				var msgTxt = "revoked";
			} else if (btnClicked =="Add Star") {
				var msgTxt = "starred";
			} else if (btnClicked =="Add Label") {
				var msgTxt = "labeled";
			} else if (btnClicked =="Delete") {
				var msgTxt = "deleted";
			}
			showOptions(msgTxt);
		})

		// move message to trash after deleted
		$('#delete').click(function() {
			var checked = $(tabId).find(".toggle-select:checked");
			var deletedRow = $(this).closest('.package').find("input.toggle-select:checked").closest("tr");
			checked.closest('tr').removeClass().addClass('trashed').hide();
			var starStatus = checked.parent('tr').find('li.star_unstar a');
			console.log('starStatus', starStatus)
			if ($(starStatus).hasClass('starred')) {
				$(this).removeClass('starred');
			}
		});


		//remove undo message and button when user clicks anywhere on document	
		$('.container').mousedown(function(){
			if($('li.undo-btn').is(':visible')) {
				$('a.undo').click(function() {
					$('li.tab-btn-detail').css('display', 'inline').html('Undo was successful.');
					$('li.undo-btn').hide();
					//e.stopPropagation();
				})
			} else {
				$('.undo-btn, .tab-btn-detail').hide();
			}
		});		
	}

	function showOptions(args) {
		$('li.undo-btn').css('display', 'inline');
		$('li.tab-btn-detail').css('display', 'inline');
		var checked = $(tabId).find(".toggle-select:checked");
		if(checked.length==1) {
			$('li.tab-btn-detail').html('You ' + args + ' ' + checked.length + ' message.</li>');
		} else {
			$('li.tab-btn-detail').html('You ' + args + ' ' + checked.length + ' messages.</li>');
		}
		unChecked();
	}

	function resetTabs() {
		$(".msg-table tr:not(.trashed)").show();
	}	

	function tableOptions() {
		//Package table options click events
		$('li#newMail').click(function() {
			if (tabId=='#packages') {
				resetTabs();
				$(".msg-table tr:not(.new)").hide();
			}
		});

		$('li#allMail').click(function() {
			resetTabs();
		});

		$('li#sentMail').click(function() {
			if (tabId=='#packages') {
				resetTabs();
				$(".msg-table tr:not(.sent)").hide();
			}
		});

		$('li#receivedMail').click(function() {
			if (tabId=='#packages') {
				resetTabs();
				$(".msg-table tr:not(.received)").hide();
			}
		});

		$('li#starredMail').click(function() {
			if (tabId=='#packages') {
				resetTabs();
				$(".msg-table tr:not(.hasStar)").hide();
			}
		});

		$('li#trashedMail').click(function() {
			if (tabId=='#packages') {
				$(".msg-table tr:not(.trashed)").hide();
				$(".msg-table tr.trashed").show();

			}
		});

		 
		 //Toggle starred state
		 $('a.unstarred, a.starred').click(function(e) {
		 	e.preventDefault();
		 	if($(this).hasClass('unstarred')) {
		 		$(this).removeClass('unstarred').addClass('starred');
		 		$(this).closest('tr').addClass('hasStar');
		 	} else {
		 		$(this).removeClass('starred').addClass('unstarred');
		 		$(this).closest('tr').removeClass('hasStar');
		 	}
		});  
	}

	return {
		init : init
	}

})();

cdnPortal.init();