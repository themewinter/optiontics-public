/**
 * Dokan Order Addons Display
 *
 * Injects addon data into Dokan vendor dashboard order details page
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        // Check if addon data exists
        if (typeof optionticsDokanAddons === 'undefined' || !optionticsDokanAddons.items) {
            return;
        }

        var addonsData = optionticsDokanAddons.items;

        // Iterate through each item with addons
        $.each(addonsData, function(itemId, addonsHtml) {
            var $itemRow = $('tr[data-order_item_id="' + itemId + '"]');

            if ($itemRow.length > 0) {
                var $nameCell = $itemRow.find('td.name');

                if ($nameCell.length > 0) {
                    $nameCell.append('<div class="optiontics-addons">' + addonsHtml + '</div>');
                }
            }
        });
    });

})(jQuery);
