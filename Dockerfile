FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html styles.css /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
