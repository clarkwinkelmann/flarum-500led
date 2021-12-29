import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import TreeState from '../states/Tree';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

interface TreeAttrs {
    tree: TreeState
    width: number
    height: number
}

export default class Tree implements ClassComponent<TreeAttrs> {
    scene!: THREE.Scene
    camera!: THREE.Camera
    renderer!: THREE.WebGLRenderer
    controls!: OrbitControls
    continueAnimation: boolean = true
    lights: THREE.MeshBasicMaterial[] = []

    oninit(vnode: Vnode<TreeAttrs, this>) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, vnode.attrs.width / vnode.attrs.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(vnode.attrs.width, vnode.attrs.height);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Far away from the tree to see it in full, use height of tree plus 10%
        this.camera.position.z = vnode.attrs.tree.height * 1.1;

        vnode.attrs.tree.getLightsCoordinates().forEach(coordinates => {
            const geometry = new THREE.SphereGeometry(0.02, 32, 16);
            const material = new THREE.MeshBasicMaterial({color: 0xffffff});
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(coordinates[0], coordinates[2] - vnode.attrs.tree.height / 2, coordinates[1]);
            this.scene.add(sphere);

            this.lights.push(material);
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
        return m('.Tree', [
            m('.threejs'),
        ]);
    }

    animate(vnode: Vnode<TreeAttrs, this>) {
        if (!this.continueAnimation) {
            return;
        }

        requestAnimationFrame(this.animate.bind(this, vnode));

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
