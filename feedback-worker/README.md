# Подключение обезличенной статистики

Worker полностью подготовлен, но его нельзя безопасно развернуть без входа владельца в Cloudflare.

1. Войдите в Cloudflare и откройте **Workers & Pages → D1 SQL Database → Create**.
2. Создайте базу с именем `zagran-helper-feedback` и скопируйте её несекретный **Database ID**.
3. Скопируйте `wrangler.example.toml` в локальный `wrangler.toml` и замените `database_id`. Файл `wrangler.toml` не коммитьте.
4. В этой папке выполните `npx wrangler login`, затем:

   ```bash
   npx wrangler d1 execute zagran-helper-feedback --remote --file schema.sql
   npx wrangler deploy
   ```

   Если база уже создавалась по старой схеме, вместо повторного `schema.sql` примените `migration-002.sql`.

5. Скопируйте выданный URL вида `https://zagran-helper-feedback.<account>.workers.dev`.
6. В GitHub откройте **Settings → Secrets and variables → Actions → Variables**, создайте переменную `VITE_PUBLIC_METRICS_ENDPOINT` с этим URL.
7. Запустите workflow **Deploy to GitHub Pages** или сделайте следующий push в `main`.

API-токены, cookies и другие секреты в репозиторий добавлять не нужно. Worker хранит только дневные суммы событий, оценку и текст, который пользователь сам написал в поле отзыва.
