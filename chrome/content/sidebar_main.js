(function() {
  var Sidebar = stickynotes.Sidebar;
  var resizeSidebarHeight = Sidebar.resizeSidebarHeight.bind(Sidebar);
  var filterContextMenu   = Sidebar.filterContextMenu.bind(Sidebar);
  var init = function() {
    var root = document.getElementById('sticky');
    if (root == null) return;
    root.addEventListener('dblclick', function(e) {
      Sidebar.jump();
    }, true);
    root.addEventListener('keydown', function(e) {
      if (e.keyCode == 13 || e.keyCode == 74)//Enter or j  --> Jump
        Sidebar.jump();
    }, true);
    root.addEventListener('keydown', function(e) {
      if (e.keyCode == 68) {// d  --> Delete
        Sidebar.remove();
        Sidebar.focusSidebar();
      }
    },true);
    var mainWindow = window
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIWebNavigation)
      .QueryInterface(Ci.nsIDocShellTreeItem)
      .rootTreeItem
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIDOMWindow);
    mainWindow.addEventListener('click', resizeSidebarHeight, false);
    stickynotes.Sidebar.groupBy();
    var contextMenu = document.getElementById('context-menu');
    contextMenu.addEventListener('popupshowing', filterContextMenu, false);
  };
  var destroy = function() {
    var mainWindow =
      window
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIWebNavigation)
      .QueryInterface(Ci.nsIDocShellTreeItem)
      .rootTreeItem
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIDOMWindow);
    var contextMenu = document.getElementById('context-menu');
    contextMenu.removeEventListener('popupshowing', filterContextMenu, false);
    mainWindow.removeEventListener('click', resizeSidebarHeight, false);
  };

  stickynotes.Sidebar.resizeSidebarHeight();
  window.addEventListener('load', init, false);
  window.addEventListener('unload', destroy, false);
  addon.port.on('focus', function() {
    stickynotes.Sidebar.focusSidebar();
  });
  addon.port.on('add', function(sticky) {
    stickynotes.Sidebar.addSticky(new stickynotes.Sticky(sticky));
  });
  addon.port.on('delete', function(sticky) {
    stickynotes.Sidebar.deleteSticky(new stickynotes.Sticky(sticky));
  });
  addon.port.on('save', function(sticky) {
    stickynotes.Sidebar.updateSticky(new stickynotes.Sticky(sticky));
  });
  addon.port.on('import', function(stickies) {
    stickies.forEach(function(s) {
      stickynotes.Sidebar.addSticky(new stickynotes.Sticky(s));
    });
  });
})();
