# 🚀 FomoApp - React Native com Expo 53

Um aplicativo moderno para descobrir lugares próximos, construído com React Native e Expo 53, seguindo as melhores práticas de arquitetura e desenvolvimento.

## ✨ Características

- 🗺️ **Mapas Interativos** - Visualização de lugares próximos
- 📍 **Localização em Tempo Real** - GPS preciso
- 🔍 **Busca Inteligente** - Encontre lugares por categoria
- 🌤️ **Informações de Clima** - Dados meteorológicos
- 🎨 **Design Moderno** - Interface limpa e responsiva
- ⚡ **Performance Otimizada** - Carregamento rápido
- 🔧 **Arquitetura Escalável** - Código bem organizado

## 🏗️ Arquitetura

O projeto segue uma arquitetura moderna e escalável:

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas da aplicação
├── hooks/          # Custom hooks
├── services/       # Serviços externos
├── types/          # Tipos TypeScript
├── utils/          # Utilitários
├── constants/      # Constantes
├── config/         # Configurações
└── theme/          # Sistema de design
```

### 🎯 Princípios

- **Separation of Concerns** - Responsabilidades bem definidas
- **Component Composition** - Componentes pequenos e reutilizáveis
- **Custom Hooks** - Lógica de negócio isolada
- **Type Safety** - TypeScript em toda a aplicação
- **Clean Code** - Código limpo e auto-documentado

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd FomoApp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Inicie o projeto**
   ```bash
   npx expo start
   ```

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
npm run build      # Build para produção
npm run lint       # Executa o linter
npm run type-check # Verifica tipos TypeScript
```

## 📱 Funcionalidades

### 🗺️ Mapa Interativo
- Visualização de lugares próximos
- Marcadores customizados por categoria
- Navegação suave e responsiva

### 📍 Localização
- GPS de alta precisão
- Permissões automáticas
- Tratamento de erros robusto

### 🔍 Busca de Lugares
- Filtros por categoria
- Busca por nome
- Resultados em tempo real

### 🌤️ Clima
- Dados meteorológicos atuais
- Interface intuitiva
- Atualizações automáticas

## 🛠️ Tecnologias

- **React Native** - Framework principal
- **Expo 53** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Expo Location** - Serviços de localização
- **React Native Maps** - Mapas
- **Bottom Sheet** - Interface de usuário

## 🎨 Sistema de Design

O projeto utiliza um sistema de design consistente:

- **Cores**: Paleta completa com variações
- **Tipografia**: Fontes padronizadas
- **Espaçamentos**: Sistema consistente
- **Sombras**: Efeitos visuais padronizados
- **Responsividade**: Adaptação a diferentes telas

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── common/          # Componentes básicos
│   ├── maps/            # Componentes de mapa
│   ├── sheets/          # Bottom sheets
│   └── weather/         # Componentes de clima
├── screens/
│   └── Home/            # Tela principal
├── hooks/               # Custom hooks
├── services/            # Serviços externos
├── types/               # Tipos TypeScript
├── utils/               # Utilitários
├── constants/           # Constantes
├── config/              # Configurações
└── theme/               # Sistema de design
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### API Keys Necessárias

- **Google Maps API Key** - Para mapas e geocoding
- **Backend URL** - Para APIs de lugares e clima

## 🧪 Testes

```bash
npm test              # Executa todos os testes
npm run test:watch    # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```

## 📦 Build e Deploy

### Android

```bash
npx expo build:android
```

### iOS

```bash
npx expo build:ios
```

### Web

```bash
npx expo build:web
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@fomoapp.com
- 💬 Discord: [FomoApp Community](https://discord.gg/fomoapp)
- 📖 Documentação: [docs.fomoapp.com](https://docs.fomoapp.com)


---

Desenvolvido com ❤️ pela equipe FomoApp
