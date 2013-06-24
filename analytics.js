define([
    "app",

    "backbone"
],

function( app ) {

    return Backbone.Model.extend({

        loggingEnabled: trues,

        initialize: function() {
            app.on( "all", this.onEvent, this );
            if( !window.mixpanel ){
                this.generateConsole();
            }
        },

        onEvent: function( event, args ){
            if(_.contains( this.plainEvents, event )){
                this.trackEvent (event, args);
            } else if( _.contains( this.modelEvents, event ) ) {
                this.parseModelEvent (event, args);
            } else {
                //console.log("untracked event:: ", event, args );
            }
        },

        parseModelEvent: function ( event, model ){
            var params = {};
            if( model.modelType == "frame" ){
                params.layerCount = model.layers.length;
            } else if ( model.modelType == "layer" ){
                params = {
                    type: model.get("type"),
                    source: model.get("attr").archive ?  model.get("attr").archive : "none"
                }
            } else if ( model.modelType == "sequence" ){
                params = {
                    pageCount: model.frames.length
                }
            } else if ( model.modelType == "item" ){
                params = {
                    type: model.get("media_type"),
                    source: model.get("archive") ?  model.get("archive") : "none"
                }
            }
            
            params = _.extend( params, model.eventData );

            this.trackEvent( event, params );


        },

        setGlobals: function ( args ){

            _.each(args, function (value, key){
                var param = {};
                param[ key ] = value;
                mixpanel.register( param );
            });
        },

        trackEvent: function ( event, args ){
            mixpanel.track( event, args );
        },

        plainEvents: [
        //editor
            "project_preview",
            "media_search",
            "page_added",
            "share",
           // "view_item",
            "layer_font_change",
            "toggle_help",
            "help",
            "preview_toggle_view",
            "toggle_page_background",
            "new_zeega",
            "to_profile",
            "to_home",
            "advance_toggle"
        ],

        modelEvents: [
        //editor
            "page_delete",
            "layer_added_success",
            "layer_deleted",
            "soundtrack_added_success",
            "soundtrack_delete",
            "pages_reordered",
            "layers_reordered",
            "select_link_page",
            "link_new_page",
            "unlink",
            "init_link"


        ],

        generateConsole: function(){

            var debug = this.loggingEnabled;

            window.mixpanel = {
                register: function (obj){
                    if( debug ){
                        console.log("registering global property::  " + _.keys(obj) + " : " + _.values(obj) );
                    }
                },                
                track: function ( event, params ){
                    if( debug ){
                        console.log( "tracking event:: " + event, params );
                    }
                }
            }
        }

    });

});