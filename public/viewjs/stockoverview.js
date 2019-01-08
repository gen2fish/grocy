﻿var stockOverviewTable = $('#stock-overview-table').DataTable({
	'paginate': false,
	'order': [[3, 'asc']],
	'columnDefs': [
		{ 'orderable': false, 'targets': 0 },
		{ 'visible': false, 'targets': 4 },
		{ 'visible': false, 'targets': 5 },
		{ 'visible': false, 'targets': 6 }
	],
	'language': JSON.parse(L('datatables_localization')),
	'scrollY': false,
	'colReorder': true,
	'stateSave': true,
	'stateSaveParams': function(settings, data)
	{
		data.search.search = "";

		data.columns.forEach(column =>
		{
			column.search.search = "";
		});
	}
});
$('#stock-overview-table tbody').removeClass("d-none");

$("#location-filter").on("change", function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	stockOverviewTable.column(4).search(value).draw();
});

$("#product-group-filter").on("change", function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	stockOverviewTable.column(6).search(value).draw();
});

$("#status-filter").on("change", function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	// Transfer CSS classes of selected element to dropdown element (for background)
	$(this).attr("class", $("#" + $(this).attr("id") + " option[value='" + value + "']").attr("class") + " form-control");

	stockOverviewTable.column(5).search(value).draw();
});

$(".status-filter-button").on("click", function()
{
	var value = $(this).data("status-filter");
	$("#status-filter").val(value);
	$("#status-filter").trigger("change");
});

$("#search").on("keyup", function()
{
	var value = $(this).val();
	if (value === "all")
	{
		value = "";
	}

	stockOverviewTable.search(value).draw();
});

$(document).on('click', '.product-consume-button', function(e)
{
	e.preventDefault();

	// Remove the focus from the current button
	// to prevent that the tooltip stays until clicked anywhere else
	document.activeElement.blur();

	Grocy.FrontendHelpers.BeginUiBusy();

	var productId = $(e.currentTarget).attr('data-product-id');
	var productName = $(e.currentTarget).attr('data-product-name');
	var productQuName = $(e.currentTarget).attr('data-product-qu-name');
	var consumeAmount = $(e.currentTarget).attr('data-consume-amount');

	Grocy.Api.Post('stock/' + productId + '/consume/' + consumeAmount,
		function()
		{
			Grocy.Api.Get('stock/' + productId,
				function(result)
				{
					var productRow = $('#product-' + productId + '-row');
					var expiringThreshold = moment().add("-" + $("#info-expiring-products").data("next-x-days"), "days");
					var now = moment();
					var nextBestBeforeDate = moment(result.next_best_before_date);

					productRow.removeClass("table-warning");
					productRow.removeClass("table-danger");
					if (now.isAfter(nextBestBeforeDate))
					{
						productRow.addClass("table-danger");
					}
					if (expiringThreshold.isAfter(nextBestBeforeDate))
					{
						productRow.addClass("table-warning");
					}

					var oldAmount = parseInt($('#product-' + productId + '-amount').text());
					var newAmount = oldAmount - consumeAmount;
					if (newAmount === 0)
					{
						$('#product-' + productId + '-row').fadeOut(500, function()
						{
							$(this).remove();
						});
					}
					else
					{
						$('#product-' + productId + '-amount').parent().effect('highlight', { }, 500);
						$('#product-' + productId + '-amount').fadeOut(500, function()
						{
							$(this).text(newAmount).fadeIn(500);
						});
						$('#product-' + productId + '-consume-all-button').attr('data-consume-amount', newAmount);

						$('#product-' + productId + '-next-best-before-date').parent().effect('highlight', { }, 500);
						$('#product-' + productId + '-next-best-before-date').fadeOut(500, function()
						{
							$(this).text(result.next_best_before_date).fadeIn(500);
						});
						$('#product-' + productId + '-next-best-before-date-timeago').attr('datetime', result.next_best_before_date);

						var openedAmount = result.stock_amount_opened || 0;
						$('#product-' + productId + '-opened-amount').parent().effect('highlight', {}, 500);
						$('#product-' + productId + '-opened-amount').fadeOut(500, function ()
						{
							if (openedAmount > 0)
							{
								$(this).text(L('#1 opened', openedAmount)).fadeIn(500);
							}
							else
							{
								$(this).text("").fadeIn(500);
							}
						});
					}

					Grocy.FrontendHelpers.EndUiBusy();
					toastr.success(L('Removed #1 #2 of #3 from stock', consumeAmount, productQuName, productName));
					RefreshContextualTimeago();
					RefreshStatistics();
				},
				function(xhr)
				{
					Grocy.FrontendHelpers.EndUiBusy();
					console.error(xhr);
				}
			);
		},
		function(xhr)
		{
			Grocy.FrontendHelpers.EndUiBusy();
			console.error(xhr);
		}
	);
});

