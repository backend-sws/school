<?php

namespace App\Contracts;

interface ReportContract
{
    /**
     * Get the report data based on provided filters.
     *
     * @param array $filters
     * @return array
     */
    public function getData(array $filters): array;

    /**
     * Get the headers for the report (useful for tables and exports).
     *
     * @return array
     */
    public function getHeaders(): array;

    /**
     * Get metadata about the report (title, description, chart types, etc.).
     *
     * @return array
     */
    public function getMetadata(): array;
}
