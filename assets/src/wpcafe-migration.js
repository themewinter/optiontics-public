/**
 * WPCafe Product Addons Migration Script
 * Handles the AJAX migration process from WPCafe to Optiontics
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        $('#optiontics-run-migration').on('click', function(e) {
            e.preventDefault();

            var $button = $(this);
            var $spinner = $button.siblings('.spinner');
            var $status = $('#optiontics-migration-status');

            // Disable button and show spinner
            $button.prop('disabled', true);
            $spinner.addClass('is-active');
            $status.html('');

            // Make AJAX request to migration endpoint
            $.ajax({
                url: optionticsWPCafeMigration.restUrl,
                method: 'POST',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', optionticsWPCafeMigration.nonce);
                },
                success: function(response) {
                    $spinner.removeClass('is-active');

                    if (response.success) {
                        $status.html('<span style="color: green;">✓ ' + response.message + '</span>');

                        // Hide notice after 3 seconds
                        setTimeout(function() {
                            $('#optiontics-migration-notice').fadeOut();
                        }, 3000);
                    } else {
                        $status.html('<span style="color: red;">✗ ' + response.message + '</span>');
                        $button.prop('disabled', false);
                    }
                },
                error: function(xhr) {
                    $spinner.removeClass('is-active');

                    var errorMessage = 'Migration failed. Please try again.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }

                    $status.html('<span style="color: red;">✗ ' + errorMessage + '</span>');
                    $button.prop('disabled', false);
                }
            });
        });
    });

})(jQuery);
