<?php

namespace ClarkWinkelmann\LED500;

use FoF\Upload\Contracts\Template;
use FoF\Upload\File;

class UploadTemplate implements Template
{
    public function tag(): string
    {
        return 'tree';
    }

    public function name(): string
    {
        return '500LED tree';
    }

    public function description(): string
    {
        return 'Integrate with [tree] bbcode';
    }

    public function preview(File $file): string
    {
        return '[tree]' . $file->url . '[/tree]';
    }
}
