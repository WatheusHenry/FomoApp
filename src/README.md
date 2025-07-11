# Arquitetura FomoApp

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes básicos (Button, Input, etc.)
│   ├── maps/            # Componentes relacionados ao mapa
│   ├── sheets/          # Bottom sheets
│   └── weather/         # Componentes de clima
├── screens/             # Telas da aplicação
│   ├── Home/            # Tela principal
│   └── components/      # Componentes específicos da tela
├── hooks/               # Custom hooks
├── services/            # Serviços externos (API, localização)
├── stores/              # Gerenciamento de estado (Zustand/Context)
├── types/               # Tipos TypeScript
├── utils/               # Utilitários e helpers
├── constants/           # Constantes da aplicação
└── theme/               # Tema e estilos
```

## 🎯 Princípios da Arquitetura

1. **Separation of Concerns**: Cada pasta tem uma responsabilidade específica
2. **Component Composition**: Componentes pequenos e reutilizáveis
3. **Custom Hooks**: Lógica de negócio isolada em hooks
4. **Type Safety**: TypeScript em toda a aplicação
5. **Clean Code**: Nomes descritivos e funções puras
6. **DRY**: Evitar repetição de código
7. **SOLID**: Princípios de design orientado a objetos 