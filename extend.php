<?php

namespace ClarkWinkelmann\RollDie;

use Flarum\Extend;
use s9e\TextFormatter\Configurator;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/less/forum.less')
        ->js(__DIR__ . '/js/dist/forum.js')
        ->route('/500led', '500led.home'),

    (new Extend\Formatter)
        ->configure(function (Configurator $config) {
            $config->BBcodes->addCustom(
                '[TREE framerate="{RANGE=10,1000;defaultValue=20}"]{URL}[/TREE]',
                '<tree-embed url="{URL}" framerate="{@framerate}"></tree-embed>'
            );
        }),
];
