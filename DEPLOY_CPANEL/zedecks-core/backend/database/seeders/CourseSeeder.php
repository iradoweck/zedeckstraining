<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\User;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure a trainer exists
        $trainer = User::where('role', 'trainer')->first();
        if (!$trainer) {
            $trainer = User::create([
                'name' => 'Prof. Zedeck',
                'email' => 'trainer@zedecks.com',
                'password' => bcrypt('password'),
                'role' => 'trainer'
            ]);
        }
        
        // Define common schedules
        $commonSchedules = [
            "Manhã (08:00 - 10:00)",
            "Manhã (10:00 - 12:00)",
            "Tarde (14:00 - 16:00)",
            "Pós-Laboral (17:30 - 19:30)"
        ];

        $courses = [
            [
                'title' => 'Desenvolvimento Web Fullstack',
                'slug' => 'web-dev-fullstack',
                'description' => 'Aprenda HTML, CSS, JavaScript, React e Laravel do zero ao profissional.',
                'price' => 5000.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
                'schedules' => $commonSchedules,
                'options' => [
                    'type' => 'programming',
                    'stacks' => [
                        'Web Development (Fullstack)',
                        'Mobile Apps (Flutter/React Native)',
                        'Software Engineering (Java/C#)'
                    ]
                ]
            ],
            [
                'title' => 'Inglês Profissional II',
                'slug' => 'ingles-profissional-ii',
                'description' => 'Curso intermédio de inglês focado em comunicação empresarial.',
                'price' => 3500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
                'schedules' => $commonSchedules,
                'options' => [
                    'type' => 'language',
                    'exams' => [
                        'Cambridge',
                        'TOEFL',
                        'Normal (Interno)'
                    ]
                ]
            ],
            [
                'title' => 'Contabilidade e Fiscalidade Prática',
                'slug' => 'contabilidade-fiscalidade',
                'description' => 'Domine a contabilidade empresarial e softwares de gestão.',
                'price' => 4500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
                'schedules' => $commonSchedules,
            ],
            [
                'title' => 'Design Gráfico & Marketing Digital',
                'slug' => 'design-marketing',
                'description' => 'Crie identidades visuais impactantes.',
                'price' => 4000.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
                'schedules' => ["Tarde (14:00 - 16:00)", "Pós-Laboral (17:30 - 19:30)"], // Limited schedules example
            ],
             [
                'title' => 'Electricidade Instaladora',
                'slug' => 'electricidade',
                'description' => 'Instalações elétricas residenciais e industriais.',
                'price' => 4500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
                'schedules' => $commonSchedules,
                'options' => [
                    'uniform_cost' => 1500 // Specific override
                ]
            ],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(
                ['slug' => $course['slug']],
                $course
            );
        }
    }
}
