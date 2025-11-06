# 🐳 Guia Docker - Grafana Time Series Vertical Plugin

Este guia explica como executar o Grafana com o plugin Time Series Vertical usando Docker.

## 📋 Pré-requisitos

- Docker instalado ([Instalar Docker](https://docs.docker.com/get-docker/))
- Docker Compose instalado ([Instalar Docker Compose](https://docs.docker.com/compose/install/))

## 🚀 Início Rápido

### Método 1: Script Automatizado (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/vericode-io/grafana-inverted-timeseries-plugin.git
cd grafana-inverted-timeseries-plugin

# Executar script de inicialização
./start.sh
```

O script irá:
1. ✅ Verificar dependências (Docker e Docker Compose)
2. ✅ Criar arquivo `.env` se não existir
3. ✅ Construir a imagem Docker
4. ✅ Iniciar o container Grafana
5. ✅ Exibir informações de acesso

### Método 2: Comandos Manuais

```bash
# Clonar o repositório
git clone https://github.com/vericode-io/grafana-inverted-timeseries-plugin.git
cd grafana-inverted-timeseries-plugin

# Criar arquivo .env (opcional)
cp .env.example .env

# Construir e iniciar
docker-compose up -d --build
```

## 🌐 Acessar o Grafana

Após iniciar, acesse:

**URL**: http://localhost:3000

**Credenciais padrão**:
- Usuário: `admin`
- Senha: `admin`

## 📊 Usar o Plugin

1. Faça login no Grafana
2. Crie ou edite um dashboard
3. Adicione um novo painel (Add panel)
4. No seletor de visualização, escolha **"Time Series Vertical"**
5. Configure suas queries e opções:
   - ✅ **Vertical Time Axis**: Rotaciona o eixo de tempo para vertical
   - ✅ **Invert Time Direction**: Inverte a direção do tempo (quando vertical)

## ⚙️ Configuração

### Variáveis de Ambiente

Edite o arquivo `.env` para customizar:

```bash
# Credenciais de administrador
GF_ADMIN_USER=admin
GF_ADMIN_PASSWORD=sua_senha_segura

# URL raiz do servidor
GF_SERVER_ROOT_URL=http://localhost:3000

# Nível de log (debug, info, warn, error)
GF_LOG_LEVEL=info
```

### Portas

Por padrão, o Grafana é exposto na porta **3000**.

Para mudar a porta, edite `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Muda para porta 8080
```

## 📝 Comandos Úteis

### Ver Logs

```bash
# Logs em tempo real
docker-compose logs -f grafana

# Últimas 100 linhas
docker-compose logs --tail=100 grafana
```

### Parar o Grafana

```bash
# Usando script
./stop.sh

# Ou manualmente
docker-compose stop
```

### Reiniciar

```bash
docker-compose restart
```

### Remover Completamente

```bash
# Remove containers, redes e volumes
docker-compose down -v
```

### Reconstruir Imagem

```bash
# Força rebuild da imagem
docker-compose build --no-cache
docker-compose up -d
```

## 🔍 Verificar Plugin Instalado

### Via Linha de Comando

```bash
# Listar plugins instalados
docker-compose exec grafana ls -la /var/lib/grafana/plugins/

# Verificar plugin específico
docker-compose exec grafana ls -la /var/lib/grafana/plugins/grafana-timeseries-vertical-plugin/
```

### Via Interface Web

1. Acesse: http://localhost:3000
2. Vá em: **Configuration** → **Plugins**
3. Procure por: **"Time Series Vertical"**

## 📦 Volumes Persistentes

O Docker Compose cria volumes para persistir dados:

- **grafana-data**: Dados do Grafana (dashboards, datasources, etc.)
- **grafana-config**: Configurações
- **grafana-logs**: Logs

### Backup dos Dados

```bash
# Backup do volume de dados
docker run --rm -v grafana-inverted-timeseries-plugin_grafana-data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz /data
```

### Restaurar Backup

```bash
# Restaurar dados
docker run --rm -v grafana-inverted-timeseries-plugin_grafana-data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/grafana-backup.tar.gz --strip 1"
```

## 🐛 Troubleshooting

### Plugin não aparece

**Verificar se está instalado**:
```bash
docker-compose exec grafana ls -la /var/lib/grafana/plugins/grafana-timeseries-vertical-plugin/
```

**Verificar logs**:
```bash
docker-compose logs grafana | grep -i plugin
```

**Verificar configuração**:
```bash
docker-compose exec grafana cat /etc/grafana/grafana.ini | grep allow_loading_unsigned_plugins
```

### Porta 3000 já está em uso

**Verificar o que está usando a porta**:
```bash
sudo netstat -tuln | grep 3000
# ou
sudo lsof -i :3000
```

**Solução**: Mude a porta no `docker-compose.yml` ou pare o serviço que está usando a porta.

### Container não inicia

**Ver logs de erro**:
```bash
docker-compose logs grafana
```

**Verificar status**:
```bash
docker-compose ps
```

**Remover e recriar**:
```bash
docker-compose down
docker-compose up -d --build
```

### Erro de permissões

**Ajustar permissões dos volumes**:
```bash
docker-compose down
docker volume rm grafana-inverted-timeseries-plugin_grafana-data
docker-compose up -d
```

## 🔄 Atualizar Plugin

Para atualizar o plugin para a versão mais recente do GitHub:

```bash
# Parar container
docker-compose down

# Reconstruir imagem (baixa versão mais recente)
docker-compose build --no-cache

# Iniciar novamente
docker-compose up -d
```

## 🏗️ Arquitetura

### Dockerfile

O `Dockerfile` faz:
1. Usa imagem oficial `grafana/grafana:latest`
2. Instala Git para clonar o repositório
3. Clona o plugin do GitHub
4. Copia para o diretório de plugins
5. Ajusta permissões

### docker-compose.yml

O `docker-compose.yml` configura:
- **Build**: Constrói imagem a partir do Dockerfile
- **Portas**: Expõe porta 3000
- **Variáveis**: Configura plugin não assinado e credenciais
- **Volumes**: Persiste dados, config e logs
- **Healthcheck**: Monitora saúde do container
- **Restart**: Reinicia automaticamente em caso de falha

## 📚 Recursos Adicionais

- [Documentação do Plugin](README.md)
- [Guia de Testes](TESTING.md)
- [Repositório GitHub](https://github.com/vericode-io/grafana-inverted-timeseries-plugin)
- [Documentação Oficial Grafana](https://grafana.com/docs/)
- [Docker Hub - Grafana](https://hub.docker.com/r/grafana/grafana)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs -f grafana`
2. Consulte a seção de Troubleshooting acima
3. Abra uma issue no GitHub: https://github.com/vericode-io/grafana-inverted-timeseries-plugin/issues

## 📄 Licença

Este projeto segue a mesma licença do Grafana original.
