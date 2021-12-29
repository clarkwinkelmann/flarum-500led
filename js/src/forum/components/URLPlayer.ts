import {ClassComponent, Vnode} from 'mithril';
import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Sequence from '../states/Sequence';
import TreeState from '../states/Tree';
import Player from './Player';

interface URLPlayerAttrs {
    url: string
    framerate?: number
}

export default class URLPlayer implements ClassComponent<URLPlayerAttrs> {
    tree: TreeState = new TreeState()
    sequence?: Sequence
    errorMessage?: string

    oninit(vnode: Vnode<URLPlayerAttrs, this>) {
        if (
            !vnode.attrs.url.startsWith(app.forum.attribute('baseUrl')) &&
            !vnode.attrs.url.startsWith('https://raw.githubusercontent.com/')
        ) {
            this.errorMessage = 'The animation URL must be hosted on this website or GitHub';

            return;
        }

        app.request({
            method: 'GET',
            url: vnode.attrs.url,
            // Flarum tries to always parse everything to JSON. So we'll over-encode it so Flarum can decode to plaintext later
            extract: (text: string) => JSON.stringify(text),
        }).then(response => {
            this.sequence = new Sequence(response);

            m.redraw();
        }).catch(error => {
            if (error && error.alert && error.alert.content) {
                this.errorMessage = [
                    'Error downloading file:',
                    m('br'),
                    error.alert.content,
                ];
            } else {
                this.errorMessage = 'Error downloading file';
            }
        });
    }

    view(vnode: Vnode<URLPlayerAttrs, this>) {
        return m('.PlayerEmbed', {
            // Used for the preview script to decide whether a redraw is necessary
            'data-url': vnode.attrs.url,
        }, this.content(vnode));
    }

    content(vnode: Vnode<URLPlayerAttrs, this>): any {
        if (this.errorMessage) {
            return m('.PlayerEmbedError.Alert.Alert--error', this.errorMessage);
        }

        if (!this.sequence) {
            return m('.PlayerEmbedLoading', [
                m(LoadingIndicator, {
                    size: 'large',
                }),
                m('p', 'Loading animation...'),
            ]);
        }

        return m(Player, {
            tree: this.tree,
            sequence: this.sequence,
            defaultFramerate: vnode.attrs.framerate,
        });
    }
}
