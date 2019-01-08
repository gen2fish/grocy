﻿$('#save-quantityunit-button').on('click', function(e)
{
	e.preventDefault();

	var jsonData = $('#quantityunit-form').serializeJSON();
	Grocy.FrontendHelpers.BeginUiBusy("quantityunit-form");

	if (Grocy.EditMode === 'create')
	{
		Grocy.Api.Post('object/quantity_units', jsonData,
			function(result)
			{
				window.location.href = U('/quantityunits');
			},
			function(xhr)
			{
				Grocy.FrontendHelpers.EndUiBusy("quantityunit-form");
				Grocy.FrontendHelpers.ShowGenericError('Error while saving, probably this item already exists', xhr.response)
			}
		);
	}
	else
	{
		Grocy.Api.Put('object/quantity_units/' + Grocy.EditObjectId, jsonData,
			function(result)
			{
				window.location.href = U('/quantityunits');
			},
			function(xhr)
			{
				Grocy.FrontendHelpers.EndUiBusy("quantityunit-form");
				Grocy.FrontendHelpers.ShowGenericError('Error while saving, probably this item already exists', xhr.response)
			}
		);
	}
});

$('#quantityunit-form input').keyup(function(event)
{
	Grocy.FrontendHelpers.ValidateForm('quantityunit-form');
});

$('#quantityunit-form input').keydown(function(event)
{
	if (event.keyCode === 13) //Enter
	{
		event.preventDefault();

		if (document.getElementById('quantityunit-form').checkValidity() === false) //There is at least one validation error
		{
			return false;
		}
		else
		{
			$('#save-quantityunit-button').click();
		}
	}
});

$('#name').focus();
Grocy.FrontendHelpers.ValidateForm('quantityunit-form');
