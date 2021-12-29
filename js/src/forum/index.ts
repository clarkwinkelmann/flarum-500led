import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import IndexPage from 'flarum/forum/components/IndexPage';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import TreeEmbed from './elements/TreeEmbed';
import HomePage from './components/HomePage';

customElements.define('tree-embed', TreeEmbed);

app.initializers.add('500led', () => {
    app.routes['500led'] = {
        path: '/500led',
        component: HomePage,
    };

    extend(IndexPage.prototype, 'navItems', function (items: ItemList) {
        items.add('500led', LinkButton.component({
            href: app.route('500led'),
            icon: 'fas fa-lightbulb',
        }, 'Simulator'), 150);
    });

    extend(HeaderSecondary.prototype, 'items', function (items: ItemList) {
        items.add('500led-forum', LinkButton.component({
            className: 'Button Button--link',
            href: app.route('index'),
            icon: 'fas fa-comment',
        }, 'Go to community'), 150);
    });

    extend(DiscussionListItem.prototype, 'view', function (this: DiscussionListItem, vdom: any) {
        // Only modify design when on homepage
        if (!this.attrs.params['500led-home']) {
            return;
        }

        const content = vdom.children[2]; // .DiscussionListItem-content

        // Remove reply count
        content.children.splice(3, 1);

        const {discussion} = this.attrs as any;

        let attrs: any;

        const firstPost = discussion.firstPost();

        if (firstPost) {
            const matches = (firstPost.contentHtml() as string || '').match(/<tree-embed url="([^"]+)"(?: framerate="([0-9]+)")?>/);

            if (matches) {
                attrs = {
                    url: matches[1],
                };

                if (matches[2]) {
                    attrs.framerate = parseInt(matches[2]);
                }
            }
        }

        content.children.push(m('.HomePageControls', [
            Button.component({
                className: 'Button',
                icon: 'fas fa-play',
                disabled: !attrs,
                onclick: () => {
                    this.attrs.params.playAnimation(attrs);
                },
            }, 'Play'),
            ' ',
            LinkButton.component({
                href: app.route.discussion(discussion),
                className: 'Button',
                icon: 'fas fa-comment',
            }, 'Comment'),
        ]));
    });
});
