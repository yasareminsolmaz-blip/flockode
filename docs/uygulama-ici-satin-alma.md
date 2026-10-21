# Tam sürüm satın alması (bir kez)

Dünya 1–2 ücretsiz. Dünya 3–20 tek bir satın almayla açılır. Uygulama bu ürünü şu kimlikle arar:

**`com.yasarss.flockode.full`**

Ürün App Store Connect'te tanımlanmadıkça TestFlight'ta "Tam sürümü aç" düğmesi fiyat göstermez ve satın alma tamamlanmaz. Expo Go'da satın alma her zaman **test modunda** çalışır (ödeme yok).

## Adımlar (iPad'den Safari ile)

1. **appstoreconnect.apple.com** → Uygulamalar → **Flockode**. Uygulama kaydı ilk iOS derlemesinde oluşur ([ilk-ios-derleme.md](ilk-ios-derleme.md)).
2. Sol menü → **Uygulama İçi Satın Almalar** (In-App Purchases) → **+**.
3. Tür: **Tüketilmeyen** (Non-Consumable).
   - Referans adı: `Flockode Tam Sürüm`
   - Ürün kimliği: `com.yasarss.flockode.full` (birebir aynı yazılmalı)
4. **Fiyat** seç (Robo Rota ile aynı fiyat düzeyi önerilir).
5. **Yerelleştirme** ekle. En az Türkçe ve İngilizce:
   - TR: Ad "Tam Sürüm", açıklama "Dünya 3–20 ve 180 yeni seviye."
   - EN: Ad "Full Version", açıklama "Worlds 3–20 and 180 new levels."
6. **İnceleme bilgisi**: Ekran görüntüsü olarak oyundaki "Tam sürüm" ekranının görüntüsünü yükle. Not: "Satın alma ebeveyn kontrolünün (çarpma sorusu) arkasında."
7. **Aile Paylaşımı**'nı aç (oyun metni "ailedeki tüm cihazlarda açık kalır" diyor).
8. Kaydet. İlk sürümü incelemeye gönderirken bu ürünü de sürüme ekle (Sürüm sayfası → Uygulama İçi Satın Almalar ve Abonelikler → ürünü seç).

TestFlight'ta denerken Apple gerçek para çekmez. Sandbox hesabıyla ya da TestFlight'ın kendi test ödemesiyle satın alınır.
