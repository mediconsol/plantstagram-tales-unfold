const fs = require('fs');
const path = require('path');

// PWA 아이콘 생성을 위한 SVG 템플릿들
const createPWAIcon = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.1 : 0; // maskable 아이콘은 10% 패딩
  const iconSize = size - (padding * 2);
  const offset = padding;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGradient" cx="0.3" cy="0.3" r="0.8">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </radialGradient>
    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>

  ${isMaskable ? `<rect width="${size}" height="${size}" fill="#22c55e"/>` : ''}
  
  <g transform="translate(${offset}, ${offset})">
    <circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize/2}" fill="url(#bgGradient)"/>

    <!-- Sprout/seedling icon -->
    <g transform="translate(${iconSize * 0.1875}, ${iconSize * 0.125})">
      <!-- Stem -->
      <rect x="${iconSize * 0.28125}" y="${iconSize * 0.4375}" width="${iconSize * 0.0625}" height="${iconSize * 0.3125}" fill="#15803d" rx="${iconSize * 0.03125}"/>

      <!-- Left leaf (larger) -->
      <path d="M${iconSize * 0.09375} ${iconSize * 0.3125} C${iconSize * 0.09375} ${iconSize * 0.25}, ${iconSize * 0.1875} ${iconSize * 0.1875}, ${iconSize * 0.3125} ${iconSize * 0.28125} C${iconSize * 0.3125} ${iconSize * 0.375}, ${iconSize * 0.21875} ${iconSize * 0.4375}, ${iconSize * 0.09375} ${iconSize * 0.375} Z" fill="url(#leafGradient)"/>

      <!-- Right leaf (larger) -->
      <path d="M${iconSize * 0.53125} ${iconSize * 0.3125} C${iconSize * 0.53125} ${iconSize * 0.25}, ${iconSize * 0.4375} ${iconSize * 0.1875}, ${iconSize * 0.3125} ${iconSize * 0.28125} C${iconSize * 0.3125} ${iconSize * 0.375}, ${iconSize * 0.40625} ${iconSize * 0.4375}, ${iconSize * 0.53125} ${iconSize * 0.375} Z" fill="#16a34a"/>

      <!-- Small leaves on stem -->
      <ellipse cx="${iconSize * 0.25}" cy="${iconSize * 0.5}" rx="${iconSize * 0.046875}" ry="${iconSize * 0.025}" fill="#22c55e" transform="rotate(-30 ${iconSize * 0.25} ${iconSize * 0.5})"/>
      <ellipse cx="${iconSize * 0.375}" cy="${iconSize * 0.5625}" rx="${iconSize * 0.046875}" ry="${iconSize * 0.025}" fill="#22c55e" transform="rotate(30 ${iconSize * 0.375} ${iconSize * 0.5625})"/>

      <!-- Center bud -->
      <circle cx="${iconSize * 0.3125}" cy="${iconSize * 0.28125}" r="${iconSize * 0.05625}" fill="#15803d"/>
      <circle cx="${iconSize * 0.3125}" cy="${iconSize * 0.28125}" r="${iconSize * 0.03125}" fill="#34d399"/>
    </g>
  </g>
</svg>`;
};

// 아이콘 파일들 생성
const icons = [
  { name: 'pwa-64x64.png', size: 64 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'maskable-icon-512x512.png', size: 512, maskable: true }
];

const publicDir = path.join(__dirname, 'public');

icons.forEach(icon => {
  const svgContent = createPWAIcon(icon.size, icon.maskable);
  const svgPath = path.join(publicDir, `${icon.name.replace('.png', '.svg')}`);
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Generated ${svgPath}`);
});

console.log('PWA 아이콘 SVG 파일들이 생성되었습니다.');
console.log('PNG 변환을 위해서는 온라인 SVG to PNG 컨버터를 사용하거나');
console.log('ImageMagick, Inkscape 등의 도구를 사용하세요.');
