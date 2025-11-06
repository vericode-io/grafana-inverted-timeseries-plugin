#!/bin/bash

# Script para parar o Grafana

set -e

echo "=========================================="
echo "  Parando Grafana"
echo "=========================================="
echo ""

if docker compose version &> /dev/null; then
    docker compose stop
else
    docker-compose stop
fi

echo ""
echo "✅ Grafana parado com sucesso!"
echo ""
echo "Para remover completamente (incluindo volumes):"
echo "  docker-compose down -v"
echo ""
