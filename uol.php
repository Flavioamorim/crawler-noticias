

<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

    $globo = file_get_contents('uol.json');
    echo $globo;

?>