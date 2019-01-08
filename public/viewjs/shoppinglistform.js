﻿$('#save-shoppinglist-button').on('click', function(e)
{
	e.preventDefault();

	var jsonData = $('#shoppinglist-form').serializeJSON();
	Grocy.FrontendHelpers.BeginUiBusy("shoppinglist-form");

	if (Grocy.EditMode === 'create')
	{
		Grocy.Api.Post('add-object/shopping_list', jsonData,
			function(result)
			{
				window.location.href = U('/shoppinglist');
			},
			function(xhr)
			{
				Grocy.FrontendHelpers.EndUiBusy("shoppinglist-form");
				console.error(xhr);
			}
		);
	}
	else
	{
		Grocy.Api.Post('edit-object/shopping_list/' + Grocy.EditObjectId, jsonData,
			function(result)
			{
				window.location.href = U('/shoppinglist');
			},
			function(xhr)
			{
				Grocy.FrontendHelpers.EndUiBusy("shoppinglist-form");
				console.error(xhr);
			}
		);
	}
});

Grocy.Components.ProductPicker.GetPicker().on('change', function(e)
{
	var productId = $(e.target).val();

	if (productId)
	{
		Grocy.Components.ProductCard.Refresh(productId);

		Grocy.Api.Get('stock/' + productId,
			function (productDetails)
			{
				$('#amount_qu_unit').text(productDetails.quantity_unit_purchase.name);
				$('#amount').focus();
				Grocy.FrontendHelpers.ValidateForm('shoppinglist-form');
			},
			function(xhr)
			{
				console.error(xhr);
			}
		);
	}
});

Grocy.FrontendHelpers.ValidateForm('shoppinglist-form');
Grocy.Components.ProductPicker.GetInputElement().focus();

if (Grocy.EditMode === "edit")
{
	Grocy.Components.ProductPicker.GetPicker().trigger('change');
}

$('#amount').on('focus', function(e)
{
	if (Grocy.Components.ProductPicker.GetValue().length === 0)
	{
		Grocy.Components.ProductPicker.GetInputElement().focus();
	}
	else
	{
		$(this).select();
	}
});

$('#shoppinglist-form input').keyup(function (event)
{
	Grocy.FrontendHelpers.ValidateForm('shoppinglist-form');
});

$('#shoppinglist-form input').keydown(function (event)
{
	if (event.keyCode === 13) //Enter
	{
		event.preventDefault();

		if (document.getElementById('shoppinglist-form').checkValidity() === false) //There is at least one validation error
		{
			return false;
		}
		else
		{
			$('#save-shoppinglist-button').click();
		}
	}
});
