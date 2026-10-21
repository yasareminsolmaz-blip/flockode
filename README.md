# Flockode

8–12 yaş için iPad ve iPhone kodlama bulmacası. Çocuk tek bir kod yazar, sahnedeki **bütün kuzular aynı kodu aynı anda** çalıştırır. Kuzular farklı yerlerden ve farklı yönlere bakarak başladığı için ezber bir rota işe yaramaz; her kuzuda çalışan genel bir kural bulmak gerekir. Expo (React Native + TypeScript) ile yazıldı. Arayüz 6 dilde: Türkçe, İngilizce, Almanca, İspanyolca, Felemenkçe ve Fransızca. Hesap, reklam ve internet bağlantısı gerekmez. İlerleme yalnızca cihazda saklanır.

*An iPad and iPhone coding puzzle for ages 8–12: write one program and every sheep in the flock runs it at once. Expo (React Native + TypeScript); six languages; no accounts, ads or network.*

## Oyun

- Kod, "EĞER durum → hareket" kurallarından ve en altta bir YOKSA satırından oluşur (en fazla 4 kural). Her adımda her kuzu kuralları yukarıdan aşağı okur, tutan ilk kuralı yapar.
- **3 yıldız:** sürü ahıra girdi · kod her kareden çalışıyor · kod en kısa satır sayısında.
- **Karıştır** kuzuları rastgele dağıtır. **Her kareden dene**, her kareyi ve her yönü tek tek dener, tahtayı yeşil, sarı ve kırmızıyla boyar. Kuzular birbirini engellemediği için bu test kesin bir doğruluk testidir.
- Hep aynı yolda dönen kuzular soru işaretiyle gösterilir (sonsuz döngü).
- **Dünya 1 Çayır:** önüm çit, dönüşler, sonra sağına ve soluna bakmak. **Dünya 2 Labirent:** çiçek tabelaları ve "sap" hareketleri (dön ve aynı adımda ilerle), sağ el ve sol el kuralı. Yeni dünyalar sonra eklenecek.
- Ana ekranda Robo Rota tanıtım kartı var. App Store bağlantısı ebeveyn kontrolünün (çarpma sorusu) arkasında.

## Kod yapısı

| Yol | İçerik |
| --- | --- |
| `src/game/engine.ts` | Oyun kuralları: algılama, hareketler, döngü tespiti, her-kare testi, yıldızlar. Seviye üreticisiyle birebir aynı. |
| `src/game/levels.json` | 2 dünya, 20 seviye: harita, kullanılabilir araçlar, en kısa çözüm. `scripts/levels.ts` üretir. |
| `scripts/levels.ts` | Seviye listesi. Her alan için en kısa çalışan kodu arar ve `levels.json` dosyasını yazar: `node --no-warnings scripts/levels.ts` |
| `scripts/explore.ts` | Yeni seviye adayları arar (rastgele labirent ve tarlalar, yeni bir şey öğreten kodlar). |
| `src/game/engine.test.ts` | Kurallar ve her seviyenin kayıtlı çözümünün her kareden gerçekten çalıştığını doğrular. |
| `src/app/` | Ekranlar: ana ekran, dünya, seviye (oyun). |
| `src/components/` | Tahta ve kuzu animasyonu, kod düzenleyici, Robo Rota kartı, ebeveyn kontrolü, ortak düğmeler. |
| `src/i18n/` | Arayüz metinleri (`strings.ts`), dünya/seviye adları ve ipuçları (`content.ts`). Testler her dilde eksik metin olmadığını denetler. |
| `scripts/make-icons.py`, `scripts/make-sounds.py` | Uygulama simgesi ve ses efektleri. |

## Derleme (bilgisayar gerekmez)

| İş akışı | Ne zaman | Ne yapar |
| --- | --- | --- |
| **Check** | Her PR ve main'e her gönderim | Paketleri kurar, tip kontrolü, testler, lint, iOS paketi. PR'da `package-lock.json` dosyasını otomatik ekler. |
| **EAS Update (Expo Go)** | main'e her gönderim | İlk çalışmada EAS projesini oluşturur. Son sürümü yayınlar, iPad'deki **Expo Go**'da denenebilir. |
| **iOS build (TestFlight)** | Elle: Actions → Run workflow | EAS bulutunda iOS derler ve TestFlight'a gönderir. |

- GitHub deposunda `EXPO_TOKEN` gizli anahtarı tanımlı olmalı (Settings → Secrets and variables → Actions).
- **İlk iOS derlemesi** bir kez etkileşimli yapılmalı: [docs/ilk-ios-derleme.md](docs/ilk-ios-derleme.md).

## Expo Go ile deneme

expo.dev → **flockode** projesi → **Updates** → **main** kanalındaki son güncellemeyi iPad'deki Expo Go ile aç.
