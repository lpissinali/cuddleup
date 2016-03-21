

$(function() {
    upgradesScroll();

    if ($('#upgradesForm').length > 0) {

        //Android upload fix
        $('.fileinput-button').click(function() {
            $('input[type=file]').click();
        });
        $('input[type=file]').click(function(e) {
            e.stopPropagation();
        });

//Min Transaction add-another

        $('.col630 #save').click(function(e) {
            $('.list-item').each(function() {
                var a = $(this).text();
                if (a.indexOf('fee') > -1) {
                    e.preventDefault();
                    $('#min-transaction-alert').fadeIn(300, function() {
                        $('#min-transaction-alert .btn-primary').unbind('click').bind('click', function() {
                            $('#min-transaction-alert').fadeOut(300);
                            $('.modal-backdrop').remove();
                        });
                    });
                    $('<div class="modal-backdrop fade in"></div>').appendTo('body');
                }
            });
            var grantTotal = parseFloat($.trim($('.grand-total .price').text().split('$')[1])),
                    maxTotal = parseFloat($.trim($('#max-ad-val').text().split('$')[1]));
            if (grantTotal > maxTotal) {
                e.preventDefault();
                $('#max-transaction-alert').fadeIn(300, function() {
                    $('#max-transaction-alert .btn-primary').unbind('click').bind('click', function() {
                        $('#max-transaction-alert').fadeOut(300);
                        $('.modal-backdrop').remove();
                    });
                });
                $('<div class="modal-backdrop fade in"></div>').appendTo('body');
            }
        });




//MASK for time-inputs
        //$.mask.definitions['t']='[AaPp]';
        //$('.auto_repost_time').mask('99:99 tM',{placeholder:" "});

        $('#upgradesForm input').blur(function() {
            $('#rcw-text-alert').hide();
            getQuote();
        });


        //AUTO REPOST
        $('#select-auto_repost input').change(function(e) {
            if ($(this).val() == 0) {
                $('#auto_repost_time_container').hide();
                $('#repost_content').fadeOut(300, function() {
                    $('#repost_help').fadeIn(300);
                });
            } else {
                $('#auto_repost_time_container').fadeIn(300);
                $('#auto_repost_time_container .time-obj-wrap:nth-child(2)').addClass('visible').fadeIn(300);
                $('.add-another').removeClass('hide');
            }

            getQuote();

            //$('#auto_repost_time_container').fadeIn(300);
        });

        if ($('#select-auto_repost .btn').not('.btn[input_value=0]').is('.active')) {
            $('#repost_help').hide();
            $('#repost_content').show();

            $('#auto_repost_time_container').show();
            if ($('.time-obj-wrap.visible').length < 8) {
                $('.add-another').removeClass('hide');
                $('#auto_repost_time_container .time-obj-wrap:nth-child(2)').addClass('visible').fadeIn(300);
                if ($('#auto_repost_time_container .time-obj-wrap:nth-child(2)').find('input').val().length == 0) {
                    $('#auto_repost_time_container .time-obj-wrap:nth-child(2)').find('input').addClass('empty-time');
                }
            }
        }

        $('#repost_help a').click(function(e) {
            e.preventDefault();
            $('#repost_help').fadeOut(300, function() {
                $('#repost_content').fadeIn(300);
            });
            $('#repost_help').parent().removeClass('ad-type_warning').addClass('ad-type_green');
        });


        $(window).load(function() {
            timeframesCheck();
        });

        $('.auto_repost_time').timepicker({
            defaultTime: false,
            minuteStep: 15,
            disableFocus: true
        })
                .on('changeTime.timepicker', function(e) {
            $(this).removeClass('invalid-val');
        })
                .on('hide.timepicker', function(e) {
            $(this).removeClass('empty-time');
            timeframesCheck();
        });

        $('.time-obj-wrap > i').click(function() {
            $(this).prev('input').focus();
        });

        $('.save-time').click(function() {
            $('.auto_repost_time').timepicker('hideWidget');
        });

//"Edit?" value when hover on time-inputs	 	
        /*
         $('.auto_repost_time').mouseenter(function(){
         var cvl = $(this).val();
         if(!$("*:focus").is(this)){
         $(this).val('Edit?');
         }
         $(this).unbind('focus').bind('focus', function(){
         $(this).val("");
         });
         $(this).unbind('mouseleave').bind('mouseleave', function(){
         if($('.time-obj-wrap.visible').length < 8){
         $('.add-another').removeClass('hide');
         }
         if($("*:focus").is(this)){
         $(this).unbind('blur').bind('blur', function(){
         if ($(this).val().length == 0){
         $(this).val(cvl);
         }
         $(this).val(checkTime($(this).val()));
         getQuote();
         });
         } else {
         $(this).val(cvl);
         }
         });
         });
         */
        /*
         function checkTime(val)
         {
         var re = new RegExp("([0-9]+)\s*(:\s*([0-9]+))?");
         var res = re.exec(val);
         
         hr = 0;
         min = 0;
         ap = 'A';
         if (res) {
         hr = res[1];
         min = res[3];
         }
         
         var re = new RegExp("(a|p)", "i");
         var res = re.exec(val);
         if (res) {
         ap = res[1];
         }
         
         if (isNaN(hr)) hr=0;
         if (isNaN(min)) min=0;
         
         if (ap=='p') ap='P';
         if (ap!='P') ap='A';
         
         if (hr>=100) { //730 -> 7:30
         min = hr % 100;
         hr = (hr-min)/100;
         }
         
         if (hr>12) {
         hr -= 12;
         ap = 'P';
         }
         
         var time_err = false;
         
         if (hr>12 || hr<0) {
         hr = 0;
         time_err = true;
         }
         
         if (min>59 || min<0) {
         min = 0;
         time_err = true;
         }
         
         if (time_err) {
         //TODO
         }
         
         if (hr<10) hr = '0' + parseInt(hr);
         if (min<10) min = '0' + parseInt(min);
         
         
         return hr + ':' + min + ' ' + ap + 'M';
         }
         */
//Hiding time-inputs
        $('.time-obj-wrap input').each(function() {
            if ($(this).val().length) {
                $(this).parents('.time-obj-wrap').addClass('visible');
            }
        });
        $('.time-obj-wrap').not('.visible').hide();
        /*
         if($('.time-obj-wrap.visible').length){
         $('#repost_help').addClass('hide');
         $('#repost_content, #auto_repost_time_container').removeClass('hide');
         }
         */

//Adding new time-inputs
        $('.add-another').click(function(e) {
            e.preventDefault();
            $('.time-obj-wrap:hidden').first().addClass('visible').fadeIn(300).find('input').addClass('empty-time');
            var lth = $('.time-obj-wrap.visible').length;
            if (lth == 8) {
                $(this).addClass('hide');
                $('.limit-reached').removeClass('hide');
            }
            timeframesCheck();
        });

//Delete time-inputs 
        $('.time-obj-wrap > a').click(function(e) {
            e.preventDefault();
            $(this).siblings('input').val('').removeClass('invalid-val empty-time');
            $(this).parent('.time-obj-wrap').removeClass('visible').fadeOut(300, function() {
                $(this).insertBefore('.add-another');
                if ($('.time-obj-wrap.visible').length == 7) {
                    $('.limit-reached').addClass('hide');
                    $('.add-another').removeClass('hide');
                }
                timeframesCheck();
            });
            if ($('.time-obj-wrap.visible').length == 0) { //last time field deleted, disable auto repost addon
                removeFromQuote('auto_repost');
                return;
            }
        });

//Right column widget
        //RIGHT COLUMN
        $('#rightcol_help a').click(function(e) {
            e.preventDefault();
            $('#rightcol_help').fadeOut(300, function() {
                $('#rightcol_content').fadeIn(300);
            });
            $('#rightcol_help').parent().removeClass('ad-type_warning').addClass('ad-type_orange');
        });

        //RCA image validation
        $('#upgradesForm').submit(function() {
            if ($('#select-right_column .btn').not('.btn[input_value="0"]').is('.active')) { //RCA selected
                if($('#upload_image').length>0 && $('#upload_image').attr('empty')==1) { //no image
                    $('#rcw-image-alert').show();
                    return false;
                }
                if ($('#rc_title').val()=='' && $('#rc_line1').val()=='' && $('#rc_line2').val()=='' && $('#rc_line3').val()=='') { //no text
                    $('#rcw-text-alert').show();
                    return false;
                }
            }
            return true;
        });


// Show post preview block 
        $('#select-right_column input').change(function(e) {
            if ($(this).val() == 0) {
                $('#rcw-image-alert').hide();
                $('#rcw-text-alert').hide();
                $('#rightcol_titles').hide();
                $('#rightcol_content').fadeOut(300, function() {
                    $('#rightcol_help').fadeIn(300);
                });
            } else {
                $('#rightcol_titles').fadeIn(300);
            }

            getQuote();
        });

        $(window).load(function() {
            if ($('#select-right_column .btn').not('.btn[input_value="0"]').is('.active')) {
                $('#rightcol_titles').show();
                $('#rightcol_help').hide();
                $('#rightcol_content').show();
            }
        });

//Selecting color theme
        $('#select-color .btn').click(function() {
            $('#select-color .btn i').remove();
            $('<i class="i-24 i_24"></i>').appendTo(this);
            setTimeout(function() {
                colorTheme();
            }, 200);
        });

        $('<i class="i-24 i_24"></i>').appendTo('#select-color .btn.active');


        $('#rcw-image-alert .btn-danger, #rcw-text-alert .btn-danger').click(function() {
            $('#select-right_column .btn[input_value="0"]').click();
        });
        $('#rcw-text-alert .btn-primary').click(function(){
            $('#rc_title').focus();
        });



//Titles in right column widget

        $('.ad-titles input').change(function() {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            var id = $(this).attr('id'),
                    vl = $(this).val(),
                    that = $('.ad-preview .' + id);
            that.text(vl);
            if (that.is('h4')) {
                that.css('color', 'yellow');
                var timeout1 = setTimeout(function() {
                    if ($('#select-color .btn:last-child').is('.active')) {
                        that.css('color', '#767676');
                    } else {
                        that.css('color', '#ffffff');
                    }
                }, 2000);
            } else {
                that.css('color', 'yellow');
                var timeout2 = setTimeout(function() {
                    that.css('color', 'inherit');
                }, 2000);
            }
        });

//Calc chars left for titles

        $('.ad-titles input').bind('keyup change', function() {
            if ($(this).is('#rc_title')) {
                $(this).attr('maxlength', '12');
                var maxVal = 12;
            } else {
                $(this).attr('maxlength', '16');
                var maxVal = 16;
            }
            var curVal = $(this).val().length;
            $(this).prev('p').find('span').text(maxVal - curVal);
        });

        $(window).load(function() {
            $('.ad-titles input').each(function() {
                if ($(this).is('#rc_title')) {
                    $(this).attr('maxlength', '12');
                    var maxVal = 12;
                } else {
                    $(this).attr('maxlength', '16');
                    var maxVal = 16;
                }
                var curVal = $(this).val().length;
                $(this).prev('p').find('span').text(maxVal - curVal);
            });
        });

// Color theme
        if ($('.page_category-region').length > 0) { //TODO
            $(window).load(function() {
                colorTheme();
            });
        }


//Bump
        if ($('#select-bumps_left .btn').not('.btn[input_value=0]').is('.active')) {
            $('#bump_help').hide();
            $('#bump_content').show();
        }

        $('#bump_help a').click(function() {
            $('#bump_help').fadeOut(300, function() {
                $('#bump_content').fadeIn(300);
            });
            $('#bump_help').parent().removeClass('ad-type_warning').addClass('ad-type_blue');
            return false;
        });

        $('#select-bumps_left input').change(function(e) {
            if ($(this).val() == 0) {
                $('#bump_content').fadeOut(300, function() {
                    $('#bump_help').fadeIn(300);
                });
            }

            getQuote();
        });

    } //upgradesForm.length
});


