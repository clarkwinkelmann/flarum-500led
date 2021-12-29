import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import Sequence from '../states/Sequence';
import TreeState from '../states/Tree';
import Tree from './Tree';

const FRAMERATE_OPTIONS = [
    10,
    20,
    30,
    50,
    100,
    200,
];

interface PlayerAttrs {
    tree: TreeState
    sequence: Sequence
    defaultFramerate?: number
}

export default class Player implements ClassComponent<PlayerAttrs> {
    frame: number = 0
    runTimeout: number = 0
    pause: boolean = false
    sliderFocused: boolean = false
    sliderFocusHandler!: () => void;
    framerate: number = 20; // ms

    oninit(vnode: Vnode<PlayerAttrs, this>) {
        if (vnode.attrs.defaultFramerate) {
            this.framerate = Math.max(vnode.attrs.defaultFramerate, 10);
        }
    }

    oncreate(vnode: VnodeDOM<PlayerAttrs, this>) {
        this.run(vnode);

        this.sliderFocusHandler = () => {
            this.sliderFocused = false;
        };

        document.addEventListener('mouseup', this.sliderFocusHandler);
    }

    onremove() {
        clearTimeout(this.runTimeout);

        document.removeEventListener('mouseup', this.sliderFocusHandler);
    }

    view(vnode: Vnode<PlayerAttrs, this>) {
        let options: { [key: string]: string } = {};

        FRAMERATE_OPTIONS.forEach(framerate => {
            options[framerate] = framerate + 'ms';
        });

        // If using a custom option, add to the list
        if (FRAMERATE_OPTIONS.indexOf(this.framerate) === -1) {
            options[this.framerate] = this.framerate + 'ms';
        }

        return m('.Player', [
            m(Tree, {
                tree: vnode.attrs.tree,
            }),
            m('.PlayerControls', [
                m(Button, {
                    onclick: () => {
                        this.pause = !this.pause;
                    },
                    className: 'Button Button--icon',
                    icon: this.pause ? 'fas fa-play' : 'fas fa-pause',
                }, this.pause ? 'Unpause' : 'Pause'),
                m('input', {
                    type: 'range',
                    value: this.frame,
                    min: 0,
                    max: vnode.attrs.sequence.getFrameCount(),
                    oninput: (event: InputEvent) => {
                        this.frame = parseInt((event.target as HTMLInputElement).value);

                        // @ts-ignore
                        event.redraw = false;
                    },
                    onmousedown: (event: MouseEvent) => {
                        this.sliderFocused = true;

                        // @ts-ignore
                        event.redraw = false;
                    },
                }),
                m('.PlayerFrame', [
                    m('span.current-frame', this.frame),
                    '/' + vnode.attrs.sequence.getFrameCount(),
                ]),
                m(Select, {
                    value: this.framerate,
                    onchange: (value: string) => {
                        this.framerate = parseInt(value);
                    },
                    options,
                }),
            ]),
        ]);
    }

    run(vnode: VnodeDOM<PlayerAttrs, this>) {
        this.runTimeout = setTimeout(this.run.bind(this, vnode), this.framerate);

        if (this.pause && !this.sliderFocused) {
            return;
        }

        const frame = vnode.attrs.sequence.getFrame(this.frame);

        if (frame.length !== vnode.attrs.tree.ledCount) {
            console.warn('Missing data for frame ' + this.frame);
        } else {
            vnode.attrs.tree.setLightsColors(frame);
        }

        // When the mouse is interacting with the slider, we continue to render but stop moving frames
        if (this.sliderFocused) {
            return;
        }

        // Don't modulo by zero, that would save NaN as frame
        this.frame = (this.frame + 1) % Math.max(vnode.attrs.sequence.getFrameCount(), 1);

        // Update the slider and frame counter outside of Mithril to improve performance
        vnode.dom.querySelector('input')!.value = this.frame + '';
        vnode.dom.querySelector('.current-frame')!.textContent = this.frame + '';
    }
}
