<?php namespace App\Games\Kernel;

abstract class Metadata {

    abstract function id() : string;

    abstract function name() : string;

    abstract function icon() : string;

    /**
     * If this returns true, then this game shouldn't appear anywhere in admin panel, will be disabled,
     * and users will see "Coming soon!" label instead of "Unavailable".
     * @return bool
     */
    public function isPlaceholder(): bool {
        return false;
    }

    public function toArray(): array {
        return [
            'id' => $this->id(),
            'name' => $this->name(),
            'icon' => $this->icon()
        ];
    }

}
