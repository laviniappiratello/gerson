# Guia de Internacionalização (i18n) - Persephone

## Visão Geral

Este projeto usa **i18next** para suporte a múltiplos idiomas. Atualmente, há suporte para:
- **pt-BR**: Português Brasileiro (padrão)
- **en**: Inglês

## Estrutura de Arquivos

```
src/
├── i18n/
│   ├── config.ts              # Configuração do i18next
│   └── useTranslation.ts      # Hook customizado para usar traduções
├── locales/
│   ├── pt-BR.json            # Traduções em Português Brasileiro
│   └── en.json               # Traduções em Inglês
└── components/
    └── LanguageSwitcher.tsx   # Componente para trocar idioma
```

## Como Usar Traduções

### Em Componentes React

```typescript
import { useTranslation } from '../../src/i18n/useTranslation';

export function MeuComponente() {
  const { t } = useTranslation();

  return <Text>{t('chave.de.traducao')}</Text>;
}
```

### Com Interpolação

Para usar variáveis nas traduções, use a sintaxe `{{variavel}}` no JSON:

**No arquivo de tradução (pt-BR.json):**
```json
{
  "tiragem": {
    "draw": "TIRAR {{count}} CARTAS"
  }
}
```

**No componente:**
```typescript
const { t } = useTranslation();
<Text>{t('tiragem.draw', { count: '3' })}</Text>
```

## Adicionando Novas Traduções

### 1. Adicionar a Chave nos Arquivos de Tradução

**src/locales/pt-BR.json:**
```json
{
  "meuComponente": {
    "titulo": "Meu Título em Português",
    "descricao": "Uma descrição qualquer"
  }
}
```

**src/locales/en.json:**
```json
{
  "meuComponente": {
    "titulo": "My English Title",
    "descricao": "Some description"
  }
}
```

### 2. Usar no Componente

```typescript
import { useTranslation } from '../../src/i18n/useTranslation';

export function MeuComponente() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('meuComponente.titulo')}</Text>
      <Text>{t('meuComponente.descricao')}</Text>
    </View>
  );
}
```

## Trocando o Idioma Programaticamente

Use o hook `useLanguage`:

```typescript
import { useLanguage } from '../../src/i18n/useTranslation';

export function BotaoMudarIdioma() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <TouchableOpacity onPress={() => changeLanguage('en')}>
      <Text>Mudar para Inglês</Text>
    </TouchableOpacity>
  );
}
```

## Componente LanguageSwitcher

Um componente pré-pronto para permitir que usuários mudem de idioma:

```typescript
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';

export function MinhasConfigurações() {
  return (
    <ScrollView>
      <LanguageSwitcher />
    </ScrollView>
  );
}
```

## Persistência de Idioma

O idioma selecionado é automaticamente salvo no AsyncStorage usando a chave `@persephone/language`. Quando o app é reiniciado, o idioma anterior é restaurado.

## Detecção Automática de Idioma

O idioma é detectado automaticamente:
1. Primeiro, verifica se há uma preferência salva no AsyncStorage
2. Se não houver, usa o idioma padrão: **pt-BR**

## Estrutura de Chaves de Tradução

As chaves são organizadas por contexto:

- `common.*` - Textos comuns (OK, Cancelar, etc)
- `navigation.*` - Títulos de navegação
- `auth.*` - Textos de autenticação
- `dashboard.*` - Textos da tela de dashboard
- `tiragem.*` - Textos da tela de tiradas
- `decks.*` - Nomes dos baralhos
- `glossary.*` - Textos do glossário
- `rituals.*` - Textos de rituais
- `astralMap.*` - Textos do mapa astral
- `settings.*` - Textos de configurações

## Boas Práticas

1. ✅ Mantenha as chaves em ordem alfabética
2. ✅ Use nomes de chaves descritivos
3. ✅ Agrupe chaves por contexto
4. ✅ Sempre traduza para ambos os idiomas
5. ✅ Use interpolação para variáveis dinâmicas
6. ✅ Revise as traduções para garantir qualidade

## Adicionando um Novo Idioma

Para adicionar um novo idioma (ex: espanhol):

### 1. Criar arquivo de tradução

Copie `pt-BR.json` ou `en.json` para `es.json` e tradua todas as chaves.

### 2. Atualizar a configuração

**src/i18n/config.ts:**
```typescript
import es from '../locales/es.json';

i18n.use(initReactI18next).init({
  // ...
  resources: {
    'pt-BR': { translation: pt_BR },
    'en': { translation: en },
    'es': { translation: es },  // Novo idioma
  },
  // ...
});
```

### 3. Atualizar o componente LanguageSwitcher

**src/components/LanguageSwitcher.tsx:**
```typescript
const languageOptions = [
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },  // Novo idioma
];
```

## Testando Traduções

Para testar se as traduções estão funcionando:

1. Use o `LanguageSwitcher` para alternar entre idiomas
2. Verifique se todos os textos mudam corretamente
3. Procure por chaves que ainda contêm valores em português hardcoded

## Troubleshooting

### Tradução não aparece

**Problema:** `t('chave.inexistente')` retorna a chave em vez do texto.

**Solução:** Verifique se a chave existe nos arquivos JSON. O i18next retorna a chave como fallback se não encontrar a tradução.

### Idioma não persiste após reiniciar o app

**Problema:** O idioma volta para pt-BR.

**Solução:** Verifique se o AsyncStorage está funcionando corretamente e se não há erros no console.

### Textos em inglês não aparecem

**Problema:** Todos os textos aparecem em português mesmo após mudar para inglês.

**Solução:** 
1. Verifique se `changeLanguage` foi chamado corretamente
2. Reinicie o app
3. Verifique se o arquivo `en.json` contém todas as chaves necessárias

## Referências

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