function colorTheme() {
    var ac = $('#select-color .btn.active').attr('input_value');
    $('.ad-box').removeClass().addClass('ad-box ad-preview add_color' + ac);
    $('#input-select-color').val(ac);
}
;

//POST AD
function getQuote()
{
    var url = $("form#upgradesForm").attr('quoteUrl');
    var data = {};
    $("form#upgradesForm input").not('.invalid-val').each(function()
    {
        if ($(this).attr('type')!="radio" || $(this).prop('checked')) {
            data[$(this).attr('name')] = $(this).val();
        }
    });
    console.log(data);

    //yellow highlighting
    var oldData = [];
    var newData = [];

    $('.list-item').not('.grand-total, #item-ad').each(function() {
        var item = $(this).attr('id');
        var itemVal = parseFloat($.trim($(this).find('.price').text().split('$')[1]));
        oldData[item] = itemVal;
    });

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        async: true,
        success: function(resp) {
            $('#quote_box').html(resp);
            upgradesScroll();
            var grantTotal = parseFloat($.trim($('.grand-total .price').text().split('$')[1])),
                    maxTotal = parseFloat($.trim($('#max-ad-val').text().split('$')[1]));
            if (grantTotal > maxTotal) {
                $('.grand-total .price').css('color', '#ff563f');
            } else {
                $('.grand-total .price').css('color', '#FCFCF8');
            }
            $('.list-item').not('.grand-total, #item-ad').each(function() {
                var item = $(this).attr('id');
                var itemVal = parseFloat($.trim($(this).find('.price').text().split('$')[1]));
                newData[item] = itemVal;
                if (oldData[item] != newData[item]) {
                    clearTimeout(timeout);
                    var obj = $(this);
                    obj.addClass('highlighted');
                    ;
                    var timeout = setTimeout(function() {
                        obj.removeClass('highlighted');
                    }, 2000);
                }
            });

        },
        dataType: 'html'});

    return true;

}

