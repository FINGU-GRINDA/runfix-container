import {
  translateAndFit,
  getGrindaTranslateFn,
} from "https://cdn.jsdelivr.net/npm/runfix-container/+esm";

// Environment variables
const GRINDA_TRANSLATE_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUcmFuc2xhdGlvbiBBUEkiLCJzdWIiOiJ7XCJpZFwiOlwiY205OWx0d3U1MDAwMHVnODZmdmwwNWNpc1wiLFwiY3JlYXRlZEF0XCI6XCIyMDI1LTA0LTA5VDA3OjI1OjE0LjIzN1pcIixcInVwZGF0ZWRBdFwiOlwiMjAyNS0wNC0wOVQwNzoyNToxNC4yMzdaXCIsXCJmaXJzdE5hbWVcIjpcInZpa3lcIixcImxhc3ROYW1lXCI6XCJ3XCIsXCJwcm9maWxlUGljdHVyZVwiOm51bGwsXCJyb2xlXCI6XCJVU0VSXCJ9In0.9VYoror4E6TtznQANHehjr4M1ipHGbF2nBuOxySO64Y";
const GRINDA_TRANSLATE_BASE_URL = "https://hana-i18n.198.23.164.177.sslip.io";

// extract source language from html lang
const currentLanguage = document.documentElement.lang;

// extract target language from url query param
const urlParams = new URLSearchParams(window.location.search);
const targetLanguage = urlParams.get("lang");

// can be adjusted at will to suit your needs, when to trigger the translation
if (targetLanguage !== currentLanguage) {
  console.info(
    `Translation from ${currentLanguage} to ${targetLanguage} started`,
  );
  await translateAndFit({
    sourceLanguage: currentLanguage,
    targetLanguage: targetLanguage,
    fitConfig: {
      addOverflowBreak: true,
    },
    translateConfig: {
      translateFn: getGrindaTranslateFn({
        apiKey: GRINDA_TRANSLATE_API_KEY,
        baseUrl: GRINDA_TRANSLATE_BASE_URL,
      }),
    },
  });
  console.info(
    `Translation from ${currentLanguage} to ${targetLanguage} completed`,
  );
  document.documentElement.lang = targetLanguage;
}
