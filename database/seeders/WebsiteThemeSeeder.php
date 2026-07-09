<?php

namespace Database\Seeders;

use App\Models\WebsiteTheme;
use Illuminate\Database\Seeder;

class WebsiteThemeSeeder extends Seeder
{
    public function run(): void
    {
        $themes = require database_path('seeders/data/website_themes.php');

        foreach ($themes as $theme) {
            WebsiteTheme::updateOrCreate(
                ['slug' => $theme['slug']],
                $theme
            );
        }
    }
}
