# 🚀 Guia de Migração - Nova Arquitetura FomoApp

## 📋 Resumo das Mudanças

### ✅ Melhorias Implementadas

1. **Custom Hooks**: Lógica de negócio isolada em hooks reutilizáveis
2. **Separação de Responsabilidades**: Cada pasta tem uma função específica
3. **Tipos Centralizados**: TypeScript bem estruturado
4. **Serviços Organizados**: APIs e serviços externos centralizados
5. **Componentes Modulares**: Componentes pequenos e reutilizáveis

### 📁 Nova Estrutura de Pastas

```
src/
├── components/
│   ├── common/          # Componentes básicos
│   ├── maps/            # Componentes de mapa
│   ├── sheets/          # Bottom sheets
│   └── weather/         # Componentes de clima
├── hooks/               # Custom hooks
├── services/            # Serviços externos
├── types/               # Tipos TypeScript
├── utils/               # Utilitários
└── screens/             # Telas da aplicação
```

## 🔄 Passos para Migração

### 1. Mover Arquivos Existentes

```bash
# Criar nova estrutura
mkdir -p src/{components/{common,maps,sheets,weather},hooks,services,types,utils,screens/Home}

# Mover componentes
mv components/Button.tsx src/components/common/
mv components/Location.tsx src/components/common/
mv components/LocationError.tsx src/components/common/
mv components/HomeButtons.tsx src/components/common/
mv components/MapContainer.tsx src/components/maps/
mv components/CustomMarker.tsx src/components/maps/
mv components/UserLocationMarker.tsx src/components/maps/
mv components/Wheater.tsx src/components/weather/
mv components/sheets/* src/components/sheets/

# Mover tipos
mv interfaces/* src/types/

# Mover utils
mv utils/* src/utils/

# Mover constantes
mv const/* src/constants/
```

### 2. Atualizar Imports

Substituir imports antigos por novos:

```typescript
// Antes
import { Place } from "@/interfaces/Place";
import getCurrentLocation from "@/utils/getCurrentLocation";

// Depois
import { Place } from "@/types/place";
import { useLocation } from "@/hooks/useLocation";
```

### 3. Usar Custom Hooks

```typescript
// Antes (no componente)
const [location, setLocation] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getCurrentLocation().then(setLocation);
}, []);

// Depois (usando custom hook)
const { location, loading, error, refreshLocation } = useLocation();
```

## 🎯 Benefícios da Nova Arquitetura

1. **Manutenibilidade**: Código mais fácil de manter e entender
2. **Reutilização**: Hooks e componentes reutilizáveis
3. **Testabilidade**: Lógica isolada facilita testes
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Performance**: Melhor gerenciamento de estado e re-renders

## 📝 Próximos Passos

1. Implementar gerenciamento de estado global (Zustand/Context)
2. Adicionar testes unitários
3. Implementar tratamento de erros global
4. Adicionar tema e design system
5. Implementar cache de dados

## 🐛 Solução de Problemas

### Erro de Path Mapping
Se houver problemas com imports `@/`, verificar:
- `tsconfig.json` configurado corretamente
- Restart do TypeScript server no VS Code
- Limpar cache do Metro bundler

### Hooks não encontrados
Verificar se os custom hooks estão na pasta correta:
```
src/hooks/useLocation.ts
src/hooks/usePlaces.ts
``` 