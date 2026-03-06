
const modules = import.meta.glob('./*/*.ts', { eager: true });

const messages: Record<string, { translation: Record<string, any> }> = {};

Object.keys(modules).forEach((path) => {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (match) {
    const [, lang] = match;
    const module = modules[path] as { default?: Record<string, any>; [key: string]: any };
    
    if (!messages[lang]) {
      messages[lang] = { translation: {} };
    }
    
    // دمج محتوى الترجمة
    if (module.default) {
      messages[lang].translation = {
        ...messages[lang].translation,
        ...module.default
      };
    } else {
      // إذا لم يكن هناك default export، استخدم named exports
      const namedExports = Object.keys(module).filter(key => key !== 'default');
      namedExports.forEach(exportName => {
        messages[lang].translation = {
          ...messages[lang].translation,
          ...module[exportName]
        };
      });
    }
  }
});

export default messages;
