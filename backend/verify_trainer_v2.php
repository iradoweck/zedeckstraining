<?php

require __DIR__ . '/vendor/autoload.php';

$baseUrl = 'http://127.0.0.1:8001/api/v1';
$trainerEmail = 'trainer@zedecks.com'; 
$trainerPassword = 'password';

function post($url, $data = [], $token = null) {
    global $baseUrl;
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

function get($url, $token = null) {
    global $baseUrl;
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

echo "--- Verifying Trainer Backend v2 ---\n";

// 0. Get Student ID
echo "Logging in as Student to get ID...\n";
$loginStudent = post('/auth/login', ['email' => 'student@zedecks.com', 'password' => 'password']);
if ($loginStudent['code'] !== 200) die("Student Login failed: " . json_encode($loginStudent['body']) . "\n");
$studentToken = $loginStudent['body']['access_token'];
$studentMe = get('/auth/me', $studentToken);

if (!isset($studentMe['body']['id'])) {
    echo "ERROR: Could not get student ID from /auth/me\n";
    print_r($studentMe['body']);
    exit(1);
}
$studentId = $studentMe['body']['id'];
echo "Student ID: $studentId\n";

// 1. Login Trainer
echo "Logging in as Trainer...\n";
$login = post('/auth/login', ['email' => $trainerEmail, 'password' => $trainerPassword]);
if ($login['code'] !== 200) die("Login failed: " . json_encode($login['body']) . "\n");
$token = $login['body']['access_token'];
echo "Success. Token acquired.\n";

// 2. Create Course (Ensure we have one)
echo "Creating/Finding Course...\n";
$rand = rand(100, 999);
$courseData = [
    'title' => 'Trainer Verification Course ' . $rand,
    'slug' => 'trainer-verification-course-' . $rand,
    'description' => 'A course for testing backend.',
    'price' => 100,
    'is_published' => true
];
$createCourse = post('/courses', $courseData, $token);

if ($createCourse['code'] === 201) {
    $courseId = $createCourse['body']['id'];
    echo "Created Course ID: $courseId\n";
} else {
    echo "Create Course failed (Code {$createCourse['code']}), trying fetch...\n";
    $courses = get('/courses', $token);
    $courseId = $courses['body'][0]['id'] ?? null;
}

if (!$courseId) die("No Course ID available. Cannot proceed.\n");

// 3. Create Class
echo "Creating Class...\n";
$classData = [
    'course_id' => $courseId,
    'name' => 'Test Class V2 ' . rand(100,999),
    'start_date' => '2026-02-01',
    'end_date' => '2026-03-01',
    'format' => 'online'
];
$createClass = post('/classes', $classData, $token);
if ($createClass['code'] !== 201) die("Create Class failed: " . json_encode($createClass['body']) . "\n");
$classId = $createClass['body']['id'];
echo "Created Class ID: $classId\n";

// 4. Enroll Student
$enrollmentData = ['class_id' => $classId, 'user_id' => $studentId]; 
echo "Enrolling Student ID $studentId...\n";
$enroll = post('/enrollments', $enrollmentData, $token);
echo "Enrollment status: " . $enroll['code'] . "\n";
$enrollmentId = $enroll['body']['id'] ?? $enroll['body']['data']['id'] ?? null; 
if (!$enrollmentId) {
    // try to find it
    if ($enroll['code'] == 201) $enrollmentId = $enroll['body']['id'];
    else {
        $classDetails = get("/classes/$classId", $token);
        // Assuming class details returns enrollments based on controller logic (which implies trainer can see them)
        if (isset($classDetails['body']['enrollments'])) {
             foreach($classDetails['body']['enrollments'] as $enr) {
                 if ($enr['user_id'] == $studentId) $enrollmentId = $enr['id'];
             }
        }
    }
}
echo "Enrollment ID: $enrollmentId\n";
if (!$enrollmentId) die("Could not get an enrollment ID to test with.\n");

// 5. Test Attendance Filtering
echo "Recording Attendance for 2026-02-01...\n";
post('/attendance', [
    'class_id' => $classId,
    'date' => '2026-02-01',
    'attendances' => [['user_id' => $studentId, 'status' => 'present']]
], $token);

echo "Recording Attendance for 2026-02-02...\n";
post('/attendance', [
    'class_id' => $classId,
    'date' => '2026-02-02',
    'attendances' => [['user_id' => $studentId, 'status' => 'absent']]
], $token);

echo "Fetching All Attendance (Expect 2)...\n";
$allAtt = get("/attendance?class_id=$classId", $token);
echo "Count: " . count($allAtt['body']) . "\n";

echo "Fetching Attendance for 2026-02-01 (Expect 1)...\n";
$filteredAtt = get("/attendance?class_id=$classId&date=2026-02-01", $token);
echo "Count: " . count($filteredAtt['body']) . "\n";
if (count($filteredAtt['body']) !== 1) echo "WARNING: Filter failed.\n";


// 6. Test Grade fetching by Class ID
echo "Recording Grade 1...\n";
post('/grades', [
    'enrollment_id' => $enrollmentId,
    'assignment_name' => 'Quiz 1',
    'score' => 85
], $token);

echo "Recording Grade 2 (same student, diff assignment)...\n";
post('/grades', [
    'enrollment_id' => $enrollmentId,
    'assignment_name' => 'Quiz 2',
    'score' => 90
], $token);

echo "Fetching Grades by Class ID...\n";
$classGrades = get("/grades?class_id=$classId", $token);
if ($classGrades['code'] !== 200) {
    echo "FAILED: " . json_encode($classGrades['body']) . "\n";
} else {
    echo "Count: " . count($classGrades['body']) . "\n";
    if (count($classGrades['body']) >= 2) echo "SUCCESS: Retrieved class-wide grades.\n";
    else echo "WARNING: Expected at least 2 grades.\n";
}

echo "--- Verification Complete ---\n";
