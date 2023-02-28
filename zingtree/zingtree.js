/** Zingtree Configuration Details**/
var domainName = 'https://zingtree.com';
var apiKey = '';
var showHistory = 1;
/** Zingtree Configuration Details**/

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
            var callVars = dialog.getMediaProperties();            
            // Getting Zingtree TreeID from Media Properties
            var Treeid = callVars["user.TreeID"];

            if (user.getExtension() != dialog.getFromAddress()) {
                //Getting Zingtree variables from Media Properties and building string to pass to Zingtree url. (If Variables starts with CF_)
                var querystring = "";
                for (var key in callVars) {
                    if (key.startswith('CF_')) {
                        querystring = querystring + "&zv_" + key = callVars[i];
                    }
                }
                

                if (Treeid != "") {
                    $("#displayOut").text("");
                    // Loading Zingtree url into iframe
                    $("#contentPage").attr("src", "" + domainName + "/deploy/tree.php?tree_id=" + Treeid + "&apikey=" + apiKey + "&show_history=" + showHistory + "" + querystring + "");
                    // Setting Zingtree page height
                    $("#contentPage").attr("height", "500"); gadgets.window.adjustHeight();
                }
            }


        },

        handleEndDialog = function (dialog) {
            $("#displayOut").text("Please wait for Incoming call");
            $("#contentPage").attr("src", "");
            $("#contentPage").attr("height", "100");
            gadgets.window.adjustHeight();
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