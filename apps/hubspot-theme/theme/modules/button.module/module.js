// Island hydration script
import { Button } from '@huble/ui';
import { createRoot } from 'react-dom/client';

document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-component="Button"]');

  containers.forEach((container) => {
    const props = JSON.parse(container.dataset.props || '{}');
    const root = createRoot(container);
    root.render(<Button {...props} />);
  });
});
