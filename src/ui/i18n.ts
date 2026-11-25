export const STRINGS: Record<string, Record<string, string>> = {
  'pt-BR': {
    newWorld: 'Novo Mundo', continue_: 'Continuar', settings: 'Configurações', credits: 'Créditos', back: 'Voltar',
    worldName: 'Nome do mundo', seed: 'Seed (opcional)', difficulty: 'Dificuldade', create: 'Criar Mundo',
    play: 'Jogar', rename: 'Renomear', delete: 'Excluir', export: 'Exportar', import: 'Importar',
    confirmDelete: 'Excluir este mundo permanentemente?', yes: 'Sim', no: 'Não', save: 'Salvar', pause: 'Pausado',
    resume: 'Continuar', quitToMenu: 'Sair para o menu', inventory: 'Inventário', crafting: 'Crafting',
    sort: 'Organizar', close: 'Fechar', health: 'Vida', hunger: 'Fome', day: 'Dia', night: 'Noite',
    died: 'Você morreu!', respawn: 'Renascer', volumeMaster: 'Volume geral', volumeMusic: 'Música', volumeSfx: 'Efeitos',
    uiScale: 'Escala da interface', highContrast: 'Alto contraste', reducedMotion: 'Reduzir animações',
    touchSize: 'Tamanho dos controles', language: 'Idioma', controls: 'Controles', creditsText: 'Raiz — jogo sandbox survival original. Código MIT, assets CC BY 4.0.',
    noWorlds: 'Nenhum mundo ainda. Crie seu primeiro mundo!', loading: 'Carregando...', saved: 'Mundo salvo!',
  },
  'en': {
    newWorld: 'New World', continue_: 'Continue', settings: 'Settings', credits: 'Credits', back: 'Back',
    worldName: 'World name', seed: 'Seed (optional)', difficulty: 'Difficulty', create: 'Create World',
    play: 'Play', rename: 'Rename', delete: 'Delete', export: 'Export', import: 'Import',
    confirmDelete: 'Delete this world permanently?', yes: 'Yes', no: 'No', save: 'Save', pause: 'Paused',
    resume: 'Resume', quitToMenu: 'Quit to menu', inventory: 'Inventory', crafting: 'Crafting',
    sort: 'Sort', close: 'Close', health: 'Health', hunger: 'Hunger', day: 'Day', night: 'Night',
    died: 'You died!', respawn: 'Respawn', volumeMaster: 'Master volume', volumeMusic: 'Music', volumeSfx: 'SFX',
    uiScale: 'UI scale', highContrast: 'High contrast', reducedMotion: 'Reduced motion',
    touchSize: 'Control size', language: 'Language', controls: 'Controls', creditsText: 'Raiz — original sandbox survival. MIT code, CC BY 4.0 assets.',
    noWorlds: 'No worlds yet. Create your first world!', loading: 'Loading...', saved: 'World saved!',
  },
};
export function t(key: string, lang = 'pt-BR'): string { return STRINGS[lang]?.[key] ?? STRINGS['pt-BR']?.[key] ?? key; }
