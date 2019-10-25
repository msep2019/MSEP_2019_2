FROM python:3.7-slim-buster
COPY ./ ./app
WORKDIR ./app
RUN ls /app/ -a && pip3 install -r ./requirements.txt
CMD ["python3", "apps.py"]