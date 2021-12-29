import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import TreeState from '../states/Tree';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import icon from 'flarum/common/helpers/icon';

interface TreeAttrs {
    tree: TreeState
}

const AXIS: {
    label: string
    color: number
}[] = [
    {
        label: 'x',
        color: 0xff0000,
    },
    {
        label: 'y',
        color: 0x00ff00,
    },
    {
        label: 'z',
        color: 0x0000ff,
    },
];

export default class Tree implements ClassComponent<TreeAttrs> {
    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    renderer!: THREE.WebGLRenderer
    controls!: OrbitControls
    continueAnimation: boolean = true
    lights: THREE.MeshBasicMaterial[] = []
    axis!: THREE.Group
    showAxis: boolean = false
    fullscreen: boolean = false

    oninit(vnode: Vnode<TreeAttrs, this>) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Far away from the tree to see it in full, use height of tree plus 10%
        // Viewed from X axis as said here https://github.com/standupmaths/xmastree2021/issues/21
        this.camera.position.x = vnode.attrs.tree.height * 1.1;

        const verticalOffset = vnode.attrs.tree.height / -2;

        vnode.attrs.tree.getLightsCoordinates().forEach(coordinates => {
            const geometry = new THREE.SphereGeometry(0.02, 16, 8);
            const material = new THREE.MeshBasicMaterial({color: 0xffffff});
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(coordinates[0], coordinates[2] + verticalOffset, -coordinates[1]);
            this.scene.add(sphere);

            this.lights.push(material);
        });

        this.axis = new THREE.Group();

        AXIS.forEach(axis => {
            const material = new THREE.LineBasicMaterial({color: axis.color});

            // The names of the axis intentionally do not match with THREE.js
            // The vertical axis Y will be labelled Z and Z will be labeled Y to match with the animation file convention
            // Also Y axis is mirrored to restore the correct shape
            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, verticalOffset, 0),
                new THREE.Vector3(axis.label === 'x' ? 1 : 0, (axis.label === 'z' ? 1 : 0) + verticalOffset, axis.label === 'y' ? -1 : 0),
            ]);

            const line = new THREE.Line(geometry, material);

            this.axis.add(line);
        });
    }

    oncreate(vnode: VnodeDOM<TreeAttrs, this>) {
        vnode.dom.querySelector('.threejs')!.appendChild(this.renderer.domElement);

        this.animate(vnode);
    }

    onremove(vnode: VnodeDOM<TreeAttrs, this>): any {
        this.continueAnimation = false;
        this.renderer.dispose();
    }

    view() {
        return m('.Tree', {
            className: this.fullscreen ? 'fullscreen' : '',
        }, [
            m('.threejs'),
            m('.TreeButtons', [
                m('button.Button.Button--link.Button--icon', {
                    title: 'Toggle axis visibility',
                    onclick: () => {
                        this.showAxis = !this.showAxis;

                        if (this.showAxis) {
                            this.scene.add(this.axis);
                        } else {
                            this.scene.remove(this.axis);
                        }
                    },
                }, icon('fas fa-chart-area', {className: 'Button-icon'})),
                ' ',
                m('button.Button.Button--link.Button--icon', {
                    title: 'Toggle full screen',
                    onclick: () => {
                        this.fullscreen = !this.fullscreen;
                    },
                }, icon('fas fa-expand', {className: 'Button-icon'})),
            ]),
        ]);
    }

    animate(vnode: Vnode<TreeAttrs, this>) {
        if (!this.continueAnimation) {
            return;
        }

        requestAnimationFrame(this.animate.bind(this, vnode));

        // Based on https://newbedev.com/threejs-canvas-size-based-on-container
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        let height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            // you must pass false here or three.js sadly fights the browser
            this.renderer.setSize(width, height, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        const state = vnode.attrs.tree.getLightsColors();

        this.lights.forEach((material, i) => {
            material.setValues({
                color: state[i] || 0x000000,
            });
        });
    }
}
