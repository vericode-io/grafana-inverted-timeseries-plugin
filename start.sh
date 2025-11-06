#!/bin/bash

# Script para iniciar o Grafana com o plugin Time Series Vertical

set -e

echo "=========================================="
echo "  Grafana Time Series Vertical Plugin"
echo "=========================================="
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "   Instale o Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não está instalado!"
    echo "   Instale o Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"
echo ""

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env a partir de .env.example..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo "   Você pode editar .env para customizar as configurações"
    echo ""
fi

# Construir e iniciar os containers
echo "🔨 Construindo imagem Docker..."
echo ""

if docker compose version &> /dev/null; then
    docker compose build
else
    docker-compose build
fi

echo ""
echo "🚀 Iniciando Grafana..."
echo ""

if docker compose version &> /dev/null; then
    docker compose up -d
else
    docker-compose up -d
fi

echo ""
echo "=========================================="
echo "  ✅ Grafana iniciado com sucesso!"
echo "=========================================="
echo ""
echo "📍 Acesse: http://localhost:3000"
echo ""
echo "🔐 Credenciais padrão:"
echo "   Usuário: admin"
echo "   Senha: admin"
echo ""
echo "📊 Para usar o plugin:"
echo "   1. Faça login no Grafana"
echo "   2. Crie ou edite um dashboard"
echo "   3. Adicione um novo painel"
echo "   4. Selecione 'Time Series Vertical' como visualização"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:    docker-compose logs -f grafana"
echo "   Parar:       docker-compose stop"
echo "   Reiniciar:   docker-compose restart"
echo "   Remover:     docker-compose down"
echo ""
echo "=========================================="
