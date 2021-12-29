import {ClassComponent} from 'mithril';
import Sequence from '../states/Sequence';
import TreeState from '../states/Tree';
import Player from './Player';

export default class Reader implements ClassComponent {
    tree: TreeState = new TreeState()
    sequence?: Sequence
    uniqueKey: number = 1

    view() {
        let sequence = this.sequence;

        if (!sequence) {
            sequence = new Sequence('');
        }

        return m('.Reader', [
            m('div', m(Player, {
                key: this.uniqueKey,
                tree: this.tree,
                sequence,
            })),
            m('input', {
                type: 'file',
                onchange: (event: InputEvent) => {
                    const {files} = event.target as HTMLInputElement;

                    if (files && files.length) {
                        let reader = new FileReader();

                        reader.readAsText(files[0]);

                        reader.onload = () => {
                            this.sequence = new Sequence(reader.result as string);
                            this.uniqueKey++;
                            m.redraw();
                        };
                    }
                },
            }),
        ]);
    }
}
