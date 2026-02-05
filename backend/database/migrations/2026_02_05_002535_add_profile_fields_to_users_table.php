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
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('occupation')->nullable();
            $table->string('nationality')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('document_type')->nullable();
            $table->string('document_number')->nullable();
            $table->string('education_level')->nullable();
            $table->boolean('has_special_needs')->default(false);
            $table->text('special_needs_description')->nullable();
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
