(function(){

	'use strict';

	/*
	** Validation Functionality
	** Text inputs / Selection inputs / Email input RegEx
	*/

	function validateText(arr) {
		var validationArr = [];

		for ( var i = 0; i < arr.length; i++ ) {
			if ( arr[i].value !== '' ) {
				validationArr.push(true);
			}
			else {
				validationArr.push(false);
				$(arr[i]).parents('.required').addClass('error');
			}
		}

		if ( $.inArray(false, validationArr) > -1 ) {
			return false;
		}
		else {
			return true;
		}
	}

	function validateSelects(arr) {
		var validationArr = [];

		for ( var i = 0; i < arr.length; i++ ) {
			if ( $(arr[i]).find('input:checked').length > 0 ) {
				validationArr.push(true);
			}
			else {
				validationArr.push(false);
				$(arr[i]).addClass('error');
			}
		}

		if ( $.inArray(false, validationArr) > -1 ) {
			return false;
		}
		else {
			return true;
		}
	}

	function validateEmail(email) {
		var re = /[^\s@]+@[^\s@]+\.[^\s@]+/,
			valid = re.test(email.val());

		if ( valid ) {
			return valid;
		}
		else {
			email.parents('.required').addClass('error');
			return false;
		}
	}

	function validateInputs(section) {
		var text = section + ' input[type="text"]:required',
			textarea = section + ' textarea:required';

		var textInputs = $( text + ', ' + textarea ),
			selectInputs = $( section + " fieldset.required");

		var email = $(section + ' input[type="email"]');

		var textInputsFilled = validateText(textInputs),
			selectInputsChecked = validateSelects(selectInputs),
			validEmail = validateEmail(email);

		if ( section !== '#general' ) {
			validEmail = true;
		}

		if ( textInputsFilled && selectInputsChecked && validEmail ) {
			return true;
		}
	}


	// Error message feedback function

	function countRequired(section) {
		var count = $(section + ' .error').length;

		if ( count !== 0 ) {
			$('.incomplete').css('visibility', 'visible');
			$('.required_num').html(count);
		}
		else {
			$('.incomplete').css('visibility', 'hidden');
		}

		if ( count === 1 ) {
			$('.plural').hide();
		}
		else {
			$('.plural').show();
		}
	}


	// Sectional Navigation

	$('.next').on('click', function(e) {
		e.preventDefault();

		var $doc = $('html, body'),
			section = $(this).data('section'),
			next = $(this).data('nav');

		if ( validateInputs( section ) ) {
			$(section).fadeOut(300);
			$(next).fadeIn(300);

			$('.marker').removeClass('marker');
			$('.active').removeClass('active').addClass('marker');
			$('.marker').next('li').addClass('visited active');

			$doc.animate({
				scrollTop: $('.nav').offset().top - 80
			}, 300);
		}

		countRequired( section );
	});

	$('.back').on('click', function(e) {
		e.preventDefault();

		var $doc = $('html, body'),
			section = $(this).data('section'),
			back = $(this).data('nav');

		$(section).fadeOut(300);
		$(back).fadeIn(300);

		$('.active').removeClass('active');
		$('.marker').addClass('active').prev('li').addClass('marker');
		$('.marker.active').removeClass('marker');

		$doc.animate({
			scrollTop: $('.nav').offset().top - 80
		}, 300);
	});



	/*
	** Serialize form and convert to object
	*/

	function serializeObj(arr) {
		var paramObj = {};
		
		$.each( arr, function( _, kv ) {
			if ( paramObj.hasOwnProperty(kv.name) ) {
				paramObj[kv.name] = $.makeArray( paramObj[kv.name] );
				paramObj[kv.name].push( kv.value );
			}
			else {
				paramObj[kv.name] = kv.value;
			}
		});

		return paramObj;
	}


	/*
	** Fills in review form using object key:value pairs
	*/

	function populateForm(obj) {
		$.each( obj, function( name, val ) {
			var $el = $( '[name="' + name + '_review"]' ),
				type = $el.attr( 'type' );

			switch ( type ) {
				case 'checkbox':
					if ( val.constructor === Array ) {
						for ( var i = 0; i < val.length; i++ ) {
							$el.filter('[value="' + val[i] + '_review"]').attr('checked', 'checked');
						}
					}
					else {
						$el.filter('[value="' + val + '_review"]').attr('checked', 'checked');
					}
					break;

				case 'radio':
					$el.filter('[value="' + val + '"]').attr('checked', 'checked');
					break;

				default:
					$el.val(val);
			}
		});
	}

	$('.serialize-cta').on('click', function(e) {
		e.preventDefault();

		var formArr = $('.initial-form').serializeArray();
		var formObj = serializeObj(formArr);

		populateForm(formObj);
	});


	/*
	** Input error state removal on click
	** Text input error state added off focus
	*/

	$('input:required, textarea:required, label').on('click focus', function(e) {
		var section = '#' + $(this).parents('#review').attr('id') ||
                      '#' + $(this).parents('section').attr('id');

		$(this).parents('.error').removeClass('error');
		countRequired( section );
	});

	$('input:required, textarea:required').focusout( function(e) {
		e.preventDefault();

		var section = '#' + $(this).parents('#review').attr('id') ||
                      '#' + $(this).parents('section').attr('id');

		if ( $(this).val() === '' ) {
			$(this).parents('.form_input, fieldset').addClass('error');
		}
		
		countRequired( section );
	});


	/*
	** Final submission
	** Modal view interaction
	** Submit validation
	*/

	$('.close').on('click', function(e) {
		e.preventDefault();

		$('.modal').fadeOut(200);
	});

	$('.show-modal').on('click', function(e) {
		e.preventDefault();
		var section = '#review';

		if ( validateInputs( section) ) {
			$('.modal').fadeIn(200);
		}
		else {
			countRequired( section );
		}
	});

	$('.submit').on('click', function(e) {
		e.preventDefault();

		//submitForm();
		$(this).addClass('animate');

		return false;
	});
})();