# 腾讯云服务器部署说明

本目录用于把 AI 原生能力自学站部署到腾讯云上海服务器，作为 `mynaxis` 的子站。

默认推荐地址：

```text
https://ai.mynaxis.com/
```

推荐使用子域名，而不是 `mynaxis.com/ai` 这类子目录。原因是当前站点是完整单页应用，子域名更利于缓存、SEO、后续独立运营和统计。

## 一次性服务器准备

在服务器上执行：

```bash
sudo mkdir -p /www/wwwroot/ai.mynaxis.com
sudo chown -R "$USER":"$USER" /www/wwwroot/ai.mynaxis.com
```

安装或确认 Nginx：

```bash
nginx -v
```

把 `nginx-ai-learning-site.conf` 复制到服务器：

```bash
sudo cp nginx-ai-learning-site.conf /www/server/panel/vhost/nginx/ai.mynaxis.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 每次发布

在本机执行：

```bash
./deploy/publish-to-server.sh 用户名@服务器IP
```

如果服务器 SSH 端口不是 22：

```bash
./deploy/publish-to-server.sh 用户名@服务器IP 2222
```

## DNS

在域名 DNS 控制台添加：

```text
主机记录：ai
记录类型：A
记录值：腾讯云上海服务器公网 IP
```

## HTTPS

当前服务器使用 `acme.sh` 和 Let’s Encrypt：

```bash
sudo /root/.acme.sh/acme.sh --issue -d ai.mynaxis.com -w /www/wwwroot/ai.mynaxis.com --keylength ec-256
sudo mkdir -p /www/server/panel/vhost/cert/ai.mynaxis.com
sudo /root/.acme.sh/acme.sh --install-cert -d ai.mynaxis.com --ecc \
  --key-file /www/server/panel/vhost/cert/ai.mynaxis.com/privkey.pem \
  --fullchain-file /www/server/panel/vhost/cert/ai.mynaxis.com/fullchain.pem \
  --reloadcmd "sudo nginx -s reload"
```

`nginx-ai-learning-site.conf` 已包含 80 跳转 HTTPS 和 443 证书配置。

## 验收地址

```text
https://ai.mynaxis.com/
https://ai.mynaxis.com/index.html?page=map
https://ai.mynaxis.com/sitemap.xml
https://ai.mynaxis.com/robots.txt
https://ai.mynaxis.com/llms.txt
```
