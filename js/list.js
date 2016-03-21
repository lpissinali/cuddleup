    var stopSlideWorkaround = false;
    var sliderTimeout;
    var userModalOpen = false;
    var listUrl = false;
    var userModalReopen = false;

    $(function() {

        setZeroTimeout(bindUserLink);

        $('#user-modal').on('loaded.bs.modal', function (e) {
            console.log('loaded'); //TODO: this fires 3 times
            //setZeroTimeout(bindUserLink);
            setZeroTimeout(bindUserMenuEvents);
        });
        $('#user-modal').on('shown.bs.modal', function (e) {
            console.log('shown');
        });

        $('#user-modal').on('hidden.bs.modal', function (e) {

            console.log('hidden');
            if (userModalReopen>0) {
                userModalReopen--;
                if (userModalReopen==0) {
                    console.log('reopen');
                    e.stopPropagation();
                    $('#user-modal').modal('show');
                    userModalReopen = false;
                }
                return;
            }

            userModalOpen = false;
            if (listUrl) {
                changeCustomUrl(listUrl, 'search results');
                listUrl = false;
            }
        });

        //switch grid/list
        $('#grid').click(function(){
            $('#main_list').addClass('grid');
            applyFilter('list', null, false, 'skip');
        });
        $('#list').click(function(){
            $('#main_list').removeClass('grid');
            applyFilter('list', 1, false, 'skip');
        });


        //sliders
        if ($("#slider-range").length > 0){
            $('#slider-range').slider().on('slide', function(ev) {
                $('#range span').text(ev.value);
            });
        }

        $('.filter-dist-apply').click(function(e) {

            e.preventDefault();

            $('#location-dropdown').removeClass('open');
            $('#distance-dropdown').removeClass('open');

            var value = $('#range span').text();
            var location = $('#location').val();

            if (location && location!='false') {
                $('#location-text').text(location);
            } else {
                $('#location-text').text('Your Location');
            }

            $('#dist-text').text(value);
            applyFilter('country', null, true);
            applyFilter('region', null, true);
            applyFilter('loc', location, true);
            applyFilter('dist', value, true);
            applyFilter('lat', $('#locationLat').val(), true);
            applyFilter('lon', $('#locationLon').val(), true);
            applyFilter('', '');
        });

        $('#filters-desktop').click(function(e) {
            e.preventDefault();

            $('#filters-dropdown').removeClass('open');

            //rate:
            applyFilter('rate', $('#filter-rate label.active').attr('input_value'), true);

            //age
            if ($('#age_from').attr('type')=='text') { //desktop
                applyFilter('age_from', $('#age_from').val(), true);
                applyFilter('age_to', $('#age_to').val(), true);
            } else {
                applyFilter('age_from', $('#age_from').text(), true);
                applyFilter('age_to', $('#age_to').text(), true);
            }

            //gender
            applyFilter('sex', $('#filter-sex label.active').attr('input_value'), true);

            //pictures
            applyFilter('pictures', $('#filter-pictures label.active').attr('input_value'), true);

            //online
            applyFilter('online', $('#filter-online label.active').attr('input_value'), true);

            //ethnicities
            var checkbox_filter = [];
            var sList = '';
            $('#filter-ethnicity input').each(function() {
                if ($(this).prop('checked')) {
                    sList += $(this).next().text() + ', ';
                    if ($(this).attr('input_value')!='') {
                        checkbox_filter.push($(this).attr('input_value'));
                    }
                }
            });
            //$('#ethnicity-text').text(sList.slice(0, -2));

            applyFilter('ethnicity', checkbox_filter.join(','), true);


            applyFilter('', '');
        });


        $('#filter-sort-apply').click(function() {
            $('#sort-text').text($('#filter-sort label.active').text());
            applyFilter('sort', $('#filter-sort label.active').attr('input_value'));
        });

        if ($("#slider-age").length > 0){
            $('#slider-age').slider({
                formater: function() {
                    if ($('#age_from').attr('type')=='text') { //desktop

                    } else {
                        var afrom = $('#age_from').text();
                        var ato = $('#age_to').text();

                        $('#menu-age .slider-handle:first').text(afrom);
                        $('#menu-age .slider-handle:last-child').text(ato);
                    }
                }
            }).on('slide', function(ev) {
                if (stopSlideWorkaround) retrn;

                if ($('#age_from').attr('type')=='text') { //desktop
                    $('#age_from').val(ev.value[0]);
                    $('#age_to').val(ev.value[1]);
                } else {
                    $('#menu-age .slider-handle:first').text(ev.value[0]);
                    $('#menu-age .slider-handle:last-child').text(ev.value[1]);
                }
            });

            if ($('#age_from').attr('type')=='text') { //desktop
                //change text
                $('.slide-range .form-control').change(function() {
                    var value = parseInt($(this).val());
                    var slider_control = $(this).parent().parent().find('.slider');
                    var min = slider_control.attr('data-slider-min');
                    var max = slider_control.attr('data-slider-max');
                    if (value >= max)
                        value = max;
                    if (value < min)
                        value = min;


                    //move slider
                    var val1 = parseInt($(this).parent().parent().find('.min').val());
                    var val2 = parseInt($(this).parent().parent().find('.max').val());

                    stopSlideWorkaround = true;
                    if (!val1 && !val2) {
                        slider_control.slider('setValue', value);
                    } else {
                        slider_control.slider('setValue', [val1, val2]);
                    }

                    stopSlideWorkaround = false;
                    $(this).val(value);//workaround

                    return true;


                });
            }
        }

        $('#filter-age-apply').click(function() {
            var value = $("#slider-age").val().split(/,/);

            if ($('#age_from').text()) {
                $('#age_from').text(value[0]);
                $('#age_to').text(value[1]);
            } else {
                $('#age_from').val(value[0]);
                $('#age_to').val(value[1]);
            }

            applyFilter('age_from', value[0], true);
            applyFilter('age_to', value[1], true);
            applyFilter('', '');
        });

        $('#filter-sex-apply').click(function(){
            $('#sex-text').text($('#filter-sex label.active').text());
            applyFilter('sex', $('#filter-sex label.active').attr('input_value'));
        });

        //ethnicity multi select
        $('#filter-ethnicity input').bind('click', function () {
            var par = $(this).parent().parent();
            var _this = $(this);

            setZeroTimeout(function () {
                if (_this.attr('input_value')=='') { //disable others
                    _this.prop('checked', true);
                    par.find('input').each(function() {
                        if ($(this).attr('input_value')!='' && $(this).prop('checked')) {
                            $(this).prop('checked', false);
                            //applyFilter($(this).attr('name'), 0, true);
                        }
                    });
                } else { //enable/disable 'All'
                    if (par.find('input:checked').length==0) {
                        value = true;
                    } else {
                        value = false;
                    }
                    par.find('input[input_value=""]').prop('checked', value);
                }
            });


        });

        $('#filter-ethnicity-apply').click(function(e){
            var checkbox_filter = [];
            var sList = '';
            $('#filter-ethnicity input').each(function() {
                if ($(this).prop('checked')) {
                    sList += $(this).next().text() + ', ';
                    if ($(this).attr('input_value')!='') {
                        checkbox_filter.push($(this).attr('input_value'));
                    }
                }
            });
            $('#ethnicity-text').text(sList.slice(0, -2));

            applyFilter('ethnicity', checkbox_filter.join(','));
        });


        $('#filter-rate-apply').click(function(e){
            var cntl = $('#filter-rate label.active');
            $('#rate-text').html(cntl.html());
            applyFilter('rate', cntl.attr('input_value'));
        });

        $('#filter-pictures-apply').click(function(e){
            var cntl = $('#filter-pictures label.active');
            $('#pictures-text').html(cntl.text());
            applyFilter('pictures', cntl.attr('input_value'));
        });

        $('#filter-online-apply').click(function(e){
            var cntl = $('#filter-online label.active');
            $('#online-text').html(cntl.text());
            applyFilter('online', cntl.attr('input_value'));
        });


    });

    function applyFilter(field, value, dontload, action)
    {
        var old = 'old';
        //alert(field + '=' + value);
        console.log('applyFilters: ' + field + '=' + value);
        if (field!='') {
            if (field=='age_to' && value>=70) {
                value = undefined;
            }
            if (field=='age_from' && value<=18) {
                value = undefined;
            }
            if (field=='page') {
                if (filters[field]===undefined || filters[field]<1) filters[field] = 1;
                if (!value) value = ++filters[field];
            } else {
                old = filters[field];
            }
            filters[field] = value;
        }

        if (!dontload && compareArrays(old, value)) dontload = true;

        if (/*field!='page' && */!dontload && action!='skip') {
            //clear results
            $('#main_list').html('');
            //if (field!='') filters['page'] = 1;
        }
        if (action=='replace') {
            $('#main_list').html('');
        }

        if (field!='' && (value==0 || value=='' || value==undefined)) {
            delete filters[field];
        }

        if (dontload==true) {
            return;
        }

        //console.log('applyFilter()');

        if (filters['user_id']===undefined && /*field!='' && */action!='prepend') changeUrl();

        //show preloader
        if (action!='skip') {
            $('#pagination').hide();
            $('#preloader').show();
            delete filters['noout'];
        } else {
            filters['noout'] = true;
        }


        //load new results
        $.ajax({
            type: 'POST',
            url: '/list',
            data: filters,
            async: true,
            success: function(resp) {
                if (filters['noout']) {
                    delete filters['noout'];
                    return;
                }
                if (resp!='') {
                    $('#preloader').hide();
                    if (action=='prepend') {
                        $('#main_list').prepend(resp);
                    } else {
                        $('#main_list').append(resp);
                    }
                    //lazyload();
                    setZeroTimeout(bindListEvents);

                    /*if (typeof bindMobileEvents == 'function') bindMobileEvents();
                    if($(window).width() > 1024) {

                    }*/
                }},
            dataType: 'html'});
    }

    function removeFilters(filters)
    {
        var splitFilters = filters.split(',');
        for (var i=0; i < splitFilters.length; i++) {
            applyFilter(splitFilters[i], '', true);
        }
        setZeroTimeout(populateFormFilters);
        applyFilter('');

    }

    function resetFilters()
    {
        filters2={
            lat:filters['lat'],
            lon:filters['lon'],
            loc:filters['loc']
        };
        if (filters['cuddler']) filters2['cuddler'] = 1;
        if (filters['grid']) filters2['grid'] = filters['grid'];
        filters = filters2;

        setZeroTimeout(populateFormFilters);
        applyFilter('');
    }

    function compareArrays(array1, array) {
        if (array1==array) return true;
        if (typeof array == 'undefined') return array1=='';

        var size = 0, key;

        if (array instanceof Array) { //array1 may be Array or Object
            for (key in array1) {
                if (array1[key]!=array[key]) {
                    return false;
                }
//                if (array1.hasOwnProperty(key)) size++;
                size++;
            }
        } else {
            if (!array1 && !array) return true;

            return false;
        }

        // compare lengths
        if (size != array.length) {
            return false;
        }

        return true;

    }

    function changeUrl()
    {

        var url = '/list';

        var tempfilters = jQuery.extend({}, filters);

/*
        if (tempfilters['category_id']) {
            category_code = categories[tempfilters['category_id']]['code'];
            category_name = categories[tempfilters['category_id']]['name'];
            delete tempfilters['category_id'];
            url = url + category_code + '/';
        } else {
            return;
        }

        var regions2;
        if (tempfilters['region_id']) {
            if (regions == false) {
                regions2 = regionsByProvince[provinceId];
            } else {
                regions2 = regions;
            }
            console.log(regions);
            region_code = regions2[tempfilters['region_id']]['code'];
            region_name = regions2[tempfilters['region_id']]['name'];
            delete tempfilters['region_id'];
            url = url + region_code + '/';
        } else {
            return;
        }
 */

        if (tempfilters['page']==1) {
            delete tempfilters['page'];
        }

        if (tempfilters['loc']=='' || tempfilters['loc']=='false') {
            delete tempfilters['loc'];
        }
        if (tempfilters['lat']=='' || tempfilters['lat']==0) {
            delete tempfilters['lat'];
        }
        if (tempfilters['lon']=='' || tempfilters['lon']==0) {
            delete tempfilters['lon'];
        }

        params = jQuery.param(tempfilters);
        if (params.length>0) url = url + '?' + params;

        if (location.hash) {
            url = url + location.hash;
            if ($(location.hash).length>0) {
                scrollToElement(location.hash, 300);
            }
        }

        console.log('Changeurl: ' + url);


        var title = 'Search Results - CuddleUp';
        if (tempfilters['loc']) {
            title = tempfilters['loc'] + ' - CuddleUp';
        }
        document.title = title;

        if (typeof window.history.pushState != 'undefined') {
            window.history.pushState(filters, title, url);
        }


        if (params['loc']) {
            document.title += ' | ' + params['loc'];
        }

        if (typeof _gaq!='undefined') {
            var grid = tempfilters['grid'];
            if (!grid) grid = 0;
            //_gaq.push(['_setCustomVar',3,'Filters',grid,3]);
            //_gaq.push(['_trackPageview', url]);
        }

    }

    function bindImageHoverEvents()
    {
        $(document.body).on('mouseenter', '#main_list:not(.block) .img', function() {
            var large = $(this).find('.img-large img');
            if (large) {
                var orig = large.data('original');
                if (orig) {
                    large.attr('src', orig);
                }
            }
        });
        /*
        $('#main_list').parent().on('mouseleave', '.list:not(.block) img', function() {
            $('.thumb-large').remove();
        });*/
    }

    function bindUserLink() {
        if ($('#user-modal').length>0) {

            $(document.body).on('click', 'a.user-link', function (e) {
                e.preventDefault();

                var username = $(this).data('username');
                var url = $(this).attr('href');

                userModalOpen = username;
                if (!listUrl) {
                    listUrl = location.href;
                }
                changeCustomUrl(url, username);

                $('#user-modal-username').text(username);

                $('#user-modal .modal-content').html('');
                $('#user-modal').removeData('bs.modal');
                $('#user-modal').modal({remote: url, show: true});
                //$('#user-modal').modal('show');

            });
        }
    }


    function populateFormFilters()
    {
        if ($('#filters-desktop').length==0) return; //not required in mobile mode

        //rate
        if (filters['rate']) {
            rate = filters['rate'];
        } else {
            rate = '';
        }
        $('#filter-rate label.active').removeClass("active");
        $('#filter-rate label[input_value="' + rate + '"]').addClass('active');

        //sex
        if (filters['sex']) {
            sex = filters['sex'];
        } else {
            sex = '';
        }
        $('#filter-sex label.active').removeClass("active");
        $('#filter-sex label[input_value="' + sex + '"]').addClass('active');

        //pictures
        if (filters['pictures']) {
            pictures = filters['pictures'];
        } else {
            pictures = '';
        }
        $('#filter-pictures label.active').removeClass("active");
        $('#filter-pictures label[input_value="' + pictures + '"]').addClass('active');

        //pictures
        if (filters['online']) {
            online = filters['online'];
        } else {
            online = '';
        }
        $('#filter-online label.active').removeClass("active");
        $('#filter-online label[input_value="' + online + '"]').addClass('active');




        //age
        var changed = false;
        if (filters['age_from'] && filters['age_from']>18) {
            var val = filters['age_from'];
        } else {
            var val = '18';
        }
        if (val!=$('#age_from').val()) changed = true;
        if ($('#age_from').attr('type')=='text') { //desktop
            $('#age_from').val(val);
        } else {
            $('#menu-age .slider-handle:first').text(val);
        }


        if (filters['age_to'] && filters['age_to']<70) {
            var val2 = filters['age_to'];
        } else {
            var val2 = '70';
        }
        if (val2!=$('#age_to').val()) changed = true;
        if ($('#age_to').attr('type')=='text') { //desktop
            $('#age_to').val(val2);
        } else {
            $('#menu-age .slider-handle:last-child').text(val2);
        }

        //move sliders
        if (changed) {
            var slider_control = $('#slider-age');
            stopSlideWorkaround = true;
            slider_control.slider('setValue', [parseInt(val), parseInt(val2)]);
            stopSlideWorkaround = false;
        }

        //ethnicity
        var checked = false;
        if (filters['ethnicity']) {
            var eth = filters['ethnicity'].split(/,/);
        } else {
            var eth = [];
        }

        //uncheck all
        $('#filter-ethnicity input').each(function() {
            $(this).prop('checked', false);
        });

        for(key in eth) {
            ethnicity_id = parseInt(eth[key]);
            if (ethnicity_id>0) {
                checked = true;

                $('#ethnicity' + ethnicity_id).prop('checked', true);
            }
        }
        if (!checked) {
            $('#ethnicity0').prop('checked', true);
        }

    }

    function lazyload() {
        return true;
        setZeroTimeout(function lazy() {
            $("img.lazy").unbind().lazyload({threshold: 200}).bind('load', function(e) {
                $(this).removeClass('lazy')
            });
        });
    }

    function setPagination()
    {
        $('#main_list').on('click', 'a.page-link', function(e) {
            e.preventDefault();
            applyFilter('page', $(this).data('page'));
        });

    }