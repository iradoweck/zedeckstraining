<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade'); // Link to Course
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('set null'); // Class assigned later
            $table->enum('status', ['pending', 'active', 'completed', 'dropped'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('payment_proof')->nullable(); // Path to file
            $table->json('options')->nullable(); // Exam modality, programming type, schedule preference
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