$(document).on('click', '.product-open-button', function(e)
{
	e.preventDefault();

	// Remove the focus from the current button
	// to prevent that the tooltip stays until clicked anywhere else
	document.activeElement.blur();

	Grocy.FrontendHelpers.BeginUiBusy();

	var productId = $(e.currentTarget).attr('data-product-id');
	var productName = $(e.currentTarget).attr('data-product-name');
	var productQuName = $(e.currentTarget).attr('data-product-qu-name');
	var button = $(e.currentTarget);

	Grocy.Api.Get('stock/' + productId + 'open/1',
		function()
		{
			Grocy.Api.Get('stock/' + productId,
				function(result)
				{
					var productRow = $('#product-' + productId + '-row');
					var expiringThreshold = moment().add("-" + $("#info-expiring-products").data("next-x-days"), "days");
					var now = moment();
					var nextBestBeforeDate = moment(result.next_best_before_date);

					productRow.removeClass("table-warning");
					productRow.removeClass("table-danger");
					if (now.isAfter(nextBestBeforeDate))
					{
						productRow.addClass("table-danger");
					}
					if (expiringThreshold.isAfter(nextBestBeforeDate))
					{
						productRow.addClass("table-warning");
					}

					$('#product-' + productId + '-next-best-before-date').parent().effect('highlight', {}, 500);
					$('#product-' + productId + '-next-best-before-date').fadeOut(500, function ()
					{
						$(this).text(result.next_best_before_date).fadeIn(500);
					});
					$('#product-' + productId + '-next-best-before-date-timeago').attr('datetime', result.next_best_before_date);

					$('#product-' + productId + '-opened-amount').parent().effect('highlight', {}, 500);
					$('#product-' + productId + '-opened-amount').fadeOut(500, function ()
					{
						$(this).text(L('#1 opened', result.stock_amount_opened)).fadeIn(500);
					});

					if (result.stock_amount == result.stock_amount_opened)
					{
						button.addClass("disabled");
					}

					Grocy.FrontendHelpers.EndUiBusy();
					toastr.success(L('Marked #1 #2 of #3 as opened', 1, productQuName, productName));
					RefreshContextualTimeago();
					RefreshStatistics();
				},
				function(xhr)
				{
					Grocy.FrontendHelpers.EndUiBusy();
					console.error(xhr);
				}
			);
		},
		function(xhr)
		{
			Grocy.FrontendHelpers.EndUiBusy();
			console.error(xhr);
		}
	);
});

$(document).on("click", ".product-name-cell", function(e)
{
	Grocy.Components.ProductCard.Refresh($(e.currentTarget).attr("data-product-id"));
	$("#stockoverview-productcard-modal").modal("show");
});

function RefreshStatistics()
{
	Grocy.Api.Get('stock',
		function(result)
		{
			var amountSum = 0;
			result.forEach(element => {
				amountSum += parseInt(element.amount);
			});
			$("#info-current-stock").text(result.length + " " + Pluralize(result.length, L('Product'), L('Products')) + ", " + amountSum.toString() + " " + Pluralize(amountSum, L('Unit'), L('Units')));
		},
		function(xhr)
		{
			console.error(xhr);
		}
	);

	var nextXDays = $("#info-expiring-products").data("next-x-days");
	Grocy.Api.Get('stock/volatil?expiring_days=' + nextXDays,
		function(result)
		{
			$("#info-expiring-products").text(Pluralize(result.expiring_products.length, L('#1 product expires within the next #2 days', result.expiring_products.length, nextXDays), L('#1 products expiring within the next #2 days', result.expiring_products.length, nextXDays)));
			$("#info-expired-products").text(Pluralize(result.expired_products.length, L('#1 product is already expired', result.expired_products.length), L('#1 products are already expired', result.expired_products.length)));
			$("#info-missing-products").text(Pluralize(result.missing_products.length, L('#1 product is below defined min. stock amount', result.missing_products.length), L('#1 products are below defined min. stock amount', result.missing_products.length)));
		},
		function(xhr)
		{
			console.error(xhr);
		}
	);
}

RefreshStatistics();
