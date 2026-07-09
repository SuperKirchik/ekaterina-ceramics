# Деплой на Timeweb VDS/VPS

Для этого проекта нужен Node.js-сервер, потому что сайт использует Next.js API, админку, SQLite-базу и загрузку изображений.

## Что выбрать

- VDS/VPS: Ubuntu 24.04 или 22.04.
- CPU/RAM: минимум 1 vCPU и 1 GB RAM, комфортнее 2 GB RAM.
- Диск: от 20 GB SSD/NVMe.
- Node.js: 20 LTS или новее.

## Переменные окружения

На сервере создать `.env.local` из `.env.production.example` и заменить значения:

```env
ADMIN_LOGIN=adminkatya
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-long-random-secret

MAIL_TO=bikbova_katya@mail.ru
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=SuperKirchik@yandex.ru
SMTP_PASSWORD=app-password-from-yandex-id
SMTP_FROM=Екатерина Дроздова <SuperKirchik@yandex.ru>
```

`SMTP_PASSWORD` должен быть паролем приложения Яндекс ID, не обычным паролем от почты.

## Команды на сервере

```bash
sudo apt update
sudo apt install -y nodejs npm nginx
sudo npm install -g pm2

cd /var/www/ekaterina-ceramics
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Nginx

Пример конфига `/etc/nginx/sites-available/ekaterina-ceramics`:

```nginx
server {
  server_name example.ru www.example.ru;

  client_max_body_size 25m;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Активировать:

```bash
sudo ln -s /etc/nginx/sites-available/ekaterina-ceramics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS

После привязки домена к серверу:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.ru -d www.example.ru
```

## Важные папки

Не терять при переносе и бэкапах:

- `data/site.sqlite` - база товаров и коллекций.
- `public/uploads` - загруженные в админке изображения.
