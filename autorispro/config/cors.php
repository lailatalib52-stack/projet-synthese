<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

  'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://192.168.254.141:5173',
    'http://192.168.254.141:5174',
    'http://192.168.254.141:5175',
],
'supports_credentials' => true,


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,


];
