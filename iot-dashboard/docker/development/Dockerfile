FROM ubuntu:18.04
RUN apt-get update
RUN apt-get install -y python3 python3-dev python3-pip nginx
RUN pip3 install uwsgi
COPY ./ ./app
WORKDIR ./app
RUN ls /app/ -a && pip3 install -r ./docker/requirements.txt
COPY ./nginx.conf /etc/nginx/sites-enabled/default
CMD ["python3", "iot-dashboard.py"]