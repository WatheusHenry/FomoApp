# 🏗️ Arquitetura FomoApp - Expo 53

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes básicos (Button, Loading, etc.)
│   ├── maps/            # Componentes relacionados ao mapa
│   ├── sheets/          # Bottom sheets
│   └── weather/         # Componentes de clima
├── screens/             # Telas da aplicação
│   └── Home/            # Tela principal
├── hooks/               # Custom hooks
├── services/            # Serviços externos (API, localização)
├── types/               # Tipos TypeScript
├── utils/               # Utilitários e helpers
├── constants/           # Constantes da aplicação
├── config/              # Configurações do projeto
└── theme/               # Tema e estilos
```

## 🎯 Princípios da Arquitetura

### 1. **Separation of Concerns**
- Cada pasta tem uma responsabilidade específica
- Componentes separados por funcionalidade
- Lógica de negócio isolada em hooks

### 2. **Component Composition**
- Componentes pequenos e reutilizáveis
- Props bem definidas com TypeScript
- Composição sobre herança

### 3. **Custom Hooks**
- Lógica de negócio isolada
- Reutilização de estado e efeitos
- Fácil testabilidade

### 4. **Type Safety**
- TypeScript em toda a aplicação
- Interfaces bem definidas
- Tipos centralizados

### 5. **Clean Code**
- Nomes descritivos
- Funções puras
- Código auto-documentado

## 📦 Organização dos Componentes

### `components/common/`
Componentes básicos reutilizáveis:
- `Button.tsx` - Botão customizado
- `LoadingScreen.tsx` - Tela de carregamento
- `Location.tsx` - Componente de localização
- `LocationError.tsx` - Tela de erro de localização
- `HomeButtons.tsx` - Botões da tela principal

### `components/maps/`
Componentes relacionados ao mapa:
- `MapContainer.tsx` - Container principal do mapa
- `CustomMarker.tsx` - Marcador customizado
- `UserLocationMarker.tsx` - Marcador da localização do usuário

### `components/sheets/`
Bottom sheets:
- `SearchPlaces.tsx` - Busca de lugares
- `PlaceDetails.tsx` - Detalhes do lugar

### `components/weather/`
Componentes de clima:
- `Weather.tsx` - Componente de clima

## 🎣 Custom Hooks

### `useLocation`
Gerencia toda lógica de localização:
- Permissões
- Obtenção de coordenadas
- Tratamento de erros
- Estado de loading

### `usePlaces`
Gerencia carregamento de lugares:
- Busca de lugares próximos
- Cache de dados
- Tratamento de erros
- Estado de loading

### `useTheme`
Fornece acesso ao tema:
- Cores
- Tipografia
- Espaçamentos
- Modo escuro/claro

## 🔧 Serviços

### `placesService.ts`
APIs relacionadas a lugares:
- `fetchNearbyPlaces` - Busca lugares próximos
- `fetchPlaceDetails` - Busca detalhes do lugar

## 📝 Tipos

### `location.ts`
Tipos relacionados à localização:
- `LocationRegion` - Região do mapa
- `LocationAddress` - Endereço

### `place.ts`
Tipos relacionados a lugares:
- `Place` - Lugar básico
- `PlaceDetails` - Detalhes do lugar
- `Review` - Avaliação

## 🎨 Tema

### Sistema de Design
- **Cores**: Paleta completa com variações
- **Tipografia**: Fontes e tamanhos padronizados
- **Espaçamentos**: Sistema de espaçamento consistente
- **Sombras**: Sombras padronizadas
- **Responsividade**: Breakpoints para diferentes telas

## ⚙️ Configurações

### `config/index.ts`
Configurações centralizadas:
- Ambiente (dev/prod)
- Plataforma (iOS/Android/Web)
- Localização
- Mapa
- Cache
- Performance

### `constants/`
Constantes organizadas:
- `api.ts` - Configurações da API
- `places.ts` - Constantes de lugares

## 🚀 Benefícios da Nova Arquitetura

1. **Manutenibilidade**: Código mais fácil de manter
2. **Escalabilidade**: Estrutura preparada para crescimento
3. **Reutilização**: Componentes e hooks reutilizáveis
4. **Testabilidade**: Lógica isolada facilita testes
5. **Performance**: Melhor gerenciamento de estado
6. **Consistência**: Padrões uniformes em todo o projeto

## 📋 Próximos Passos

1. **Implementar testes unitários**
2. **Adicionar gerenciamento de estado global**
3. **Implementar cache de dados**
4. **Adicionar analytics**
5. **Implementar PWA features**
6. **Otimizar performance**

## 🛠️ Ferramentas Recomendadas

- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Jest + Testing Library** - Testes
- **Storybook** - Documentação de componentes 