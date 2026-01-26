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

        $courses = [
            [
                'title' => 'Desenvolvimento Web Fullstack',
                'slug' => 'web-dev-fullstack',
                'description' => 'Aprenda HTML, CSS, JavaScript, React e Laravel do zero ao profissional. Inclui projetos reais.',
                'price' => 5000.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
            ],
            [
                'title' => 'Inglês Profissional II',
                'slug' => 'ingles-profissional-ii',
                'description' => 'Curso intermédio de inglês focado em comunicação empresarial e técnica.',
                'price' => 3500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
            ],
            [
                'title' => 'Contabilidade e Fiscalidade Prática',
                'slug' => 'contabilidade-fiscalidade',
                'description' => 'Domine a contabilidade empresarial moçambicana e os softwares de gestão Primavera/PHC.',
                'price' => 4500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
            ],
            [
                'title' => 'Design Gráfico & Marketing Digital',
                'slug' => 'design-marketing',
                'description' => 'Crie identidades visuais impactantes e gerencie campanhas de sucesso.',
                'price' => 4000.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
            ],
             [
                'title' => 'Electricidade Instaladora',
                'slug' => 'electricidade',
                'description' => 'Instalações elétricas residenciais e industriais com foco prático.',
                'price' => 4500.00,
                'is_published' => true,
                'trainer_id' => $trainer->id,
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
