# ربات سرگرمی روبیکا (نسخه ۲)

ربات گروه محور با دو بازی اصلی:

- حقیقت یا جرات
- حدس کلمه + سیستم امتیاز و رتبه‌بندی

## ویژگی‌ها

- فقط داخل **گروه** کار می‌کند (پیوی را نادیده می‌گیرد)
- دکمه‌های شیشه‌ای (Inline Keypad)
- سیستم امتیاز برای حدس کلمه
- رتبه‌بندی گروهی

## راه‌اندازی

1. توکن را در `config.js` قرار دهید.
2. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
3. اجرا:
   ```bash
   node bot.js
   ```

## تنظیم Webhook

```bash
curl -X POST "https://botapi.rubika.ir/v3/TOKEN/updateBotEndpoints" -H "Content-Type: application/json" -d "{\"url\":\"https://YOUR-URL/receiveUpdate\",\"type\":\"ReceiveUpdate\"}"

curl -X POST "https://botapi.rubika.ir/v3/TOKEN/updateBotEndpoints" -H "Content-Type: application/json" -d "{\"url\":\"https://YOUR-URL/receiveInlineMessage\",\"type\":\"ReceiveInlineMessage\"}"
```

## دستورات

- `/روبات` یا `/menu` → نمایش منوی اصلی
