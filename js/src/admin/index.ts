import app from 'flarum/admin/app';
import {extend} from 'flarum/common/extend';
import BasicsPage from 'flarum/admin/components/BasicsPage';
import ItemList from 'flarum/common/utils/ItemList';

app.initializers.add('500led', () => {
    extend(BasicsPage.prototype, 'homePageItems', function (items: ItemList) {
        items.add('tree', {
            path: '/500led',
            label: 'Tree',
        });
    });
});
