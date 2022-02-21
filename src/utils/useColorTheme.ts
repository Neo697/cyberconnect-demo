import { useColorScheme } from "react-native";

const isDarkMode = useColorScheme() === 'dark';

const backgroundStyle = {
  backgroundColor: isDarkMode ? '#000' : '#fff',
};

const fontColor = {
  color: isDarkMode ? '#fff' : '#000',
};

const followBgColor = {
  backgroundColor: isDarkMode ? '#fff' : '#000',
};

export default function useColorTheme () {
  return {
    backgroundStyle,
    fontColor,
    followBgColor,
  };
}
