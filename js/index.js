const directory = "assets/index/";

$(document).keypress((e) => {
   if (e.which == 13 && $('.modal-open').length) {
       if ($('#tab-1').is(':checked')) {
           checkEmptyLoginInputs($('#emailLogin'), $('#passLogin'));
       } else if ($('#tab-2').is(':checked')) {
           checkEmptyLoginInputs($('#emailSignUp'), $('#passSignUp'));
       } else if ($('#sendNewPass').length) {
           forgotEmailCheck();
       }
   }
});

$('span.change-quant').on('click', changeQuantity);
$('div.box').on('click', function () {
    changeQuantity();
    checkMaintenance($(this));
});

$('#attractionModal').on('show.bs.modal', function (event) {
    const box = $(event.relatedTarget);
    const name = box.data('name');
    const quantity = box.data('quantity');
    const id = box.attr('id');
    const modal = $(this);
    modal.find('.modal-title').text(name);
    $('#ticket-counter').text(quantity);
    $('#attrid').attr('src', 'img/' + id + '.png');
});

$('body')
    .on('click', 'a.login-link', function () {
    const modalBody = $('#loginBody');
    const loginText = "Log in";
    this.text == loginText ? modalBody.load(directory + "login.html") : modalBody.load(directory + "signup.html");
    })

    .on('click', 'a.forgot-link', function () {
        const modalBody = $('#loginBody');
        const forgotText = "Forgot Password?";
        this.text == forgotText ? modalBody.load(directory + "login_forgot_password.html") : modalBody.load(directory + "login.html");
    })

    .on('click', '#sendNewPass', forgotEmailCheck)

    .on('click', '#logInButton', () => checkEmptyLoginInputs($('#emailLogin'), $('#passLogin')))

    .on('click', '#signUpButton', () => checkEmptyLoginInputs($('#emailSignUp'), $('#passSignUp')))

    .on('keydown', '#emailLogin', emailWarningRemove)
    .on('keydown', '#emailSignUp', emailWarningRemove)
    .on('keydown', '#passSignUp', emailWarningRemove)
    .on('click', 'label', emailWarningRemove)

    .on('click', '.btn-footer-buy', function () {
        (!($('.avatar-img').length)) ? openLoginWindow() : animatePicture($(this));
        const menuSpan = $('.menu-span');
        const oldCartCount = parseInt(menuSpan.text());
        const thisOrderCount = parseInt($('#ticket-counter').text());
        menuSpan.text(oldCartCount + thisOrderCount);
    })

    .on('click', '#testEmpty', function () {
    const menu = $('#menutest');
    const testText = "test (profile)";
    if (this.text == testText) {
        menu.load(directory + "test_profile.html");
        this.text = "test (login)";
    } else {
        menu.load(directory + "test_login.html");
        this.text = testText;
    }
    });

$(function () {
    $('.box').each(function () {
        $(this).find('.box-icon').css('background-image', 'url(img/attr' + this.id.substr(4) + '.png)');
    });
});

function animatePicture(btn) {
    if ($(window).width() >= 992){
        $('#attractionModal').modal('hide');
        const img = $(btn).parent().parent().find('img');
        const avatar = $('.avatar-img');
        const imgClone = img.clone()
            .offset({
                top: img.offset().top,
                left: img.offset().left
            })
            .addClass('image-transition')
            .appendTo($('body'))
            .animate({
                'top': avatar.offset().top + 15,
                'left': avatar.offset().left + 15,
                'width': 75,
                'height': 75
            }, 1000);
        imgClone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach();
        });
    } else {
        const btnCopy = $(btn).clone();
        $('.modal-footer')
            .html('<p class="text-center">Item added to your cart!</p>');
        setTimeout(function () {
            $('#attractionModal').modal('hide');
            setTimeout(function () {
                $('.modal-footer').html(btnCopy);
            }, 200);
        }, 1000);
    }
}

function changeQuantity() {
    const quantity = $('#ticket-counter');
    const sumPrice = $('#price');
    let ticketCounter = parseInt(quantity.text(), 10);
    const how = ($(this).data('how')) ? $(this).data('how') : '';

    if (how === 'down') {
        (ticketCounter > 1) ? ticketCounter -= 1 : ticketCounter = 1;
    } else if (how === 'up') {
        ticketCounter += 1;
    } else ticketCounter = 1;
    quantity.text(ticketCounter);
    sumPrice.text((ticketCounter * parseFloat(sumPrice.data('price'))).toFixed(2));
}

function checkEmptyLoginInputs(input, pass) {
    if (!input.val().isEmptyString()) {
        if (input.val().isTrueEmail() && !(pass.val().isEmptyString())) {
            if (pass.attr('id') == 'passSignUp') {
                checkPasswords(pass, $('#confirmPassSignUp'))
            } else {
                window.location = 'index.html';
            }
        } else {
            $('.log-in-htm').after('<p class="text-warning incorrect-email-text">Incorrect Email or empty password!</p>');
            input.val('');
            pass.val('');
            input.attr('placeholder', '');
        }
    } else {
        input.attr('placeholder', 'Write your E-Mail!');
        emailWarningRemove();
    }
}

function checkMaintenance(box) {
    const flag = !!(box.data('maintenance'));
    const buyButton = $('.btn-footer-buy');
    $('.maintenance-text').toggleClass('no-display', !flag);
    buyButton.prop('disabled', flag);
}

function checkPasswords(field1, field2) {
    const inspect = (field1.val() == field2.val());
    if (inspect) {
        window.location = 'index.html';
    } else {
        $('.log-in-htm').after('<p class="text-warning incorrect-email-text incorrect-pass-confirm">Incorrect password confirmation</p>');
        field1.val('');
        field2.val('');
    }
}

function emailWarningRemove() {
    $('.incorrect-email-text').remove();
}

function forgotEmailCheck() {
    const input = $('#emailForgot');
    if (!input.val().isEmptyString()) {
        if (input.val().isTrueEmail()) {
            $('.login-form').html('<p class="check-email-text">Message sent!<br>Check your E-Mail.</p>');
        } else {
            $('#forgot-text').after('<p class="text-warning"><br>Incorrect Email address!</p>')
        }
    } else {
        input.attr('placeholder', 'Write your E-Mail!');
    }
}

function openLoginWindow() {
    $('#attractionModal').modal('hide');
    $('#loginBody').load(directory + "login.html");
    $('#openModal').modal('show');
}