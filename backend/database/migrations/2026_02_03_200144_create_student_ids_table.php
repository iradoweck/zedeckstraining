<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_ids', function (Blueprint $table) {
            $table->id();
            $table->string('student_code')->unique()->index(); // ZT-2026-XXXX
            $table->string('document_number')->index(); // Link to physical person
            $table->integer('year');
            $table->enum('status', ['active', 'banned', 'expired', 'used'])->default('active');
            $table->json('metadata')->nullable(); // Snapshot data (name, etc)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_ids');
    }
};
