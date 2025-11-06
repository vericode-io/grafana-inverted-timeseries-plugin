# Dockerfile para Grafana com Time Series Vertical Plugin
# Baixa o plugin diretamente do GitHub e instala automaticamente

FROM grafana/grafana:latest

# Definir usuário root para instalação
USER root

# Instalar dependências necessárias
RUN apk add --no-cache git curl

# Criar grupo grafana se não existir
RUN getent group grafana || addgroup -S grafana

# Criar usuário grafana se não existir
RUN getent passwd grafana || adduser -S -G grafana -h /var/lib/grafana -s /bin/sh grafana

# Criar diretório de plugins se não existir
RUN mkdir -p /var/lib/grafana/plugins

# Clonar o repositório do plugin do GitHub
RUN git clone https://github.com/vericode-io/grafana-inverted-timeseries-plugin.git /tmp/plugin && \
    cp -r /tmp/plugin /var/lib/grafana/plugins/grafana-timeseries-vertical-plugin && \
    rm -rf /tmp/plugin

# Ajustar permissões
RUN chown -R grafana:grafana /var/lib/grafana/plugins/grafana-timeseries-vertical-plugin

# Voltar para o usuário grafana
USER grafana

# Expor porta padrão do Grafana
EXPOSE 3000

# Comando padrão
CMD ["/run.sh"]
