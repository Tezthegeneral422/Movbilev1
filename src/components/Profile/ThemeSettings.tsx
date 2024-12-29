import React from 'react';
import { Palette } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';

const themes = [
  { name: 'lime', color: '#9FFF32' },
  { name: 'blue', color: '#4169E1' },
  { name: 'purple', color: '#9D4EDD' },
  { name: 'pink', color: '#FF69B4' },
  { name: 'orange', color: '#FF7F50' },
];

export function ThemeSettings() {
  const { updateProfile } = useProfile();
  const [selectedColor, setSelectedColor] = React.useState(themes[0].color);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty('--accent-color', color);
    updateProfile({ theme: color });
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
          <Palette className="w-4 h-4 text-pink-500" />
        </div>
        <h2 className="text-lg font-semibold">Theme Customization</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => handleColorChange(theme.color)}
            className={`w-12 h-12 rounded-xl transition-transform ${
              selectedColor === theme.color ? 'scale-110 ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: theme.color }}
          />
        ))}
      </div>

      <div>
        <label className="text-sm text-gray-400">Custom Color</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="block w-full h-10 mt-2 rounded-xl"
        />
      </div>
    </div>
  );
}