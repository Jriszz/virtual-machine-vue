FROM nginx:1.21.0-alpine
WORKDIR /opt/deploy/user_center_ui
COPY dist/. .
EXPOSE 9500
