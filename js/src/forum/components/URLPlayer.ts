import {ClassComponent, Vnode} from 'mithril';
import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import RequestError from 'flarum/common/utils/RequestError';
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

        // Can't use app.request because it messes up CORS by sending an OPTIONS request which GitHub denies
        m.request({
            method: 'GET',
            url: vnode.attrs.url,
            extract: xhr => {
                const status = xhr.status;

                if (status < 200 || status > 299) {
                    throw new RequestError(status as any, xhr.responseText, {}, xhr);
                }

                return xhr.responseText;
            },
        }).then(response => {
            try {
                this.sequence = new Sequence(response);
            } catch (error) {
                if (error instanceof Error) {
                    this.errorMessage = error.message;
                } else {
                    alert(error);
                }
            }

            m.redraw();
        }).catch(error => {
            console.error(error);

            if (error && error.status) {
                this.errorMessage = 'Error downloading file: HTTP ' + error.status;
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
