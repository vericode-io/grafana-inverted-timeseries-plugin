# Time Series Vertical Plugin

Plugin de visualização para Grafana baseado no plugin Time Series oficial, com opção para rotacionar o eixo de tempo para vertical.

## Características

### Funcionalidades do Time Series Original

Todas as funcionalidades do plugin Time Series original foram mantidas:
- Gráficos de linha, área e barras baseados em tempo
- Tooltips interativos
- Legendas configuráveis
- Anotações
- Exemplars
- Thresholds
- Time zones
- Time compare
- E muito mais...

### Novas Funcionalidades

#### 1. Vertical Time Axis (Eixo de Tempo Vertical)
- **Checkbox**: "Vertical time axis"
- **Descrição**: Rotaciona o eixo de tempo para vertical
- **Efeito**: 
  - Tempo no eixo Y (vertical)
  - Valores no eixo X (horizontal)
  - Gráfico rotacionado 90°
- **Uso**: Útil para visualizações onde se deseja ver a evolução temporal de cima para baixo ou de baixo para cima

#### 2. Invert Time Direction (Inverter Direção do Tempo)
- **Checkbox**: "Invert time direction" (aparece apenas quando "Vertical time axis" está ativo)
- **Descrição**: Inverte a direção do tempo quando o eixo está vertical
- **Efeito**:
  - **Padrão** (não invertido): Tempo mais antigo no topo, mais recente embaixo
  - **Invertido**: Tempo mais recente no topo, mais antigo embaixo
- **Uso**: Ajustar a direção do tempo conforme convenção desejada

## Instalação

### Método 1: Instalação Manual

1. Copie a pasta `grafana-timeseries-vertical-plugin` para o diretório de plugins do Grafana:
   ```bash
   sudo cp -r grafana-timeseries-vertical-plugin /var/lib/grafana/plugins/
   ```

2. Configure o Grafana para permitir plugins não assinados:
   
   Edite `/etc/grafana/grafana.ini`:
   ```ini
   [plugins]
   allow_loading_unsigned_plugins = grafana-timeseries-vertical-plugin
   ```

3. Reinicie o Grafana:
   ```bash
   sudo systemctl restart grafana-server
   ```

### Método 2: Docker

Monte o plugin como volume:
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/grafana-timeseries-vertical-plugin:/var/lib/grafana/plugins/grafana-timeseries-vertical-plugin \
  -e "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=grafana-timeseries-vertical-plugin" \
  --name=grafana \
  grafana/grafana:latest
```

## Uso

### Criando um Painel

1. Crie ou edite um dashboard
2. Adicione um novo painel
3. Selecione **"Time Series Vertical"** como tipo de visualização
4. Configure sua fonte de dados e query

### Configurando as Opções

Na seção **Axis** das configurações do painel, você encontrará:

#### Vertical Time Axis
- **Ativo**: O eixo de tempo fica vertical (tempo no eixo Y, valores no eixo X)
- **Inativo** (padrão): O eixo de tempo fica horizontal (tempo no eixo X, valores no eixo Y)

#### Invert Time Direction
*Esta opção só aparece quando "Vertical time axis" está ativo*

- **Ativo**: Tempo invertido (mais recente no topo, mais antigo embaixo)
- **Inativo** (padrão): Tempo normal (mais antigo no topo, mais recente embaixo)

### Exemplos de Uso

#### Exemplo 1: Time Series Vertical (padrão)
Visualizar evolução temporal de cima para baixo:

**Configuração**:
- ✅ **Vertical Time Axis**: ON
- ❌ **Invert Time Direction**: OFF

**Resultado**:
```
Tempo (Y)    Valores (X)
  ↓
Antigo  ────────────────
  |
  |
  v
Recente ────────────────
```

#### Exemplo 2: Time Series Vertical Invertido
Visualizar evolução temporal de baixo para cima:

**Configuração**:
- ✅ **Vertical Time Axis**: ON
- ✅ **Invert Time Direction**: ON

**Resultado**:
```
Tempo (Y)    Valores (X)
  ↑
