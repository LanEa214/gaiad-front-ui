FROM 10.12.0.78:5000/k8s/nginx:1.20.2-alpine


WORKDIR /

COPY dist /usr/share/nginx/html