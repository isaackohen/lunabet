<?php namespace App\ActivityLog;

use App\AdminActivity;

class Freegames extends ActivityLogEntry {

    public function id() {
        return "freegames";
    }

    protected function format(AdminActivity $data) {
        return 'Changed freegames of @'.$data->data['id'].': '.$data->data['spins'];
    }

}
