/** Zingtree Configuration Details**/
var domainName = 'https://zingtree.com';
var apiKey = '';
var showHistory = 0;
/** Zingtree Configuration Details**/

/** Store Call id to verify intial call hanguped **/
var initialcall='';

var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.zingtree = (function ($) {
    var user, states, dialogs, clientlogs,

        render = function () {
            var currentState = user.getState();

        },

        handleNewDialog = function (dialog) {

	
            // call the displayCall handler
            const callVars = dialog.getMediaProperties();
            // Getting Zingtree TreeID from Callflow
            var Treeid = callVars["user.TreeID"];
	if(initialcall=='')
{
initialcall=dialog.getId();
}
           

            // Getting Zingtree custom variable
            var querystring = "";
            for (var key in callVars) {

                if (key.startsWith("user.CF_")) {
                    var param = key.replace("user.CF_", "");
                    querystring = querystring + "&zv_" + param + "=" + callVars[key];
                }
            }


            if (user.getExtension() != dialog.getFromAddress()) {
                
                if (Treeid != "" && Treeid!=undefined) {
                    $("#displayOut").text("");
                    // Loading Zingtree url into iframe
                    $("#contentPage").attr("src", "" + domainName + "/deploy/tree.php?agent_mode=1&tree_id=" + Treeid + "&apikey=" + apiKey + "&show_history=" + showHistory + "&source="+user.getFirstName()+""+querystring+"");

                    // Setting Zingtree page height
                    $("#contentPage").attr("height", 800);
                    gadgets.window.adjustHeight();
		    
                }
            }

        },

        handleEndDialog = function (dialog) {
		
if(initialcall==dialog.getId())
{
initialcall='';
$("#displayOut").text("Please wait for Incoming call");
            $("#contentPage").attr("src", "");
            $("#contentPage").attr("height", "100px");
            gadgets.window.adjustHeight();
}

            
        },

        handleUserLoad = function (userevent) {
            // Get an instance of the dialogs collection and register handlers for dialog additions and
            // removals
          
            dialogs = user.getDialogs({
                onCollectionAdd: handleNewDialog,
                onCollectionDelete: handleEndDialog
            });
            render();
        },

        handleUserChange = function (userevent) {

		

            dialogs = user.getDialogs({
                onCollectionAdd: handleNewDialog,
                onCollectionDelete: handleEndDialog
            });
            render();
        };
    /** @scope finesse.modules.zingtree */
    return {
        /**
         * Performs all initialization for this gadget
         */
        init: function () {
            var cfg = finesse.gadget.Config;

            //gadgets.window.adjustHeight();

            // Initiate the ClientServices and load the user object. ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(cfg, false);

            user = new finesse.restservices.User({
                id: cfg.id,
                onLoad: handleUserLoad,
                onChange: handleUserChange
            });




        } // init function
    }; // return
}(jQuery));
