/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, forin: true, maxerr: 50, regexp: true */
/*global Backbone, $, console, _ */

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    'use strict';

    // handle console undefined in IE
    if (typeof console === 'undefined') {
        console = {};
        console.log = function () {};
        console.error = function () {};
    }

    /**
     * Topic Model
     */
    var Topic = Backbone.Model.extend({
        defaults: {
            id: '',
            label: '-',
            selected: false,
            contentUrl: ''
        },

        isSelected: function () {
            return this.get('selected');
        },

        setSelected: function (newState) {
            this.set({ selected: newState });
        }
    });

    /**
     * View or renderer for one Topic list item on TopicListView
     */
    var TopicListItemView = Backbone.View.extend({
        tagName: "li",

        // template stated in main html
        template: _.template($('#tpl-topic-list-item').html()),

        initialize: function () {
            this.model.bind("change", this.render, this);
        },

        render: function (eventName) {
            $(this.el).html(this.template(this.model.toJSON()));
            if (this.model.isSelected()) {
                $(this.el).addClass('active');
            } else {
                $(this.el).removeClass('active');
            }
            return this;
        }
    });

    /**
     * Topic Collection, containing Read-only URL for getting the 
     * list of topics
     */
    var TopicCollection = Backbone.Collection.extend({
        model: Topic,

        // only support read only!
        url: "topics.json"
    });

    /**
     * View for TopicCollection.
     * Renders list of topics on the side bar
     */
    var TopicListView = Backbone.View.extend({
        // bind element from the main html
        el: $("#topic-list"),

        initialize: function () {
            this.model.bind("reset", this.render, this);
        },

        render: function (eventName) {
            // render every topic list item
            _.each(this.model.models, function (theTopic) {
                $(this.el).append(new TopicListItemView({
                    model: theTopic
                }).render().el);
            }, this);
            return this;
        }
    });

    /**
     * Model for loaded help content which will be displayed on the
     * main screen
     */
    var HelpContent = Backbone.Model.extend({
        defaults: {
            url: '',
            loadedContent: ''
        },

        // sets the url which will trigger the loading
        setUrl: function (newUrl) {
            this.set({ url : newUrl });
        }
    });

    /**
     * View for currently selected topic content.
     * Dynamically loads the help content and 
     * render it to the main html
     */
    var TopicContentView = Backbone.View.extend({
        // Bind element from the main html
        el: $("#mainbar"),

        initialize: function () {
            this.templateNotFound = _.template($('#tpl-topic-not-found').html());

            this.model.bind("change:url", this.loadContent, this);
            this.model.bind("change:loadedContent", this.render, this);
        },

        // load the content 
        loadContent: function (eventName) {
            // get the loaded display content
            var contentUrl = this.model.get('url');

            console.log("will load help content from %s", contentUrl);

            // dynamically load content using ajax
            if (contentUrl) {
                var self = this;
                var jqxhr = $.get(contentUrl, function (data) {
                    self.assignContent(data);
                }).error(function () {
                    self.assignContentNotFound();
                });
            } else {
                this.assignContentNotFound();
            }

            return this;
        },

        // render the loaded content
        render: function (eventName) {
            var loadedContent = this.model.get('loadedContent');
            $(this.el).html(loadedContent);

            return this;
        },

        // Assign the loaded content to the model
        // This will trigger render
        assignContent: function (content) {
            this.model.set({ loadedContent: content });
        },

        // assign error message when help topic not found 
        assignContentNotFound: function () {
            this.assignContent(this.templateNotFound());
        }
    });

    /**
     * The main App/Router for handling direct linking and
     * main application
     */
    var AppRouter = Backbone.Router.extend({
        initialize: function () {
            console.log('init router');

            // init topic list
            this.topicList = new TopicCollection();
            this.topicListView = new TopicListView({
                model: this.topicList
            });

            // init content displayer, show empty content
            this.selectedTopic = new Topic();
            this.loadedHelpContent = new HelpContent();
            this.topicContentView = new TopicContentView({
                model: this.loadedHelpContent
            });

            // flag to indicate topic list has been loaded
            this.hasLoadedTopicList = false;
        },

        routes: {
            "": "showWelcome",
            ":id": "showTopic"
        },

        // loads list of available topics 
        loadTopicList: function (id) {
            console.log('loadTopicList(' + id + ')');

            // fetch and render
            var self = this;
            this.topicList.fetch({
                success: function (model) {
                    self.hasLoadedTopicList = true;

                    if (model.length === 0) {
                        self.showLoadError();
                    } else if (id) {
                        self.showTopic(id);
                    }
                },
                error: function () {
                    self.showLoadError();
                }
            });
        },

        // show error message on failed loading topic list
        showLoadError: function (error) {
            console.error('Error in loading help topics');

            // TODO show error message in topic list?
            this.topicContentView.assignContentNotFound();
        },

        // shows default help message
        showWelcome: function () {
            this.showTopic(-1);
        },

        // trigger when selecting or direct-linking to a specific topic
        showTopic: function (id) {
            if (!this.hasLoadedTopicList) {
                this.loadTopicList(id);
            } else {
                console.log('show topic \'%s\'', id);

                // unselect previously selected
                if (this.selectedTopic.isSelected()) {
                    this.selectedTopic.setSelected(false);
                }

                // TODO show loading animation?

                // check if it's -1 (special case for auto-select the first topic)
                if (id === -1) {
                    // get the first topic
                    var firstTopic = this.topicList.at(0);
                    if (firstTopic) {
                        id = firstTopic.id;
                        
                        console.log('will show the first topic \'%s\'', id);
                    } else {
                        //  Error on topic not found
                        console.error('Error! cannot get the first topic!');
                        this.topicContentView.assignContentNotFound();
                        return;
                    }
                }

                // get the selected content
                var selectedContent = this.topicList.get(id);
                if (selectedContent) {
                    // show on view                                            
                    this.loadedHelpContent.setUrl(selectedContent.get('contentUrl'));

                    // select content
                    selectedContent.setSelected(true);
                    this.selectedTopic = selectedContent;
                } else {
                    //  Error on topic not found
                    console.error('Error! content \'%s\' not found', id);

                    this.topicContentView.assignContentNotFound();
                }
            }
        }
    });

    var app = new AppRouter();

    console.log('starting AppRouter');
    Backbone.history.start();
});
