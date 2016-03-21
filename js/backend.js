
$(function() {
    if ($( "#search-user").length>0) {
        $("#search-user").autocomplete({autoFocus: true, delay: 500, minLength: 2, source: '/backend/search'});
        $("#search-user").on("autocompleteselect", function (event, ui) {
            var frm = this.form;
            window.setTimeout(function () {
                frm.submit();
            }, 100);
        });
    }

    //approve
    $('.image-approve-user').click(function(e) {
        e.preventDefault();
        user = $(this).data('user');
        if (!user) user = userId;

        $('.image-control[data-field="approved"][data-user="' + user + '"]').each(function (e) {
            if (!$(this).prop('checked')) $(this).click();
        });
        $(this).parent().parent().parent().fadeOut();
    });

    $('.image-verify-user').click(function(e) {
        e.preventDefault();
        user = $(this).data('user');
        if (!user) user = userId;

        $.ajax({
            url: '/backend/verify',
            data: {user: user}
        });
    });

    $('.image-ban-user').click(function(e) {
        e.preventDefault();
        user = $(this).data('user');
        if (!user) user = userId;

        if (confirm('Are you sure you want to ban this user?')) {
            $.ajax({
                url: '/backend/ban',
                data: {user: user}
            });
            $(this).parentsUntil('.user').last().parent().fadeOut(500);
        }
    });


    //images
    $('.image-control').click(function(e) {
        //e.preventDefault();
        user = $(this).data('user');
        if (!user) user = userId;
        if ($(this).data('field')=='approved' && $(this).prop('checked')) {
            $(this).parent().removeClass('unapproved');
        }
        $.ajax({
            url: '/backend/image',
            data: {user: user, id: $(this).data('id'), key: $(this).data('field'),  value: $(this).prop('checked') ? 1 : 0}
        });
    });
    $('.image-delete').click(function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this image?')) {
            user = $(this).data('user');
            if (!user) user = userId;
            $.ajax({
                url: '/backend/imagedelete',
                data: {user: user, id: $(this).data('id')}
            });
            if ($('#images').length>0) {
                $(this).parentsUntil('#images').fadeOut(500);
            } else {
                $(this).parentsUntil('.edit-profile').first().parent().parent().fadeOut(500);
            }
        }
    });

    $('.list-delete').click(function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this user?')) {
            user = $(this).data('user');
            if (!user) user = userId;
            $.ajax({
                url: '/backend/listdelete',
                data: {user: user, id: $(this).data('id'), list: $(this).data('list')}
            });
            $(this).parentsUntil('.tab-pane').fadeOut(500);
        }
    });

});
