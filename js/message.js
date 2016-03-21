var messageTimeout;
var updateInterval;
var lastMessage = 0;
var maxMessage = 0;
var prevMessage = 0
var to = 0;
var deleteChatTo = 0;
var deleteChatUrl;

$(function() {
    if ($('.message-count').length>0) {
        updateInterval = setInterval('loadMessages()', ($('#messageForm').length == 0) ? 90000 : 15000);
    }

    if ($('#messageForm').length==0) return;

        //modal calculate viewport
        $('#message-list').on('shown.bs.modal', function(e) {
            var height = $(window).height() - 184;
            $(this).find('.modal-body').css('height', height + 'px');
        });

        $('#message-list').on('hidden.bs.modal', function(e) {
            location.hash = '';
            to = 0;
            $('#messages').html('');
            prevMessage = 0;
            maxMessage = 0;
            selectUser();
        });

        $('#prev-messages').click(function(e) {
            e.preventDefault();

            if (!prevMessage) return false;
            maxMessage = prevMessage;

            $(this).parent().hide();
            $('#prev-messages-preloader').show();
        });

        $(window).on('orientationchange', function(e) {
            var height = $(window).height() - 184;
            $('#message-list .modal-body').css('height', height + 'px');
        });


        //desktop events
        if ($('#list-messages').hasClass('desktop')) {
            //toggle messages list for desktop
            $('a.show-messages').click(function () {
                location.hash = '';
                to = 0;
                $('#messages').html('');
                prevMessage = 0;
                maxMessage = 0;
                selectUser();
                $('body').removeAttr('id');
                $('#message-list').addClass('hidden');
                $('#list-messages').removeClass('hidden');
            });

            $('a.user-block').click(function (e) {
                $('a.show-messages').click();
            });
            $('a.share-photos').click(function (e) {
                setTimeout(loadMessages, 500);
            });
        }



        bindMessageListEvents(); //no setZeroTimeout here!

        changeTitle(parseInt($('.message-count').first().text()));
    /*
    $('#messages-update').click(function(e) {
        e.preventDefault();
        $('.label.label-blue').fadeOut(500); //remove 'new' markers
        loadMessages();
    });
    */


/*
        if (lastMessage==0) { //no messages
            $('#reply').modal();
        }
*/

        if (location.hash.length>1) {
            var newTo = parseInt(location.hash.substr(1));
            if (newTo>0) {
                var existing = $('.user-link[to=' + newTo + ']');
                if (existing.length>0) {
                    existing.click();
                } else {
                    to = newTo;
                    lastMessage = 0;
                    $('#to').val(to);
                    $('#messages').html('');

                    if ($('#list-messages').hasClass('desktop')) {
                        $('#message-list').removeClass('hidden');
                        $('#list-messages').addClass('hidden');
                        $('body').attr('id','message-page');
                    } else {
                        $('#message-list').modal('show');
                    }

                    selectUser();
                }
            }
        }

        //updateInterval = setInterval('loadMessages()',20000);

        $('#messageForm #text').keydown(function (e) {

            if (e.ctrlKey && e.keyCode == 13) {
                $('#messageForm').submit();
            }
        });


        $('#messageForm').submit(function(e) {
            e.preventDefault();

            var action = $(this).attr('action');
            var text = $('#text').val();
            var to = $('#to').val();

            if (text=='') {
                return;
            }

            //$('#reply').modal('hide');
            $('#text').val('');
            //$('#text').focus();

            $.ajax({
                type: 'POST',
                url: action,
                data: {text: text, min: lastMessage, to: to},
                async: true,
                success: handleMessageResponse,
                dataType: 'json'
            });
        });
    });

    /**
     * @param resp JSON
     */
    function handleMessageResponse(resp)
    {
        //console.log(resp);
        if (lastMessage==0 && to>0) {
            if ($('#messages .note-pink').length==0) $('#messages').html('');
            $('#prev-messages').parent().hide();
        }

        if (resp['error']) {
            $('#messages').html('<div class="note note-pink">' + resp['error'] + '</div>');
        }
        if (resp['list']) {
            $('#list-messages').html(resp['list']);
            //restore event handlers
            bindMessageListEvents();
        }
        if (resp['username']) {
            if ($('#message-username').text()!=resp['username']) {
                $('#message-username').html(resp['username']);
                $('#message-user-url').attr('href', resp['url']);
                $('#message-profile-url').attr('href', resp['url']);
                if (resp['avatar']) {
                    $('#message-avatar').html(resp['avatar']);
                } else {
                    $('#message-avatar').html('');
                }
            }

            if (resp['online']) {
                if (resp['online']===true) {
                    $('#user-online').removeClass('hide');
                    $('#user-offline').addClass('hide');
                } else {
                    $('#user-offline').text(resp['online']);
                    $('#user-online').addClass('hide');
                    $('#user-offline').removeClass('hide');
                }
            } else {
                $('#user-online').addClass('hide');
                $('#user-offline').addClass('hide');
            }
        }
        if (resp['block']) {
            if (resp['block']==1) {
                $('.user-block').attr('action', 'unblock').find('span').text('Unblock');
            } else {
                $('.user-block').attr('action', 'block').find('span').text('Block');
            }
        }
        if (resp['share']) {
            if (resp['share']==1) {
                $('.share-photos').attr('action', 'unshare').find('span').text('Hide Locked Photos');
            } else {
                $('.share-photos').attr('action', 'share').find('span').text('Share Locked Photos');
            }
        }

        if (resp['fav']) {
            if (resp['fav']==1) {
                $('.favourite-btn i').addClass('active');
            } else {
                $('.favourite-btn i').removeClass('active');
            }
        }

        if (resp['messages']) {
            var html = '';
            if (maxMessage>0) { //prepend old messages
                $('#prev-messages-preloader').hide();
                for (var i in resp['messages']) {
                    html += resp['messages'][i];
                }
                $(html).prependTo("#messages");
                maxMessage = 0;
            } else { //append new messages
                for (var i in resp['messages']) {
                    if (parseInt(i) > lastMessage) {
                        html += resp['messages'][i];
                        lastMessage = parseInt(i);
                    }
                }
                $(html).appendTo("#messages");

                if (i>0) {
                    if ($('#list-messages').hasClass('desktop')) {
                        $('html, body').animate({scrollTop: $('#messages').height()}, (lastMessage == 0) ? 10 : 1000);
                        //window.scrollTo(0, $('#messages').height()+$('#messages').offset().top);
                    } else {
                        $("#message-container").animate({scrollTop: $('#message-container')[0].scrollHeight}, (lastMessage == 0) ? 10 : 1000);
                    }

                    //clearTimeout(messageTimeout);
                    messageTimeout = setTimeout(function() {$('#messages .message-new').removeClass('message-new');}, 3000);
                }
            }
        }

        if (resp['credits']) {
            $('.credits-count').text(resp['credits']);
        }

        if (resp['count']>=0) {
            changeTitle(parseInt(resp['count']));
            if (resp['count']==0) resp['count'] = '';
            $('.message-count').text(resp['count']);
/*
            if (resp['count']>0) {
                $('.message-count').show();
            } else {
                $('.message-count').hide();
            }
*/
        }
        if (resp['unread']) {
            for (var userTo in resp['unread']) {
                var cnt = resp['unread'][userTo];
                if (cnt<=0) cnt = '';
                $('.message-unread[to=' + userTo + ']').text(cnt);
            }
        }
        if (resp['last_read'] && resp['last_read']>0) {
            $('#messages .read-marker').each(function() {
                if ($(this).attr('msg_id')<=resp['last_read']) {
                    $(this).removeClass('.read-marker').fadeIn(250);
                }
            });
        }
        if (resp['prev'] && resp['prev']>0) {
            $('#prev-messages').parent().show();
            if (resp['prev']<prevMessage || prevMessage==0) prevMessage = resp['prev'];
        }
    }

    function loadMessages()
    {
        console.log('loadMessages: ' + lastMessage);

        if (to>0) {
            //load new messages
            $.ajax({
                type: 'GET',
                url: '/message/update',
                data: {to: to, min: lastMessage, max: maxMessage},
                async: true,
                success: handleMessageResponse,
                dataType: 'json'
            });
        } else {
            if ($('#deleteMessage').hasClass('in')) return;

            //load chat list
            $.ajax({
                type: 'GET',
                url: '/message',
                data: {min: lastMessage, nolist: $('#messageForm').length==0 ? 1 : 0},
                async: true,
                success: handleMessageResponse,
                dataType: 'json'
            });

        }
    }


    function messageWink(to) {
        $.ajax({
            url: '/message/wink/to/' + to,
            async: true,
            success: handleMessageResponse,
            dataType: 'json'
        });

        $('.message-wink').fadeOut(500);

        return false;
    };

    function selectUser() {
        console.log('user=' + to);

        if (to>0) {
            $('.user-block').attr('user', to);
            $('.share-photos').attr('user', to);
            $('.favourite-btn').attr('user', to);
            $('.report-btn').attr('href', '/contact/index/user/' + to);
        }

        clearTimeout(updateInterval);
        updateInterval = setInterval('loadMessages()', (to>0) ? 3000 : 20000);
        loadMessages();
    }

    function bindMessageListEvents() {
        $('.message-expand').unbind('click').click(function (e) {
            e.preventDefault();

            var newTo = $(this).attr('to');
            if (to != newTo) {
                to = newTo;
                lastMessage = 0;
                $('#to').val(to);
            }
            //$('#text').focus();

            location.hash = to;

            selectUser();

            if ($('#list-messages').hasClass('desktop')) {
                $('body').attr('id','message-page');
                $('#message-list').removeClass('hidden');
                $('#list-messages').addClass('hidden');
            }


        });

        $('.delete-open').unbind('click').click(function (e) {
            deleteChatTo = $(this).data('to');
            deleteChatUrl = $(this).data('url');
        });

        $('.delete-sure').unbind('click').click(function (e) {
            if (!deleteChatUrl) return;

            $.ajax({
                url: deleteChatUrl,
                async: true,
                success: function () {
                    $('.item[to=' + deleteChatTo + ']').fadeOut(500);
                },
                dataType: 'json'
            });
        });
    }

    var _changeTitleEven = false;
    var _prevCount = false;
    var _audioLoaded = false;

    function changeTitle(number) {
        var title = document.title;
        title = title.replace(/^\(\(?[0-9]+\)\)? /, '');
        if (number>0) {
            _changeTitleEven = !_changeTitleEven;
            if (_changeTitleEven) {
                title = '(' + number + ') ' + title;
            } else {
                title = '((' + number + ')) ' + title;
            }

            if (_prevCount!==false && _prevCount<number) {
                playAudio();
            }
        }
        _prevCount = number;

        document.title = title;
    }

    function playAudio()
    {
        if (!_audioLoaded) {
            $("#audio").bind("load",function(){
                _audioLoaded = true;
            });
            $("#audio").trigger('load');
        }

        $("#audio").prop("currentTime",0);
        $("#audio").trigger('play');
    }
