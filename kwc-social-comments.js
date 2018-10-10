/**
`<kwc-social-comments>`

Comment feed for use in social media flavoured components. Add this component somewhere in your html body, or more likely embed it into another comonent.

```html
    <body>
      <kwc-social-comments></kwc-social-comments>
```
The component does not make any assumptions on how you are handling comment loading, or how they are stored by the api. Control of `loading` and `posting` states are done through attributes that can be set by any wrapper component.

This component expects a list of comment objects of the following form:
```json
{
    "type": "object",
    "properties": {
        "id": {
            "type": "string"
        },
        "author": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                },
                "avatar": {
                    "type": "string"
                },
            }
        },
        "text": {
            "type": "string"
        },
        "createdOn": {
            "type": "string"
        },
        "flags": {
            "type": "array",
            "items": {}
        },
    },
    "required" : ["id", "text", "createdOn"]
}
```

## State attributes
### Loading
This commponent can be put into a `loading` state by setting the `loaderState` property or `loader-state` attribute to `"disabled"`. This will disable the "load more" button until the state is reset to `"on"`.

If there are no more comments to load, the "load more" button can be hidden by setting the loader state to `"off"`.

### Posting
The comment input can be disabled by setting the `posting` attribute or property on the element to `true`. This can be used to prevent a user from posting a second comment whilst the first is still being sent, if this is a desired behaviour.

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icons/iron-icons.js';
import '@kano/kwc-icons/kwc-social-icons.js';
import '@kano/kwc-button/kwc-button.js';
import '@kano/kwc-style/kwc-style.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
    _template: html`
        <style>
            :host {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-justified;
                width: 100%;
            }
            :host([tombstone]) * {
                visibility: hidden;
            }
            :host([hidden]) {
                display: none !important;
            }
            .input-comment {
                @apply --layout-horizontal;
                border-bottom: 1px solid #F6F7F9;
                padding: 24px 0;
                margin: 0;
                width: 100%;
            }
            .comment-avatar {
                border-radius: 50%;
                flex: none;
                height: 40px;
                margin: 0 24px;
                overflow: hidden;
                position: relative;
                width: 40px;
            }
            .avatar {
                height: 40px;
                width: 40px;
                cursor: pointer;
            }
            .comment .avatar {
                cursor: pointer;
            }
            iron-image {
                height: 32px;
                width: 32px;
                border-radius: 50%;
            }
            .comment-form {
                @apply --layout-flex-2;
            }
            .comment-box {
                border: 1px solid #F6F7F9;
                border-radius: 3px;
                box-sizing: border-box;
                font-family: var(--font-body);
                font-size: 16px;
                line-height: 20px;
                padding: 8px 16px 8px 16px;
                width: 100%;
            }
            .comment-box:focus {
                border-color: var(--color-azure);
                outline: 0;
            }
            .comment-form-actions {
                padding: 16px 0 0 0;
            }
            .comment {
                @apply --layout-horizontal;
                @apply --layout-start;
                border-bottom: 1px solid #F6F7F9;
                padding: 24px 0;
                width: 100%;
            }
            .comment.posting {
                opacity: 0.6;
            }
            .content {
                @apply --layout-flex-2;
                font-size: 16px;
                font-family: var(--font-body);
                color: var(--color-abbey);
                max-width: 450px;
            }
            .comment-header {
                margin: 0;
            }
            .content p {
                margin: 0;
                width: 100%;
            }
            .content .date {
                font-size: 14px;
                font-family: var(--font-body);
                color: var(--color-grey);
            }
            p {
                font-family: var(--font-body);
                color: var(--color-chateau);
                font-size: 16px;
                line-height: 20px;
                word-wrap: break-word;
            }
            .comment-body {
                color: var(--color-black);
                min-height: 20px;
            }
            .comment-error {
                color: var(--color-cinnabar);
                padding-top: 8px;
            }
            .comment:hover .action.delete,
            .comment:hover .action.flag {
                visibility: visible;
            }
            .author {
                color: var(--color-kano-orange);
                cursor: pointer;
                font-weight: bold;
                margin-right: 5px;
            }
            .actions {
                @apply --layout-end;
                @apply --layout-vertical;
                flex: none;
                width: calc(15% - 40px);
            }
            .control-actions {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-end-justified;
            }
            .action:focus {
                outline: 0;
            }
            .action.delete,
            .action.flag {
                -webkit-appearance: none;
                background: transparent;
                border: 0;
                border-radius: 3px;
                color: var(--color-stone);
                cursor: pointer;
            }
            .action.delete:hover,
            .action.flag:hover {
                color: var(--color-carnation);
            }
            .action.flag.flagged {
                color: var(--color-carnation);
                visibility: visible;
            }
            .action .icon {
                height: 16px;
                width: 16px;
            }
            #retry {
                margin-top: 10px;
                line-height: 15px;
                height:25px;
            }
            iron-list {
                width: 100%;
                height: 100%
            }
            .loader {
                margin-top: 20px;
            }
            .loader[hidden] {
                display: block;
            }
            :host([loader-status="off"]) #loader {
                display: none;
            }
            :host([loader-status="disabled"]) #loader {
                background-color: var(--color-porcelain);
                color: rgba(41, 47, 53, 1);
            }
            :host([retry-button="hide"]) #retry {
                display: none;
            }
            .submit-button,
            .cancel-button {
                border: none;
                border-radius: 16px;
                height: 32px;
                padding: 0 15px;
                font-family: var(--font-body);
                font-size: 16px;
                font-weight: bold;
                transition: all 0.15s ease;
            }
            .submit-button {
                background: #F6F7F9;
            }
            .submit-button:not([disabled]) {
                color: #3F4A52;
            }
            .cancel-button {
                background: transparent;
                color: #9EA4A8;
            }
            .submit-button:focus,
            .cancel-button:focus {
                outline: none;
            }
            .submit-button:not([disabled]):hover,
            .cancel-button:hover {
                cursor: pointer;
                color: #090A0A;
            }
            .submit-button:not([disabled]):hover {
                background-color: #E5E8EC;
            }
            @media all and (max-width: 360px) {
                .comment-form-actions {
                    @apply --layout-vertical;
                    @apply --layout-start;
                    @apply --layout-start-justified;
                }
                .comment-form-actions kwc-button ~ kwc-button {
                    margin: 8px 0 0 0;
                }
            }
            @media all and (min-width: 361px) {
                .comment-form-actions {
                    @apply --layout-horizontal;
                    @apply --layout-center;
                    @apply --layout-start-justified;
                }
                .comment-form-actions kwc-button ~ kwc-button {
                    margin: 0 0 0 8px;
                }
            }
            :host *[hidden] {
                display: none;
            }
        </style>

        <div class="input-comment">
            <div class="comment-avatar">
                <iron-image class="avatar" src\$="[[_avatar]]" sizing="cover" preload="" fade=""></iron-image>
            </div>
            <form class="comment-form" on-submit="_submitComment">
                <input id="comment-input" class="comment-box" type="text" placeholder\$="[[_placeholderText]]" value="{{_comment::input}}" disabled\$="[[posting]]" on-focus="_toggleFormControls" on-keydown="_dialogKeydown">
                <!-- <div class="comment-form-actions" hidden\$="[[!_displayFormActions]]"> -->
                <div class="comment-form-actions">
                    <button class="submit-button" type="submit" on-tap="_submitComment" disabled="[[!_commentValid]]">
                        Submit
                    </button>
                    <button class="cancel-button" on-tap="_cancelComment">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        <template is="dom-repeat" items="[[comments]]" as="comment">
            <div id\$="[[comment.id]]" class\$="comment [[_computePostingClass(comment)]]">
                <div class="comment-avatar">
                    <iron-image class="avatar" src\$="[[_computeAvatar(comment.author)]]" sizing="cover" preload="" fade="" on-tap="_userTapped"></iron-image>
                </div>
                <div class="content">
                    <p class="comment-header">
                        <span class="author" on-tap="_userTapped">
                            {{comment.author.username}}
                        </span>
                        <span class="date">
                            [[_timeSince(comment.date_created, comments.*)]] ago
                        </span>
                    </p>
                    <p class="comment-body">
                        <span inner-h-t-m-l="[[_lb(comment.text)]]"></span>
                    </p>
                    <p class="comment-error" hidden\$="[[!comment.error]]">
                        [[comment.error]]
                    </p>
                </div>
                <div class="actions">
                    <div class="control-actions">
                        <template is="dom-if" if="[[_commentIsDeletable(comment.author.id, user.id, user.admin_level)]]">
                            <button type="button" class="action delete" on-tap="_deleteButtonTapped">
                                <iron-icon class="icon" icon="kwc-ui-icons:rubbish-bin"></iron-icon>
                            </button>
                        </template>
                        <button type="button" class\$="[[_computeFlagClass(comment.*)]]" on-tap="_flagButtonTapped">
                            <iron-icon class="icon" icon="kwc-social-icons:flag"></iron-icon>
                        </button>
                    </div>
                    <kwc-button id="retry" on-tap="_retryButtonTapped" hidden\$="[[!comment.error]]" type="warning" transparent="">
                        retry
                    </kwc-button>
                </div>
            </div>
        </template>
        <kwc-button class="loader" id="loader" type="secondary" on-tap="_loadMoreData">
            Load more
        </kwc-button>
    `,

    is: 'kwc-social-comments',

    properties: {
        /**
           * Computer value for avatar
           * @type {String}
           */
        _avatar: {
            type: String,
            computed: '_computeAvatar(user)'
        },
        /**
           * Current value for comment input
           * @type {String}
           */
        _comment: {
            type: String,
            value: ''
        },
        /**
           * Whethe the `_comment` is valid
           * @type {Boolean}
           */
        _commentValid: {
            type: Boolean,
            computed: '_commentIsValid(_comment)'
        },
        /**
           * Array of comment objects to render
           * @type {Array}
           */
        comments: {
            type: Array,
            value: () => {
                return [];
            },
            notify: true
        },
        /**
           * Array of comment ids where user has flagged the specific comments
           * @type {Array}
           */
        commentFlags: {
            type: Array,
            value: () => {
                return [];
            },
            notify: true
        },
        /**
           * Default Avatar to use when not provided by comment or user data
           * @type {String}
           */
        defaultAvatar: {
            type: String,
            value: 'https://s3.amazonaws.com/kano-avatars/default-avatar.svg'
        },
        /**
           * Boolean toggle to show or hide the Submit and Cancel buttons
           * on the comment input
           * @type {Boolean}
           */
        _displayFormActions: {
            type: Boolean,
            value: false
        },
        /**
           * An identifier to this comment thread, to be used in the `post-comment` event.
           * @type {String}
           */
        itemId: {
            type: String
        },
        /**
           * Value of next page of comments if using pagination.
           * @type {Number}
           */
        nextPage: {
            type: Number,
            value: 0,
            observer: '_onDataLoad'
        },
        /**
           * Text to use as placeholder. Computed on whether we have comments or not.
           * @type {String}
           */
        _placeholderText: {
            type: String,
            computed: '_computePlaceholderText(comments)'
        },
        /**
           * Atribute to indicate a comment is being posted. Will disable input.
           * @type {Boolean}
           */
        posting: {
            type: Boolean,
            value: false
        },
        /**
           * Atribute to loader status of the component.
           * Can be one of `on|off|disabled`. Will disable (disabled) or hide (off) load button.
           * @type {String}
           */
        loaderStatus: {
            type: String,
            value: 'off',
            reflectToAttribute: true
        },
        /**
           * Atribute used to hide the retry button once clicked.
           * @type {Boolean}
           */
        retryButton: {
            type: String,
            reflectToAttribute: true
        },
        /**
           * Current authenticated user.
           * @type {String}
           */
        user: {
            type: Object,
            value: () => {
                return {};
            }
        }
    },

    _dialogKeydown(e) {
        if (e.keyCode === 8) {
            e.stopPropagation();
        }
    },

    /**
     * Reset the `_comment` back to an empty String and hide the form
     * actions
     */
    _cancelComment() {
        this._comment = '';
        this._displayFormActions = false;
    },

    /** Show the Submit and Cancel buttons on the comment input */
    _toggleFormControls() {
        this._displayFormActions = true;
    },

    /**
     * Decide whether the current comment is valid
     * @param {String} comment
     * @returns {Boolean}
     */
    _commentIsValid() {
        /**
           * Prevent users trying to submit either blank comments, or,
           * equally annoying, lots of spaces.
           */
        if (!this._comment || /^ *$/.test(this._comment)) {
            return false;
        }
        return true;
    },

    _computeAvatar(user) {
        if (user) {
            return user.avatar || this.defaultAvatar;
        }
        return this.defaultAvatar;
    },

    _onDataLoad() {
        this.$.loader.disabled = false;
    },

    _loadMoreData() {
        if (!this.itemId || this.$.loader.disabled) {
            return;
        }
        this.$.loader.disabled = true;
        this.dispatchEvent(new CustomEvent('load-comment', {
            detail: {
                id: this.itemId
            }
        }));
    },

    _createDate(formatted) {
        return new Date(formatted);
    },

    /**
     * Compute whether a comment is deletable by the current user
     * – either they must have written the comment, or they must be
     * a Kano admin.
     * @param {String} commentAuthorId
     * @param {String} userId
     * @param {Number} userAdminLevel
     * @returns {Boolean}
     */
    _commentIsDeletable(commentAuthorId, userId, userAdminLevel) {
        return commentAuthorId === userId || userAdminLevel > 0;
    },

    _computeFlag(flags) {
        if (!flags || !this.user) {
            return false;
        }
        return flags.some(flag => {
            return flag.author === this.user.id;
        });
    },

    _computeCommentFlag(comment) {
        if (this.commentFlags.length === 0) {
            return false;
        }
        return this.commentFlags.some(flag => {
            return flag === comment.id;
        });
    },

    _computeFlagClass(splice) {
        const baseClass = 'action flag';
        let activeClass;
        if (splice.base.flags) {
            activeClass = this._computeFlag(splice.base.flags) ? 'flagged' : 'unflagged';
        } else {
            activeClass = this._computeCommentFlag(splice.base) ? 'flagged' : 'unflagged';
        }
        return `${baseClass} ${activeClass}`;

    },

    _computePlaceholderText(comments) {
        if (!comments || !comments.length) {
            return 'Be the first to comment';
        }
        return 'Leave a comment';
    },

    _computePostingClass(comment) {
        return `${comment.posting ? 'posting' : ''}${comment.error ? 'error' : ''}`;
    },

    _computeErrorClass(error) {
        return error ? 'error' : '';
    },

    _computeErrorState(error) {
        return error ? true : '';
    },

    /**
     * Dispatch the event to delete a comment
     * @param {Event} e
     */
    _deleteButtonTapped(e) {
        const commentId = e.model.comment.id;
        if (!commentId) {
            return;
        }
        this.dispatchEvent(new CustomEvent('delete-comment', {
            detail: {
                index: e.model.index,
                id: commentId
            }
        }));
    },

    _isHintHidden() {
        return true;
    },

    _lb(value) {
        const safeDiv = document.createElement('div');
        safeDiv.textContent = value;
        return safeDiv.innerHTML.replace(/\n/g, '<br>');
    },

    /**
    * Fired when flag icon is pressed on an individual comment.
    *
    * @event flag-comment
    * @param {string} index Index in comments array.
    * @param {string} id Id of comment as given by comment object.
    */
    _flagButtonTapped(e) {
        const index = e.model.index;
        const id = this.comments[index].id;
        let flagged;
        if (this.comments[index].flags) {
            flagged = this._computeFlag(this.comments[index].flags);
            if (flagged) {
                return;
            }
        } else {
            flagged = this._computeCommentFlag(this.comments[index]);
        }
        if (flagged) {
            e.path[1].setAttribute('class', 'action flag unflagged');
            this.dispatchEvent(new CustomEvent('unflag-comment', {
                detail: {
                    index,
                    id
                }
            }));
            return;
        }
        e.path[1].setAttribute('class', 'action flag flagged');
        this.dispatchEvent(new CustomEvent('flag-comment', {
            detail: {
                index,
                id
            }
        }));
    },

    /**
    * Fired when retry is clicked on an individual comment that has errored.
    *
    * @event post-comment
    * @param {string} value Comment text.
    * @param {boolean} retry Flag to indicate the post is a retry.
    */
    _retryButtonTapped() {
        this.set('retryButton', 'hide');
        this.dispatchEvent(new CustomEvent('post-comment', {
            detail: {
                value: this.comments[0].text,
                retry: true
            }
        }));
    },

    /**
    * Fired when new comment is submited.
    *
    * @event post-comment
    * @param {string} value Comment text.
    */
    _submitComment(e) {
        e.preventDefault();
        const input = this.$['comment-input'];
        if (this._commentValid) {
            this.retryButton = null;
            /**
                 * Hide the Submit and Cancel buttons and blur the input
                 * so that the user has to reselect (and therfore show the
                 * controls) if they want to submit another comment.
                 */
            this._displayFormActions = false;
            if (input) {
                input.blur();
            }
            this.dispatchEvent(new CustomEvent('post-comment', {
                detail: {
                    value: this._comment
                }
            }));
            this._comment = '';
        }
    },

    _timeSince(date) {
        const parsedDate = new Date(Date.parse(date));
        const seconds = Math.floor((new Date() - parsedDate) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return this.multipleCheck(interval, 'year');
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return this.multipleCheck(interval, 'month');
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return this.multipleCheck(interval, 'day');
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return this.multipleCheck(interval, 'hour');
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return this.multipleCheck(interval, 'minute');
        }
        return Math.floor(seconds) + ' seconds';
    },

    multipleCheck(interval, unit) {
        const baseDate = `${interval} ${unit}`;
        return interval === 1 ? baseDate : `${baseDate}s`;
    },

    /**
    * Fired when the user icon or name is tapped on an individual comment.
    *
    * @event view-user
    * @param {string} id provided by the `comment.author.id` property.
    */
    _userTapped(e) {
        const index = e.model.index;
        const author = this.comments[index].author;
        if (author) {
            this.dispatchEvent(new CustomEvent('view-user', {
                detail: {
                    id: author.id,
                    username: author.username
                }
            }));
        }
    }
});
