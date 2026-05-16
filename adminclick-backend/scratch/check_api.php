<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$regions = \App\Models\Region::select('id', 'nom_fr as fr', 'nom_ar as ar')->get();
echo "DATA REGIONS:\n";
print_r($regions->toArray());
