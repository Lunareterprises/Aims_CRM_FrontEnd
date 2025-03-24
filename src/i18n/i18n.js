import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = sessionStorage.getItem("appLanguage") || "en"; // Default to 'en' if no saved language

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: savedLanguage, // Initialize with saved language
  debug: true, // Enable debugging
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
        "Change Language": "Change Language",
        "Edit Profile":"Edit Profile",
        "Settings":"Settings",
        "Language":"Language" ,
        "Sign Out":"Sign Out",
        "Home": "Home",
        "Dashboard": "Dashboard",
        "General Ledger": "General Ledger",
        "Profile": "Profile",
        "Edit Profile": "Edit Profile",
        "Language": "Language",
        "Products": "Products"
      },
    },
    ar: {
      translation: {
        "welcome": "مرحبًا",
        "Change Language": "تغيير اللغة",
        "Edit Profile": "تعديل الملف الشخصي",
        "Settings": "الإعدادات",
        "Language": "اللغة",
        "Sign Out": "تسجيل الخروج",
        "Home": "الرئيسية",
        "Dashboard": "لوحة التحكم",
        "General Ledger": "دفتر الأستاذ العام",
        "Profile": "الملف الشخصي",
        "Edit Profile": "تعديل الملف الشخصي",
        "Language": "اللغة",
        "Products": "المنتجات"

      },
    },
  },
});

export default i18n;
