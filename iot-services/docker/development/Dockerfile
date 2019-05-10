FROM python:3.6-alpine
COPY ./ ./app
WORKDIR ./app
RUN pip3 install -r ./docker/requirements.txt
COPY ./docker/development/conf.ini ./app/
CMD ["python3", "iot-services.py"]