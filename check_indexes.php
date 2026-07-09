<?php
$files = glob('database/migrations/*.php');
$totalLong = 0;
foreach ($files as $file) {
    $content = file_get_contents($file);
    preg_match_all("/Schema::(?:create|table)\('([^']+)'/", $content, $tableMatches);
    $tables = $tableMatches[1];
    
    // Also match $table->index(...) and $table->unique(...)
    if (preg_match_all('/->(index|unique)\(\[([^\]]+)\](?!,\s*[\'"])/', $content, $matches, PREG_OFFSET_CAPTURE)) {
        foreach ($matches[2] as $index => $match) {
            $colsStr = $match[0];
            $offset = $match[1];
            $type = $matches[1][$index][0]; // 'index' or 'unique'
            
            $tableName = 'unknown';
            $lastPos = -1;
            foreach ($tableMatches[0] as $idx => $tMatch) {
                $tPos = strpos($content, $tMatch, $lastPos + 1);
                if ($tPos < $offset) {
                    $tableName = $tables[$idx];
                }
                $lastPos = $tPos;
            }
            
            preg_match_all('/[\'"]([^\'"]+)[\'"]/', $colsStr, $colMatches);
            $cols = $colMatches[1];
            
            $suffix = $type === 'unique' ? 'unique' : 'index';
            $generatedName = $tableName . '_' . implode('_', $cols) . '_' . $suffix;
            
            if (strlen($generatedName) > 64) {
                echo basename($file) . " -> Table: $tableName, Cols: " . implode(',', $cols) . " (Len: " . strlen($generatedName) . ")\n";
                $totalLong++;
            }
        }
    }
}
echo "Total long indexes: $totalLong\n";
