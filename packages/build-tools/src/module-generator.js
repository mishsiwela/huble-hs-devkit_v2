import fs from 'fs';
import path from 'path';

/**
 * Generate a HubSpot module from a React component
 * @param {Object} options - Generation options
 * @param {string} options.componentName - Name of React component (e.g., "Button")
 * @param {string} options.modulePath - Path where module should be created
 * @param {Array} options.props - Component props to map to HubSpot fields
 */
export function generateModule({ componentName, modulePath, props = [] }) {
  const moduleDir = path.join(modulePath, `${componentName.toLowerCase()}.module`);

  // Create module directory
  if (fs.existsSync(moduleDir)) {
    throw new Error(`Module already exists at ${moduleDir}`);
  }
  fs.mkdirSync(moduleDir, { recursive: true });

  // Generate fields.json
  const fields = props.map((prop) => ({
    id: prop.name,
    name: prop.name,
    label: prop.label || prop.name,
    required: prop.required || false,
    locked: false,
    type: prop.type || 'text',
    default: prop.default || '',
  }));

  fs.writeFileSync(
    path.join(moduleDir, 'fields.json'),
    JSON.stringify(fields, null, 2)
  );

  // Generate module.html
  const propsMappings = props
    .map((prop) => `       "${prop.name}": module.${prop.name}`)
    .join(',\n');

  const moduleHtml = `{# Thin adapter: Maps HubSpot fields → React props #}
{# Progressive enhancement: Works without JS, enhanced with React #}
<div id="${componentName.toLowerCase()}-{{ name }}"
     data-component="${componentName}"
     data-props='{{ {
${propsMappings}
     } | tojson }}'>
  {# Fallback content - gets replaced by React #}
  <div class="huble-${componentName.toLowerCase()}">
    Loading ${componentName}...
  </div>
</div>
`;

  fs.writeFileSync(path.join(moduleDir, 'module.html'), moduleHtml);

  // Generate module.js
  const moduleJs = `// Island hydration script for ${componentName} component
import { ${componentName} } from '@huble/ui';
import { createRoot } from 'react-dom/client';

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-component="${componentName}"]');

  containers.forEach((container) => {
    const props = JSON.parse(container.dataset.props || '{}');

    // Hydrate the island
    const root = createRoot(container);
    root.render(<${componentName} {...props} />);
  });
});
`;

  fs.writeFileSync(path.join(moduleDir, 'module.js'), moduleJs);

  // Generate meta.json
  const meta = {
    label: componentName,
    host_template_types: ['PAGE', 'BLOG_POST', 'BLOG_LISTING'],
    icon: '⚡',
    is_available_for_new_content: true,
    description: `${componentName} component`,
  };

  fs.writeFileSync(path.join(moduleDir, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`✅ Generated module at ${moduleDir}`);
  console.log('   Files created:');
  console.log('   - fields.json');
  console.log('   - module.html');
  console.log('   - module.js');
  console.log('   - meta.json');
}
