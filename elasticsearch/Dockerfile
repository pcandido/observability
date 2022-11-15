ARG ELK_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELK_VERSION}

HEALTHCHECK --start-period=20s --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:9200