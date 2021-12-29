<?php

namespace ClarkWinkelmann\LED500;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Upload\Helpers\Util;

class UploadServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->make(Util::class)->addRenderTemplate($this->container->make(UploadTemplate::class));
    }
}
