FROM python:3.6-alpine

# Set Python version
ARG PYTHON_VERSION='3.6.7'
COPY ./ ./app
WORKDIR ./app
RUN ls /app/ -a && pip3 install -r ./docker/requirements.txt
CMD ["python3", "iot-admin.py"]