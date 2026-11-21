const pageCache = {}

export async function loadPage(name) {
  if (pageCache[name]) return pageCache[name]

  try {
    const module = await import(`../pages/${name}.js`)
    const html = typeof module.default === 'function' ? module.default() : module.default
    pageCache[name] = html
    return html
  } catch (e) {
    console.error(`Error loading page: ${name}`, e)
    return '<div class="text-center py-12"><p class="text-red-500">Error al cargar la página.</p></div>'
  }
}
