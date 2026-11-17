<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'SIM-OPS SMA') }}</title>

        <!-- Google Fonts & Material Symbols -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />

        <!-- Scripts & Styles -->
        @viteReactRefresh
        @vite(['resources/js/Pages/Dashboard/Index.tsx'])
        @inertiaHead
    </head>
    <body class="bg-background font-body-md text-on-surface antialiased">
        @inertia
    </body>
</html>

