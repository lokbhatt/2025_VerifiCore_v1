<?php

namespace App\View\Components;

use Illuminate\View\Component;

class AppLayout extends Component
{
    public $header;

    public function __construct($header = null)
    {
        $this->header = $header;
    }

    public function render()
    {
        return view('components.app-layout');
    }
}
