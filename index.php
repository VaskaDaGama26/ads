<?php

require __DIR__ . '/src/db.php';

require_once __DIR__ . '/src/config.php';
$logged_in = isLoggedIn();

$stmt = $pdo->query("
                SELECT id, title, price, description, image
                from Ads
                ORDER BY id DESC
              ");
$ads = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/assets/styles/style.css" />
  <title>Обьявления - Вариант 5</title>
</head>

<body>
  <?php require_once __DIR__ . '/src/components/header.php' ?>

  <main>
    <section class="container section__heading">
      <h1>Новые объявления</h1>
      <a href="/add/" class="add__ad">
        <img src="/assets/icons/+.svg" alt="" /><span>Добавить объявление</span>
      </a>
    </section>

    <section class="container ads__grid">
      <?php if (empty($ads)): ?>
        <p>Нет объявлений</p>
      <?php endif; ?>

      <?php foreach ($ads as $ad): ?>
        <?php
        $id = htmlspecialchars($ad['id']);
        $title = htmlspecialchars($ad['title']);
        $price = number_format($ad['price'], 0, '.', ' ');
        $image = base64_encode($ad['image']);
        ?>
        <a href="/ad/<?= $id ?>" class="ads__grid__element">
          <img src="data:image/jpeg;base64,<?= $image ?>" alt="" />
          <div>
            <span><?= $price ?> ₽</span>
            <p><?= $title ?></p>
          </div>
        </a>
      <?php endforeach; ?>

      <!-- <button class="show-more__button">
        <img src="/assets/icons/show-more.svg" alt="" />Показать еще
      </button> -->
    </section>
  </main>

  <?php require_once __DIR__ . '/src/components/footer.php' ?>

  <script src="/assets/scripts/checkAuthStatus.js"></script>
  <script src="/assets/scripts/popover.js"></script>
  <script src="/assets/scripts/validation.js"></script>
</body>

</html>