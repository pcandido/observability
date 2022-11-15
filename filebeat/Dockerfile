ARG ELK_VERSION

FROM docker.elastic.co/beats/filebeat:${ELK_VERSION}

HEALTHCHECK --start-period=15s --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:5067