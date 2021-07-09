FROM nginx:1.21.0-alpine
WORKDIR /opt/deploy/user_center_ui
COPY dist/. .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 9500