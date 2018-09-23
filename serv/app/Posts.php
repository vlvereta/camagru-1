<?php
/**
 * Created by PhpStorm.
 * User: mstorcha
 * Date: 9/16/18
 * Time: 4:18 PM
 */

class Posts
{
    public static $posts;

    public function __construct()
    {
        include './config/database.php';
        $connection = new DB_connection($DB_DSN, $DB_USER, $DB_PASSWORD);
        $req_posts = $connection->query("SELECT * FROM `posts`;");
        $posts = [];
        foreach ($req_posts as $post)
        {
            $tmp = base64_encode(file_get_contents($post['PICT']));
            array_push($posts, ['user' => $post['USER'], 'pict' => $tmp]);
        }
        self::$posts = $posts;
    }
}