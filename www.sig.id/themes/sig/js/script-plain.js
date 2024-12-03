$(document).ready(function () {
    $('img[usemap]').rwdImageMaps();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    if($("#share-links").length){
        $("#share-links").jsSocials({
            showLabel: false,
            showCount: false,
            shareIn: "popup",
            shares: [{
                    share: "facebook",
                    logo: "fab fa-facebook",
                },{
                    share: "twitter",
                    logo: "fab fa-twitter",
                },{
                    share: "linkedin",
                    logo: "fab fa-linkedin",
                },{
                    share: "email",
                    logo: "fa fa-at",
                },
            ]
        });
    }


    $(".dropdown-item").click(function(){
        $("#select-value").html($(this).attr("data-year"));
    });







    // if($('.stock-information').length){
    //     alert('ok');

    // }





    var showError = function (message) {
        $('.contact-error-message').html(message).show();
        $('.contact-success-message').hide();
    }

    var showSuccess = function (message) {
        $('.contact-success-message').html(message).show();
        $('.contact-error-message').hide();
    }

    var handleError = function (data) {
        if (typeof (data.errors) !== 'undefined' && data.errors.length) {
            handleValidationError(data.errors);
        } else {
            if (typeof (data.responseJSON) !== 'undefined') {
                if (typeof (data.responseJSON.errors) !== 'undefined') {
                    if (data.status === 422) {
                        handleValidationError(data.responseJSON.errors);
                    }
                } else if (typeof (data.responseJSON.message) !== 'undefined') {
                    showError(data.responseJSON.message);
                } else {
                    $.each(data.responseJSON, (index, el) => {
                        $.each(el, (key, item) => {
                            showError(item);
                        });
                    });
                }
            } else {
                showError(data.statusText);
            }
        }
    }

    var handleValidationError = function (errors) {
        let message = '';
        $.each(errors, (index, item) => {
            if (message !== '') {
                message += '<br />';
            }
            message += item;
        });
        showError(message);
    }


    $(document).on('click', '.calculator-form button[type=submit]', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $.ajax({
            type: 'POST',
            cache: false,
            url: $(this).closest('form').prop('action'),
            data: new FormData($(this).closest('form')[0]),
            contentType: false,
            processData: false,
            success: res => {
                if (!res.error) {

                    showSuccess(res.message);
                    $.each(res.data, (key, item) => {
                       $('#' + key).text(item);
                    });

                    // indicator
                    if(parseFloat(res.data.chg_percent) > 0){
                        $('.indicator').removeClass('red');
                        $('.indicator').addClass('green');
                    }
                    else {
                        $('.indicator').removeClass('green');
                        $('.indicator').addClass('red');
                    }
                } else {
                    showError(res.message);
                }

                $(this).removeClass('button-loading');

                if (typeof refreshRecaptcha !== 'undefined') {
                    refreshRecaptcha();
                }
            },
            error: res => {
                if (typeof refreshRecaptcha !== 'undefined') {
                    refreshRecaptcha();
                }
                $(this).removeClass('button-loading');
                handleError(res);
            }
        });
    });

    $('#invest_amount').on('blur', function() {
        const value = this.value.replace(/,/g, '');
        let modified_value = parseFloat(value).toLocaleString('id-ID', {
          style: 'decimal',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        });

        if(modified_value !== 'NaN'){
            this.value = modified_value;
        }
      });


    // stock
    // $("#calculator-formxxxxx").submit(function(e){
    //     e.preventDefault();

    //     var form = $(this);
    //     $.ajax({
    //         type: form.attr('method'),
    //         url: form.attr('action'),
    //         data: form.serialize(),
    //         success: function(response){
    //             Botble.showSuccess('message here');
    //         },
    //         error: function(response) {
    //             Botble.showSuccess('message here');
    //         }
    //     });

    // });

});