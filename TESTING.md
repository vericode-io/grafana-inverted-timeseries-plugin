# Testes Automatizados

Este documento descreve os testes automatizados do plugin Grafana Time Series Vertical.

## 📋 Visão Geral

O plugin inclui testes automatizados para garantir a qualidade e confiabilidade das funcionalidades de rotação e inversão do eixo de tempo.

## 🧪 Tipos de Testes

### 1. Testes Unitários (utils-vertical.test.ts)

Testa as funções de inversão de direção do tempo:

- **invertTimeDirection**: Inverte a ordem dos valores em um DataFrame
- **invertTimeDirectionInFrames**: Inverte múltiplos DataFrames
- **hasTimeField**: Verifica se um DataFrame tem campo de tempo

**Cobertura**:
- ✅ Inversão de valores
- ✅ Preservação de metadados
- ✅ Frames vazios
- ✅ Múltiplas séries
- ✅ Dados reais de time series

### 2. Testes de Integração (TimeSeriesPanel.test.tsx)

Testa o componente principal do painel:

- Renderização com diferentes configurações
- Combinações de opções (vertical + invertido)
- Processamento de dados vazios
- Múltiplas séries de dados

**Cobertura**:
- ✅ Eixo vertical ativado/desativado
- ✅ Inversão de tempo ativada/desativada
- ✅ Todas as combinações de opções
- ✅ Dados vazios e múltiplas séries

## 🚀 Executando os Testes

### Pré-requisitos

```bash
# Instalar dependências
npm install
```

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo CI
npm run test:ci
```

## 📊 Cobertura de Código

Os testes visam manter uma cobertura mínima de:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

Para ver o relatório de cobertura:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🔧 Configuração

### jest.config.js

Configuração principal do Jest:
- Preset: `ts-jest`
- Ambiente: `jsdom` (para testes de componentes React)
- Transformação de TypeScript/TSX
- Mapeamento de módulos (CSS, SVG)

### jest.setup.js

Setup global dos testes:
- Mocks de APIs do navegador (matchMedia, IntersectionObserver, ResizeObserver)
- Configuração do @testing-library/jest-dom

## 🤖 CI/CD

### GitHub Actions

Os testes são executados automaticamente no GitHub Actions em:
- **Push** para a branch `main`
- **Pull Requests** para a branch `main`

**Workflow** (`.github/workflows/ci.yml`):

1. **Test Job**:
   - Executa em Node.js 18.x e 20.x
   - Instala dependências
   - Executa testes com cobertura
   - Envia cobertura para Codecov

2. **Lint Job**:
   - Verifica TypeScript (tsc --noEmit)

3. **Build Job**:
   - Verifica plugin.json
   - Cria arquivo tar.gz do plugin
   - Faz upload como artifact

## 📝 Escrevendo Novos Testes

### Estrutura de um Teste

```typescript
describe('Nome do Módulo', () => {
  describe('Nome da Função', () => {
    it('deve fazer algo específico', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = funcao(input);
      
      // Assert
      expect(result).toBe(esperado);
    });
  });
});
```

### Boas Práticas

1. **Nomes descritivos**: Use "deve..." para descrever o comportamento
2. **Arrange-Act-Assert**: Organize o teste em 3 seções
3. **Um conceito por teste**: Teste apenas uma coisa por vez
4. **Dados realistas**: Use dados que simulem casos reais
5. **Edge cases**: Teste casos extremos (vazio, null, etc.)

## 🐛 Debugging

### Executar um teste específico

```bash
# Por nome do arquivo
npm test utils-vertical.test.ts

# Por nome do teste
npm test -t "deve inverter a ordem dos valores"
```

### Modo debug

```bash
# Com breakpoints no VS Code
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📚 Documentação de Referência

- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)

## ✅ Checklist de Testes

Antes de fazer commit:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura está acima do mínimo (`npm run test:coverage`)
- [ ] Novos testes foram adicionados para novas funcionalidades
- [ ] Testes existentes foram atualizados se necessário
- [ ] Nenhum teste foi desabilitado sem justificativa

## 🎯 Status dos Testes

[![CI](https://github.com/vericode-io/grafana-inverted-timeseries-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/vericode-io/grafana-inverted-timeseries-plugin/actions/workflows/ci.yml)

Os testes são executados automaticamente no GitHub Actions e o status pode ser visto no badge acima.
