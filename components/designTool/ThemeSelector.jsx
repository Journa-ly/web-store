import { useEffect, useState } from 'react';
import { SERVER_URL } from './constants';

const ThemeSelector = ({ defaultTheme }) => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');

  useEffect(() => {
    // Fetch themes from the API
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/images/themes`, {
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          credentials: 'include'
        });
        const data = await response.json();
        setThemes(data);
        if (data.length > 0) {
          if (defaultTheme) {
            setSelectedTheme(defaultTheme);
          } else {
            setSelectedTheme(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    if (defaultTheme) {
      setSelectedTheme(defaultTheme);
    } else if (themes.length > 0) {
      setSelectedTheme(themes[0].id);
    }
  }, [defaultTheme]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Style (optional)</label>
      <select
        id="theme-select"
        name="selectedTheme"
        value={selectedTheme}
        onChange={handleThemeChange}
      >
        <option key={-1} value={null} />
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
