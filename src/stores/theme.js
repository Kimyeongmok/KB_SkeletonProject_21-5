import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const THEME_STORAGE_KEY = "app-theme";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const SUPPORTED_THEMES = ["system", "light", "dark", "bono"];

  const theme = ref("system");
  const actualTheme = ref("light");

  let hasInitialized = false;
  let removeSystemThemeListener = null;

  const resolveActualTheme = () => {
    actualTheme.value =
      theme.value === "system" ? (mediaQuery.matches ? "dark" : "light") : theme.value;
  };

  const applyTheme = () => {
    const root = document.documentElement;

    root.classList.toggle("dark", actualTheme.value === "dark");
    root.classList.toggle("bono", actualTheme.value === "bono");
    root.style.colorScheme = actualTheme.value === "dark" ? "dark" : "light";
  };

  const saveTheme = () => {
    localStorage.setItem(THEME_STORAGE_KEY, theme.value);
  };

  const attachSystemThemeListener = () => {
    if (removeSystemThemeListener) {
      removeSystemThemeListener();
      removeSystemThemeListener = null;
    }

    if (theme.value !== "system") {
      return;
    }

    const onSystemThemeChange = () => {
      resolveActualTheme();
      applyTheme();
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onSystemThemeChange);
      removeSystemThemeListener = () => {
        mediaQuery.removeEventListener("change", onSystemThemeChange);
      };
      return;
    }

    mediaQuery.addListener(onSystemThemeChange);
    removeSystemThemeListener = () => {
      mediaQuery.removeListener(onSystemThemeChange);
    };
  };

  const changeTheme = (newTheme) => {
    if (!SUPPORTED_THEMES.includes(newTheme)) {
      return;
    }

    console.log("selected theme:", newTheme);
    theme.value = newTheme;
    saveTheme();
    resolveActualTheme();
    applyTheme();
    attachSystemThemeListener();
  };

  const initTheme = () => {
    if (hasInitialized) {
      return;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (SUPPORTED_THEMES.includes(savedTheme)) {
      theme.value = savedTheme;
    }

    resolveActualTheme();
    applyTheme();
    attachSystemThemeListener();

    hasInitialized = true;
  };

  return {
    theme,
    actualTheme,
    initTheme,
    changeTheme,
    applyTheme,
  };
});
