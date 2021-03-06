import Page from 'flarum/common/components/Page';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';
import Link from 'flarum/common/components/Link';
import TreeState from '../states/Tree';
import Sequence from '../states/Sequence';
import AnimationList from '../states/AnimationList';
import Player from './Player';
import URLPlayer from './URLPlayer';

export default class HomePage extends Page {
    tree: TreeState = new TreeState()
    sequence: Sequence = new Sequence('')
    urlAttrs: any = null
    uniqueKey: number = 1
    list!: AnimationList

    oninit(vnode) {
        super.oninit(vnode);

        this.bodyClass = 'HomePageBody';

        this.list = new AnimationList(this.playAnimation.bind(this));
        this.list.loadNext();
    }

    playAnimation(attrs: { url: string, framerate?: number }) {
        this.urlAttrs = attrs;
        this.uniqueKey++;
    }

    view() {
        return m('.HomePage', [
            WelcomeHero.component(),
            m('.container', [
                m('.HomePagePlayer', this.urlAttrs ? m(URLPlayer, {
                    key: this.uniqueKey,
                    url: this.urlAttrs.url,
                    framerate: this.urlAttrs.framerate,
                }) : m(Player, {
                    key: this.uniqueKey,
                    tree: this.tree,
                    sequence: this.sequence,
                })),
                m('.HomePageList', [
                    m('p', 'Select or drop an animation CSV file:'),
                    m('input', {
                        type: 'file',
                        onchange: (event: InputEvent) => {
                            const {files} = event.target as HTMLInputElement;

                            if (files && files.length) {
                                let reader = new FileReader();

                                reader.readAsText(files[0]);

                                reader.onload = () => {
                                    this.urlAttrs = null;
                                    try {
                                        this.sequence = new Sequence(reader.result as string);
                                    } catch (error) {
                                        alert(error);
                                    }
                                    this.uniqueKey++;
                                    m.redraw();
                                };
                            }
                        },
                    }),
                    m('p', 'or paste a GitHub URL:'),
                    m('input.FormControl', {
                        type: 'text',
                        value: this.urlAttrs?.url,
                        oninput: (event: InputEvent) => {
                            this.urlAttrs = {
                                url: (event.target as HTMLInputElement).value,
                            };
                            this.uniqueKey++;
                        },
                        placeholder: 'https://raw.githubusercontent.com/...',
                    }),
                    m('p', 'or choose from the community:'),
                    m(DiscussionList, {
                        state: this.list,
                    }),
                ]),
            ]),
            m('.Hero.HowToHero', m('.container', [
                m('h2', 'How does it work?'),
                m('p', 'Currently this page only shows Matt\'s tree. I might add more customization for the tree in the future.'),
                m('p', [
                    'You can download the coordinates for Matt\'s tree and find some CSV examples in the GitHub repository ',
                    m('a', {
                        href: 'https://github.com/standupmaths/xmastree2021',
                    }, 'standupmaths/xmastree2021'),
                    '.',
                ]),
                m('p', [
                    'To share your creation in the community tab, create a new discussion in the ',
                    m(Link, {
                        href: '/t/animations',
                    }, 'Animations'),
                    ' tag, and upload your CSV file in the post. The ',
                    m('code', '[tree]<url>[/tree]'),
                    ' bbcode will automatically be inserted. You can optionally provide a ',
                    m('code', 'framerate="<integer>"'),
                    ' bbcode attribute. The value is the number of milliseconds between frames.',
                ]),
                m('p', [
                    'You can also link the file directly from GitHub by filling ',
                    m('code', '<url>'),
                    ' with a URL that starts with ',
                    m('code', 'https://raw.githubusercontent.com/'),
                    '.',
                ]),
                m('p', [
                    'The source code for this website can be found at ',
                    m('a', {
                        href: 'https://github.com/clarkwinkelmann/flarum-500led',
                    }, 'clarkwinkelmann/flarum-500led'),
                    '.',
                ]),
            ])),
        ]);
    }
}
