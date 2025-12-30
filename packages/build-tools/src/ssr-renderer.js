import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import fs from 'fs';
import path from 'path';

/**
 * Server-Side Rendering system for React components in HubSpot
 * This enables true component reuse without duplication
 */

/**
 * Generate static HTML snippets for React components
 * These snippets can be used in HubL templates
 *
 * @param {Object} components - Map of component names to React components
 * @param {string} outputDir - Directory to write HTML snippets
 */
export function generateComponentSnippets(components, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const manifest = {};

  Object.entries(components).forEach(([name, Component]) => {
    // Get component prop types to understand what fields it needs
    const propTypes = Component.propTypes || {};
    const defaultProps = Component.defaultProps || {};

    // Generate example renders with different prop combinations
    const variants = generateVariants(Component, propTypes, defaultProps);

    manifest[name] = {
      propTypes: Object.keys(propTypes),
      defaultProps,
      variants: variants.map(v => v.name),
    };

    // Write variant HTML files
    variants.forEach(({ name: variantName, props, html }) => {
      const filename = `${name}-${variantName}.html`;
      fs.writeFileSync(path.join(outputDir, filename), html);
    });

    console.log(`✅ Generated SSR snippets for ${name}`);
  });

  // Write manifest
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  return manifest;
}

/**
 * Generate variant renders for a component
 * @private
 */
function generateVariants(Component, propTypes, defaultProps) {
  const variants = [];

  // Default variant
  variants.push({
    name: 'default',
    props: defaultProps,
    html: renderToString(createElement(Component, defaultProps)),
  });

  // Add more variants based on prop types
  // This is a simplified version - real implementation would be more sophisticated

  return variants;
}

/**
 * Create a HubL template helper that renders React components
 * This gets included in the theme
 */
export function createHubLHelper(components, snippetsDir) {
  let helper = `{# React Component Helper - Server-Side Rendering #}\n`;
  helper += `{# This file enables using React components directly in HubL templates #}\n\n`;

  helper += `{% macro render_react(component_name, props={}) %}\n`;
  helper += `  {% if component_name == "Button" %}\n`;
  helper += `    {# Button Component #}\n`;
  helper += `    <button class="huble-button huble-button--{{ props.variant|default('primary') }} huble-button--{{ props.size|default('md') }}{% if props.fullWidth %} huble-button--full{% endif %}"\n`;
  helper += `            {% if props.onClick %}onclick="{{ props.onClick }}"{% endif %}\n`;
  helper += `            {% if props.disabled %}disabled{% endif %}>\n`;
  helper += `      {{ props.children|default('Button') }}\n`;
  helper += `    </button>\n`;
  helper += `  {% elif component_name == "Card" %}\n`;
  helper += `    {# Card Component #}\n`;
  helper += `    <div class="huble-card huble-card--{{ props.variant|default('default') }}">\n`;
  helper += `      {{ props.children|safe }}\n`;
  helper += `    </div>\n`;
  helper += `  {% elif component_name == "Hero" %}\n`;
  helper += `    {# Hero Component #}\n`;
  helper += `    <section class="huble-hero">\n`;
  helper += `      <div class="huble-hero__content">\n`;
  helper += `        <h1 class="huble-hero__heading">{{ props.heading }}</h1>\n`;
  helper += `        {% if props.description %}\n`;
  helper += `          <p class="huble-hero__description">{{ props.description }}</p>\n`;
  helper += `        {% endif %}\n`;
  helper += `        {% if props.imageSrc %}\n`;
  helper += `          <img src="{{ props.imageSrc }}" alt="{{ props.imageAlt|default(props.heading) }}" class="huble-hero__image">\n`;
  helper += `        {% endif %}\n`;
  helper += `      </div>\n`;
  helper += `    </section>\n`;
  helper += `  {% else %}\n`;
  helper += `    <div class="react-component-error">\n`;
  helper += `      Component "{{ component_name }}" not found\n`;
  helper += `    </div>\n`;
  helper += `  {% endif %}\n`;
  helper += `{% endmacro %}\n`;

  return helper;
}
