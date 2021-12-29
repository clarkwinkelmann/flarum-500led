import URLPlayer from '../components/URLPlayer';

/**
 * Custom HTML element to render the Mithril tree component
 * A custom element is used to simplify interactions with TextFormatter
 * This way the same code will be used for previews and regular rendering
 * Shadow DOM is used to prevent TextFormatter messing up with the DOM during its diff algorithm
 * Re-implementing isSameNode() wasn't enough to solve the issue without shadow DOM
 */
export default class TreeEmbed extends HTMLElement {
    mounted: boolean = false

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        // Copy Flarum CSS links. There will most likely be only one but that way we cover additional options
        document.querySelectorAll('link[rel="stylesheet"]').forEach(originalLink => {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', originalLink.getAttribute('href')!);

            shadow.appendChild(link);
        });

        shadow.appendChild(document.createElement('div'));
    }

    connectedCallback() {
        this.mount();
    }

    disconnectedCallback() {
        this.mount(true);
    }

    static get observedAttributes() {
        return ['url', 'framerate'];
    }

    attributeChangedCallback() {
        if (!this.mounted) {
            return;
        }

        this.mount();
    }

    mount(unmount: boolean = false) {
        const element = this.shadowRoot!.querySelector('div')!;

        if (this.mounted) {
            // It's important to always unmount the component otherwise global event listeners and webgl stuff isn't properly cleared
            m.mount(element, null);
        }

        if (unmount) {
            this.mounted = false;

            return;
        }

        this.mounted = true;

        const attrs: any = {
            url: this.getAttribute('url') || '',
        };

        const framerate = this.getAttribute('framerate');

        if (framerate) {
            attrs.framerate = parseInt(framerate);
        }

        m.mount(element, {
            view() {
                return m(URLPlayer, attrs);
            },
        });
    }
}
