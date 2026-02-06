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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'father_name')) $table->string('father_name')->nullable();
            if (!Schema::hasColumn('users', 'mother_name')) $table->string('mother_name')->nullable();
            if (!Schema::hasColumn('users', 'gender')) $table->string('gender')->nullable();
            if (!Schema::hasColumn('users', 'marital_status')) $table->string('marital_status')->nullable();
            if (!Schema::hasColumn('users', 'occupation')) $table->string('occupation')->nullable();
            if (!Schema::hasColumn('users', 'nationality')) $table->string('nationality')->nullable();
            if (!Schema::hasColumn('users', 'province')) $table->string('province')->nullable();
            if (!Schema::hasColumn('users', 'city')) $table->string('city')->nullable();

            // Checks for phone as it might exist from other migrations
            if (!Schema::hasColumn('users', 'phone')) $table->string('phone')->nullable();

            if (!Schema::hasColumn('users', 'birth_date')) $table->date('birth_date')->nullable();
            if (!Schema::hasColumn('users', 'document_type')) $table->string('document_type')->nullable();
            if (!Schema::hasColumn('users', 'document_number')) $table->string('document_number')->nullable();
            if (!Schema::hasColumn('users', 'education_level')) $table->string('education_level')->nullable();
            if (!Schema::hasColumn('users', 'has_special_needs')) $table->boolean('has_special_needs')->default(false);
            if (!Schema::hasColumn('users', 'special_needs_description')) $table->text('special_needs_description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'father_name',
                'mother_name',
                'gender',
                'marital_status',
                'occupation',
                'nationality',
                'birth_date',
                'document_type',
                'document_number',
                'education_level',
                'has_special_needs',
                'special_needs_description'
            ]);
        });
    }
};