Recente ────────────────
  |
  |
  ^
Antigo  ────────────────
```

#### Exemplo 3: Time Series Normal (horizontal)
Visualização padrão do Time Series:

**Configuração**:
- ❌ **Vertical Time Axis**: OFF

**Resultado**:
```
Valores (Y)
  ^
  |
  |
  ────────────────────────> Tempo (X)
Antigo              Recente
```

## Casos de Uso

### 1. Análise de Logs
**Cenário**: Visualizar logs em ordem cronológica de cima para baixo (como em um terminal)

**Configuração**:
- ✅ Vertical Time Axis
- ❌ Invert Time Direction

**Benefício**: Logs mais antigos no topo, mais recentes embaixo (convenção de terminal)

---

### 2. Timeline de Eventos
**Cenário**: Mostrar linha do tempo de eventos com mais recentes no topo

**Configuração**:
- ✅ Vertical Time Axis
- ✅ Invert Time Direction

**Benefício**: Eventos mais recentes aparecem primeiro (convenção de feeds/timelines)

---

### 3. Monitoramento de Processos
**Cenário**: Acompanhar métricas ao longo do tempo com layout vertical

**Configuração**:
- ✅ Vertical Time Axis
- ❌ ou ✅ Invert Time Direction (conforme preferência)

**Benefício**: Melhor uso de espaço vertical em dashboards

---

### 4. Comparação com Outros Painéis
**Cenário**: Alinhar time series vertical com outros gráficos verticais

**Configuração**:
- ✅ Vertical Time Axis

**Benefício**: Consistência visual no dashboard

## Arquitetura Técnica

### Como Funciona

#### Rotação do Eixo de Tempo
Quando `verticalTimeAxis` está ativo, o plugin:
1. Define `orientation = VizOrientation.Vertical` nas opções
2. O componente `TimeSeries` do Grafana renderiza o gráfico rotacionado
3. Tempo fica no eixo Y, valores no eixo X

#### Inversão da Direção do Tempo
Quando `invertTimeDirection` está ativo (e `verticalTimeAxis` também):
1. A função `invertTimeDirectionInFrames()` é chamada
2. Todos os arrays de valores em todos os campos são revertidos
3. O gráfico mostra os dados na ordem inversa

### Código Principal

```typescript
// Aplicar orientação vertical
if (options.verticalTimeAxis) {
  opts.orientation = VizOrientation.Vertical;
}

// Inverter direção do tempo (se vertical e inversão ativa)
if (options.verticalTimeAxis && options.invertTimeDirection && frames) {
  frames = invertTimeDirectionInFrames(frames);
}
```

### Função de Inversão

```typescript
export function invertTimeDirection(frame: DataFrame): DataFrame {
  const invertedFields = frame.fields.map((field) => {
    // Inverter a ordem dos valores em todos os campos
    const reversedValues = [...field.values].reverse();
    
    return {
      ...field,
      values: reversedValues,
    };
  });

  return {
    ...frame,
    fields: invertedFields,
    length: frame.length,
  };
}
```

## Comparação

| Aspecto | Time Series | Time Series Vertical |
|---------|-------------|----------------------|
| **Eixo de tempo** | Horizontal (X) | Horizontal (X) ou Vertical (Y) |
| **Direção do tempo** | Esquerda → Direita | Esquerda → Direita OU Topo → Baixo OU Baixo → Topo |
| **Rotação** | Não | Sim (90°) |
| **Inversão de tempo** | Não | Sim (quando vertical) |
| **Funcionalidades básicas** | ✅ | ✅ (todas mantidas) |

## Código-fonte

Baseado no plugin Time Series oficial do Grafana:
https://github.com/grafana/grafana/tree/main/public/app/plugins/panel/timeseries

## Licença

Apache License 2.0 (mesma do Grafana)
