# İlk iOS derlemesi (bir kez, bilgisayarsız)

Apple, yeni bir uygulamanın imza sertifikası ve profilinin ilk seferde Apple hesabıyla giriş yapılarak oluşturulmasını istiyor. Bu adım etkileşimli. Bilgisayar yerine **GitHub Codespaces** kullanılıyor: iPad'de Safari'den açılan, tarayıcı içinde çalışan bir terminal. Kişisel hesaplarda her ay ücretsiz kullanım süresi var. Bu iş 10–15 dakika sürer.

Sonraki bütün derlemeler yalnızca GitHub → Actions → **iOS build (TestFlight)** → **Run workflow** ile yapılır.

## Hazırlık

- Apple Developer hesabın (Cocktail Lover için kullandığın hesap) ve telefonun yanında olsun. Apple 6 haneli doğrulama kodu gönderecek.
- expo.dev kullanıcı adın ve şifren.

## Adımlar

1. iPad'de Safari ile **github.com/yasareminsolmaz-blip/flockode** sayfasını aç.
2. Yeşil **Code** düğmesi → **Codespaces** sekmesi → **Create codespace on main**.
   - Bir-iki dakika içinde tarayıcıda VS Code açılır. Altta **Terminal** paneli olur. Görünmüyorsa: sol üstteki ☰ menü → Terminal → New Terminal.
3. Terminale sırayla şunları yaz (her satırdan sonra Enter):

   ```bash
   npm install
   npx eas-cli@latest login
   npx eas-cli@latest build --platform ios --profile production --auto-submit
   ```

4. `login`: expo.dev kullanıcı adı ve şifresi.
5. `build` komutunun soruları:
   - "Do you want to log in to your Apple account?" → **Y**. Apple ID ve şifreni gir, telefonuna gelen 6 haneli kodu yaz.
   - Takım (team) sorulursa Cocktail Lover'daki takımı seç.
   - Sertifika ve provisioning profile soruları → hepsine **Enter** (EAS kendisi oluşturur ve saklar). "Reuse this distribution certificate?" diye sorarsa **Y** de.
   - App Store Connect'te uygulama kaydı yoksa EAS oluşturmayı önerir → **Y**. Ad olarak "Flockode" kullanılır. Bu ad App Store'da başkası tarafından alınmışsa hata verir. O durumda bana yaz, adı değiştiririz.
   - "--auto-submit" için App Store Connect API anahtarı sorulursa → **Y**.
6. Terminalde "Build queued" ya da bir expo.dev bağlantısı görünce iş bitmiştir. Derleme EAS sunucularında devam eder (15–25 dakika). Codespace sekmesini kapatabilirsin.
7. Codespace'i silmek için: github.com/codespaces → flockode satırındaki **…** → **Delete**. Böylece ücretsiz süren harcanmaz.

## Sonra

- Derleme App Store Connect'e otomatik gönderilir. Apple'ın işlemesi 10–30 dakika sürer.
- iPad'de **TestFlight** uygulamasını aç. Flockode orada görünür (App Store Connect → TestFlight → Internal Testing grubuna kendini eklemen gerekebilir).
