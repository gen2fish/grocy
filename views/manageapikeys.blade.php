@extends('layout.default')

@section('title', $L('API keys'))
@section('activeNav', '')
@section('viewJsName', 'manageapikeys')

@push('pageScripts')
	<script src="{{ $U('/node_modules/jquery-ui-dist/jquery-ui.min.js?v=', true) }}{{ $version }}"></script>
@endpush

@section('content')
<div class="row">
	<div class="col">
		<h1>
			@yield('title')
			<a class="btn btn-outline-dark" href="{{ $U('/manageapikeys/new') }}">
				<i class="fas fa-plus"></i>&nbsp;{{ $L('Add') }}
			</a>
		</h1>
	</div>
</div>

<div class="row mt-3">
	<div class="col-xs-12 col-md-6 col-xl-3">
		<label for="search">{{ $L('Search') }}</label> <i class="fas fa-search"></i>
		<input type="text" class="form-control" id="search">
	</div>
</div>

<div class="row">
	<div class="col">
		<table id="apikeys-table" class="table table-sm table-striped dt-responsive">
			<thead>
				<tr>
					<th>#</th>
					<th>{{ $L('API key') }}</th>
					<th>{{ $L('User') }}</th>
					<th>{{ $L('Expires') }}</th>
					<th>{{ $L('Last used') }}</th>
					<th>{{ $L('Created') }}</th>
				</tr>
			</thead>
			<tbody class="d-none">
				@foreach($apiKeys as $apiKey)
				<tr id="apiKeyRow_{{ $apiKey->id }}">
					<td class="fit-content">
						<a class="btn btn-danger btn-sm apikey-delete-button" href="#" data-apikey-id="{{ $apiKey->id }}" data-apikey-apikey="{{ $apiKey->api_key }}">
							<i class="fas fa-trash"></i>
						</a>
					</td>
					<td>
						{{ $apiKey->api_key }}
					</td>
					<td>
						{{ GetUserDisplayName(FindObjectInArrayByPropertyValue($users, 'id', $apiKey->user_id)) }}
					</td>
					<td>
						{{ $apiKey->expires }}
						<time class="timeago timeago-contextual" datetime="{{ $apiKey->expires }}"></time>
					</td>
					<td>
						@if(empty($apiKey->last_used)){{ $L('never') }}@else{{ $apiKey->last_used }}@endif
						<time class="timeago timeago-contextual" datetime="{{ $apiKey->last_used }}"></time>
					</td>
					<td>
						{{ $apiKey->row_created_timestamp }}
						<time class="timeago timeago-contextual" datetime="{{ $apiKey->row_created_timestamp }}"></time>
					</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop
