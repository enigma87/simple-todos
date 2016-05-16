/**
 * Created by enigma on 5/15/16.
 */

import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './task_template.js';
import './body.html';
import { Meteor } from 'meteor/meteor';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({

    tasks() {

            const instance = Template.instance();
            if (instance.state.get('hideCompleted')) {
                return Tasks.find({
                    checked: { $ne: true}
                }, {
                    sort: {
                        createdAt: -1
                    }
                });
            }
            return Tasks.find({}, {
                sort: {
                    createdAt: -1
                }
            });

        },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true }}).count();
    }
});

Template.body.events({
    'submit .new-task'(event) {
        //prevent default browser submit event
        event.preventDefault();

        //get value from form element
        const target = event.target;
        const text = target.text.value;

        Meteor.call('tasks.insert', text);

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {

        instance.state.set('hideCompleted', event.target.checked);
    },

});