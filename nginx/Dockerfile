FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8881

HEALTHCHECK --start-period=5s --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:8881/health-check