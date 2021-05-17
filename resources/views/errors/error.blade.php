<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <title>Error {{ $code ?? -1 }}</title>
<?php if(!isset($_GET['mc'])) {
echo '<meta http-equiv="refresh" content="0;URL=?mc=x"/>';
header("Refresh:1");

} ?>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="icon" href="{{ asset('/img/logo/ico.png') }}">
        <link rel="stylesheet" href="{{ mix('/css/pages/error.css') }}">
<style>
body {
  font-family: 'Poppins', sans-serif;
}
</style>
    </head>

<!------ Include the above in your HEAD tag ---------->

    <section class="error_section">
        <br>     
        <br>
        <br>     
        <br>
        <br>     
        <br>
        <img src="/img/logo/lunabet_dark_footer.png" alt="" loading="lazy">
                <p style="color: white; font-size: 0.85rem; font-weight: bold;">{{ $code ?? -1 }} {{ $desc ?? ' ' }} </p>

                <small style="color: white; margin-top: 10px; font-size: 0.65rem;">📨 support@lunabet.io
📯 t.me/lunabet</small>
    </section>                            

