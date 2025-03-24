import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, FormLabel } from "react-bootstrap"; // React Bootstrap components

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  // Set the language from sessionStorage or default to "en"
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("appLanguage") || "en";
    i18n.changeLanguage(savedLanguage);
  
    
  }, [i18n]);

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Switch the language
    sessionStorage.setItem("appLanguage", lang); // Store the language in sessionStorage
    // document.documentElement.lang = lang; // Update the <html> lang attribute
    // document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; // Update text direction
  };

  return (
    <div className="container">
      <Form.Group controlId="language-select">
        <FormLabel>{t("Change Language")}</FormLabel>
        <Form.Select
          onChange={(e) => handleChangeLanguage(e.target.value)}
          value={i18n.language || document.documentElement.lang} // Ensure the correct value is selected
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </Form.Select>
      </Form.Group>
    </div>
  );
};

export default LanguageSwitcher;
