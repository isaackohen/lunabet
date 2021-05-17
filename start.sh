#!/bin/bash
rm laravel-echo-server.lock
echo $$ > /var/www/html/storage/realtime.pid
php artisan queue:clear
nohup laravel-echo-server start & disown
nohup php artisan datagamble:subscribe & disown

