ARG ELK_VERSION

FROM docker.elastic.co/logstash/logstash:${ELK_VERSION}

HEALTHCHECK --start-period=15s --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:9600