function removeFromQuote(key)
{
    button = $('#select-' + key + ' label[input_value="0"]');
    if (button.length > 0) {
        button.click();
    } else {
        removeFromQuoteConfirmation(key, 1);
    }
}

function removeFromQuoteConfirmation(key, smallBox)
{
    var url = removeUrl;
    var data = {remove: key, smallbox: smallBox};
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        async: true,
        success: function(resp) {
            $('#quote_box').html(resp);
            if (qb2 = $('#quote_box2'))
                qb2.html(resp);
            upgradesScroll();
        },
        dataType: 'html'});
    return true;
}

function timeframesCheck() {
    $.when($('.auto_repost_time:visible').not('.empty-time').each(function() {
        var el = $(this),
                tval = el.val();
        el.addClass('checked');
        var i = 0;
        $.when($('.auto_repost_time:visible').not('.checked, .empty-time').each(function() {
            var sval = $(this).val();
            if (tval.match(sval) && tval.length == sval.length)
                i++;
        })).done(function() {
            if (i > 0) {
                el.addClass('invalid-val');
            } else {
                el.removeClass('invalid-val');
            }

        });
    })).done(function() {
        getQuote();
        $('.auto_repost_time').removeClass('checked');
    });
}

//Upgrades scroll
function upgradesScroll() {
    if ($(window).width() > 1024 && $('.col305fr #quote_box').length > 0) {
        var parEl = $('.col305fr #quote_box'),
                El = $('.col305fr #quote_box .manage-updates-sidebar'),
                sidebW = parEl.width(),
                sidebH = El.height(),
                colH = $('#upgradesForm .col630').height(),
                colOff = $('#upgradesForm .col630').offset().top,
                sidebOff = parEl.offset().top - 20;
        El.css('width', sidebW);
        $(window).scroll(function() {
            sidebarPosition();
        });
        function sidebarPosition() {
            if ($(this).scrollTop() > sidebOff && $(this).scrollTop() < (colOff + colH - sidebH)) {
                El.css({'top': '20px', 'bottom': 'auto', 'position': 'fixed'});
            } else if ($(this).scrollTop() >= (colOff + colH - sidebH)) {
                El.css({'top': 'auto', 'bottom': '-20px', 'position': 'absolute'});
            } else {
                El.css('position', 'static');
            }
        }
        sidebarPosition();
    }
}