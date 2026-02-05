<?php
require __DIR__ . '/vendor/autoload.php';

$url = 'http://localhost:8000/api/v1/auth/register';

$data = [
    'name' => 'Teste Debug',
    'email' => 'debug' . time() . '@test.com',
    'password' => 'password123',
    'role' => 'student',
    'first_name' => 'Teste',
    'last_name' => 'Debug',
    'birth_date' => '2000-01-01',
    'gender' => 'M',
    'nationality' => 'MZ',
    'document_type' => 'BI',
    'document_number' => '123456789' . rand(100, 999),
    'education_level' => 'Medium',
    'phone' => '+258 84000000',
    'student_code' => 'ST-' . time(),
    'courses' => [
        [
            'id' => 1,
            'modality' => 'Presencial',
            'schedule' => 'Manhã'
        ]
    ]
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Status: " . $http_response_header[0] . "\n";
echo "Response: " . $result . "\n";
