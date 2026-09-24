const fs = require('fs');

let content = fs.readFileSync('components/HabitatsBrowser.tsx', 'utf-8');

content = content.replace(
  `import { useState } from 'react';`,
  `import { useState, useEffect } from 'react';\nimport { useRouter, useSearchParams, usePathname } from 'next/navigation';`
);

content = content.replace(
  `export function HabitatsBrowser() {`,
  `export function HabitatsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedYear, setSelectedYear] = useState<string | null>(searchParams.get('year'));
  const [viewMode, setViewMode] = useState<'all' | 'gcse'>((searchParams.get('mode') as 'all' | 'gcse') || 'all');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (viewMode === 'all') {
      if (params.has('mode')) { params.delete('mode'); changed = true; }
    } else {
      if (params.get('mode') !== viewMode) { params.set('mode', viewMode); changed = true; }
    }

    if (selectedCategory) {
      if (params.get('category') !== selectedCategory) { params.set('category', selectedCategory); changed = true; }
    } else {
      if (params.has('category')) { params.delete('category'); changed = true; }
    }

    if (selectedYear) {
      if (params.get('year') !== selectedYear) { params.set('year', selectedYear); changed = true; }
    } else {
      if (params.has('year')) { params.delete('year'); changed = true; }
    }

    if (changed) {
      router.replace(\`\${pathname}?\${params.toString()}\`, { scroll: false });
    }
  }, [viewMode, selectedCategory, selectedYear, pathname, router, searchParams]);

  useEffect(() => {
    // Sync state if URL changes externally
    const mode = searchParams.get('mode') as 'all' | 'gcse';
    if (mode && mode !== viewMode) setViewMode(mode);
    else if (!mode && viewMode !== 'all') setViewMode('all');

    const cat = searchParams.get('category');
    if (cat !== selectedCategory) setSelectedCategory(cat);

    const yr = searchParams.get('year');
    if (yr !== selectedYear) setSelectedYear(yr);
  }, [searchParams]);
`
);

// We need to remove the original useState lines
content = content.replace(/  const \[selectedCategory, setSelectedCategory\] = useState<string \| null>\(null\);\n/, '');
content = content.replace(/  const \[selectedYear, setSelectedYear\] = useState<string \| null>\(null\);\n/, '');
content = content.replace(/  const \[viewMode, setViewMode\] = useState<'all' | 'gcse'>\('all'\);\n/, '');

fs.writeFileSync('components/HabitatsBrowser.tsx', content);
