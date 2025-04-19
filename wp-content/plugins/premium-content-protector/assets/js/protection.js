(function ($) {
	"use strict";

	// Disable right click
	$(document).on("contextmenu", ".protected-content", function (e) {
		e.preventDefault();
		return false;
	});

	// Disable text selection
	$(document).on("selectstart", ".protected-content", function (e) {
		e.preventDefault();
		return false;
	});

	// Disable copy
	$(document).on("copy", ".protected-content", function (e) {
		e.preventDefault();
		return false;
	});
})(jQuery);
