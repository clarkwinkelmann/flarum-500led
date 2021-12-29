import DiscussionListState from 'flarum/forum/states/DiscussionListState';

export default class AnimationList extends DiscussionListState {
    constructor(playAnimation: (attrs: { url: string, framerate?: number }) => void) {
        super({
            sort: 'newest', // This will force showFirstPost() to be true in DiscussionListItem
            '500led-home': true, // This isn't copied anywhere, but can be read in DiscussionListItem to know we're on the special homepage
            playAnimation,
        }, 1);
    }

    requestParams(): any {
        const params = super.requestParams();

        params.include.push('firstPost');

        params.filter.tag = 'animations';

        return params;
    }
}
