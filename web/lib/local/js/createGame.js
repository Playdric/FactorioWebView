$( function() {
    $.widget("custom.createGame", {
        options: {
            createUrl: null
        },

        _create: function () {
            this._on(this.element, {
                click: "create"
            });

            this._refresh();
        },

        _refresh: function () {
            this.saves();
            this._trigger("change");
        },

        create: function (event) {
            var saveName = $('#savename-input').val();
            var urlRequest = this.options.createUrl;
            var current = this;
            $.ajax({
                url: urlRequest,
                data: {savename: saveName},
                type: 'GET',
                dataType: 'json',
                success: function (result) {
                    if (result['done'] == true) {
                        popupMe('Partie créée avec succès');
                    } else {
                        popupMe(result['answer']);
                    }
                },

                error: function (result) {
                    popupMe('An error as occured, please try again later');
                },

                complete: function (result) {
                    current._refresh();
                }
            });
        },

        saves: function(urlRequest) {
            console.log('ok');
            if (urlRequest === undefined)
                urlRequest = this.options.savesUrl;
            $('#saves-title i').hide();
            $('#saves-title').css('background-image', 'url(\'/lib/local/img/load-tiny.gif\')');
            $.ajax({
                url: urlRequest,
                type: 'GET',
                dataType: 'json',
                success: function (result) {
                    if (result['done'] == true) {
                        var content = '';
                        $.each(result['saves'], function(index, value) {
                            content += '<tr>\
                                <td>' + value['name'] + '</td>\
                                <td><span class="label label-success">' + value['time'] + '</span></td>\
                            </tr>'
                        });
                        $('#saves').html(content);
                    }
                },

                error: function (result) {
                },

                complete: function (result) {
                    setTimeout(function(){
                        $('#saves-title').css('background-image', 'none');
                        $('#saves-title i').show();
                    }, 2000);
                }
            });
        },

        _destroy: function () {
        },

        _setOptions: function () {
            this._superApply(arguments);
            this._refresh();
        },

        _setOption: function (key, value) {
            this._super(key, value);
        }
    });
});