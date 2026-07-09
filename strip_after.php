<?php
$files = glob('database/migrations/*.php');
$count = 0;
foreach ($files as $file) {
    $content = file_get_contents($file);
    // Remove ->after('column_name')
    $newContent = preg_replace('/->after\([\'"][^\'"]+[\'"]\)/', '', $content);
    if ($content !== $newContent) {
        file_put_contents($file, $newContent);
        $count++;
    }
}
echo "Stripped ->after() from $count files.\n";
