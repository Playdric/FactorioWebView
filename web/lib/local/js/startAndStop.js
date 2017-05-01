$( function() {
    $.widget("custom.startAndStop", {
        options: {
            startUrl: null,
            stopUrl: null,
            restartUrl: null,
            savesUrl: null
        },

        _create: function () {
            this._on(this.element.find('#start'), {
                click: "start"
            });
            this._on(this.element.find('#restart'), {
                click: "restart"
            });
            this._on(this.element.find('#stop'), {
                click: "stop"
            });
            this._refresh();
        },

        _refresh: function () {
            this._saves();
            this._trigger("change");
        },

        start: function (saveName) {
            if (request == null) {
                var confirmation = true;
                if (saveName != undefined && saveName != null) {
                    var datas = {savename: saveName};
                    confirmation = confirm("Attention, ceci va redémarrer le serveur !\nVoulez-vous vraiment continuer?");
                }
                if (confirmation == true) {
                    var urlRequest = this.options.startUrl;
                    var current = this;
                    $('.inner.start').parent().find('.icon i').hide();
                    $('.inner.start').css('background-image', 'url(\'/lib/local/img/reload-white.gif\')');
                    request = $.ajax({
                        url: urlRequest,
                        type: 'GET',
                        data: datas,
                        dataType: 'json',
                        success: function (result) {
                            if (result['done'] == true) {
                                if (saveName != undefined && saveName != null) {
                                    popupMe('Sauvegarde chargée avec succès');
                                } else
                                    popupMe('Serveur démarré avec succès');
                            } else {
                                popupMe(result['answer']);
                            }
                        },

                        error: function (result) {
                            popupMe('An error as occured, please try again later');
                        },

                        complete: function (result) {
                            $('.inner.start').css('background-image', 'none');
                            $('.inner.start').parent().find('.icon i').show();
                            request = null;
                            current._refresh();
                        }
                    });
                }
            }
        },

        stop: function (event) {
            if (request == null) {
                var urlRequest = this.options.stopUrl;
                var current = this;
                $('.inner.stop').parent().find('.icon i').hide();
                $('.inner.stop').css('background-image', 'url(\'/lib/local/img/reload-white.gif\')');
                request = $.ajax({
                    url: urlRequest,
                    type: 'GET',
                    dataType: 'json',
                    success: function (result) {
                        if (result['done'] == true) {
                            popupMe('Serveur arrêté avec succès');
                        } else {
                            popupMe(result['answer']);
                        }
                    },

                    error: function (result) {
                        popupMe('An error as occured, please try again later');
                    },

                    complete: function (result) {
                        $('.inner.stop').css('background-image', 'none');
                        $('.inner.stop').parent().find('.icon i').show();
                        request = null;
                        current._refresh();
                    }
                });
            }
        },

        restart: function (event) {
            if (request == null) {
                var urlRequest = this.options.restartUrl;
                var current = this;
                $('.inner.restart').parent().find('.icon i').hide();
                $('.inner.restart').css('background-image', 'url(\'/lib/local/img/reload-white.gif\')');
                request = $.ajax({
                    url: urlRequest,
                    type: 'GET',
                    dataType: 'json',
                    success: function (result) {
                        if (result['done'] == true) {
                            popupMe('Serveur redémarré avec succès');
                        } else {
                            popupMe(result['answer']);
                        }
                    },

                    error: function (result) {
                        popupMe('An error as occured, please try again later');
                    },

                    complete: function (result) {
                        $('.inner.restart').css('background-image', 'none');
                        $('.inner.restart').parent().find('.icon i').show();
                        request = null;
                        current._refresh();
                    }
                });
            }
        },

        _saves: function() {
            if (request == null) {
                var urlRequest = this.options.savesUrl;
                $('#saves-title i').hide();
                $('#saves-title').css('background-image', 'url(\'/lib/local/img/load-tiny.gif\')');
                request = $.ajax({
                    url: urlRequest,
                    type: 'GET',
                    dataType: 'json',
                    success: function (result) {
                        if (result['done'] == true) {
                            var content = '';
                            $.each(result['saves'], function (index, value) {
                                content += '<tr>\
                                <td>' + value['name'] + '</td>\
                                <td><span class="label label-success">' + value['time'] + '</span></td>\
                                <td><span class="label label-info" id="' + value['name'] + '">Charger</span></td>\
                            </tr>'
                            });
                            $('#saves').html(content);
                        }
                    },

                    error: function (result) {
                    },

                    complete: function (result) {
                        $('#saves-title').css('background-image', 'none');
                        $('#saves-title i').show();
                        request = null;
                    }
                });
            }
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