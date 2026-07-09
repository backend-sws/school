<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class RunTests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the application tests';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $phpunitPath = base_path('vendor/bin/phpunit');
        $command = is_file($phpunitPath)
            ? [PHP_BINARY, $phpunitPath]
            : $this->resolvePhpunitFromPath();

        if ($command === null) {
            $this->error('PHPUnit not found. Run: composer install');

            return self::FAILURE;
        }

        $process = new Process(
            $command,
            base_path(),
            null,
            null,
            null
        );
        $process->run(fn (string $type, string $buffer) => $this->output->write($buffer));

        return $process->getExitCode();
    }

    /**
     * Try to find phpunit on PATH (e.g. in CI or when installed globally).
     *
     * @return array<int, string>|null
     */
    private function resolvePhpunitFromPath(): ?array
    {
        $which = @shell_exec('which phpunit 2>/dev/null');
        if ($which !== null) {
            $path = trim(strtok($which, "\n"));
            if ($path !== '' && is_file($path)) {
                return [$path];
            }
        }

        return null;
    }
}
