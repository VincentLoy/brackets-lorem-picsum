define(function(require, exports, module){
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"), //required
        DocumentManager = brackets.getModule("document/DocumentManager"), //required
        EditorManager = brackets.getModule("editor/EditorManager"), //required
        nodeConnection = new NodeConnection(); //required
    

    function ModalViewModel(){
        this.width = ko.observable(400);
        this.height = ko.observable(200);
        this.theme = ko.observable('nemo');
        this.image = ko.observable('1');
        
        var previewBox = $('.preview-box'); 
        //set URL
        this.url = ko.computed(function(){
            var url = 'http://lorempicsum.com/' +
                (this.theme() != 0? this.theme() : '')+ '/'+
                this.width() + '/' +
                this.height() + '/' +
                this.image();
            return url;
        }, this);
        
        
        previewBox.children("img").attr("src", this.url());

        //When preview button is clicked
        this.onPreview = _.bind(function(model, event){
            

            previewBox.empty();
            previewBox.append('<img class="placeholder-preview" src="'+ this.url() +'" />');
            
            $('.placeholder-preview').error(function(){
               previewBox.empty();
                previewBox.append('<p class="placeholder-error">This placeholder is not available for this size :(</p>');
            });

            event.stopPropagation();
        }, this);

        this.select = function(model, event){
            $(event.target).select();
            return true;
        }

        this.onUrlInsert = _.bind(function(model, event){
            var currentDoc = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                pos = editor.getCursorPos(),
                posEnd;

            currentDoc.replaceRange(this.url(), pos);
            posEnd = $.extend({}, pos);
            posEnd.ch += this.url().length;

            editor.focus();
            editor.setSelection(pos, posEnd);
        }, this);
    }
    
    module.exports = ModalViewModel;
});
