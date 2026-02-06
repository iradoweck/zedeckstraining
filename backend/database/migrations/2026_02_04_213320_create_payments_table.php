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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reference')->unique(); // ZT-PAY-...
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('MZN');
            $table->string('method'); // mpesa_api, emola, stripe, transfer...
            $table->string('status')->default('pending'); // pending, paid, failed, manual_verification
            $table->string('proof_file')->nullable(); // Path to file
            $table->json('metadata')->nullable(); // Extra details
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
