/*!
 * jQuery Confirmation Plugin
 * version: 1.0
 * author: Thomas Girotto
 * @requires jquery-1.8.2 and jquery-ui-1.9.1 most likely works with a lot of former version, but didn't test.
 *
 * Examples and documentation at: http://thomas-girotto.blogspot.fr/2013/01/jquery-plugin-to-replace-javascript.html
 */
(function ($) {

    $.fn.confirm = function (options) {
		return this.each(function () {
			var opts;
			var shouldDisplayDialog = true;
			
            //underlying dom element on which we apply .confirm
            var button = $(this);
            var defaults = {
                title: "Confirm",
				message: "Are you sure you want to do that?",
                onOK: function () {
                    shouldDisplayDialog = false;
                    button.click();
					shouldDisplayDialog = true;
                },
                //function that should contains tests wether or not the confirmation dialog should open. Default is always true
                checkConditions: function () {
                    return true;
                }
            }

            if (typeof options != "object") {
                opts = $.extend({}, defaults);
            } else {
                opts = $.extend({}, defaults, options);
            }
            //We must generate a unique id because we can generate several divs for the dialog if we apply .confirm plugin on several element
			//in the same page
            var divId = "confirmDialog" + Math.floor(Math.random() * 1000 + 1);
            $('body').append("<div id='" + divId + "'><span class='ui-icon ui-icon-alert' style='display:inline-block;'></span>" + opts.message + "</div>");
            $("#" + divId).dialog({
                autoOpen: false,
                show: "fade",
                hide: "fade",
                modal: true,
                height: 160,
                width: 400,
                title: opts.title,
                buttons: {
                    OK: function() {
						//The onOK callback is not binded directly to OK  property because then we can close the dialog here all the time
						//without the need to do it in case of override
						$("#" + divId).dialog("close");
						opts.onOK.call();
					},
                    Cancel: function() {
						$("#" + divId).dialog("close");
						//onCancel doesn't have default behaviour so we have to check if it exists
						if (opts.onCancel != undefined) {
							opts.onCancel.call();
						}
					}
                }
            });

			//As the click trigger the confirm dialog, and as it's also called in the default behaviour of the OK confirm button, we need
			//the boolean to tell if we should display the dialog or not
            $(this).click(function (e) {
                if (shouldDisplayDialog) {
                    if (opts.checkConditions.call()) {
                        $("#" + divId).dialog("open");
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        });
    };

})(jQuery);