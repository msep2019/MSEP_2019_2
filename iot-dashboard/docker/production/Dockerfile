FROM python:3-alpine
# Update & Install dependencies
#RUN apk add git
#RUN apk add --no-cache --update git
#    git \
#    bash \
#    libffi-dev \
#    openssl-dev \
#    bzip2-dev \
#    zlib-dev \
#    readline-dev \
#    sqlite-dev \
#    build-base

# Set Python version
ARG PYTHON_VERSION='3.6.7'
# Set pyenv home
#ARG PYENV_HOME=/root/.pyenv
#
## Install pyenv, then install python versions
#RUN git clone --depth 1 https://github.com/pyenv/pyenv.git $PYENV_HOME && \
#    rm -rfv $PYENV_HOME/.git
#
#ENV PATH $PYENV_HOME/shims:$PYENV_HOME/bin:$PATH

RUN apk add --update nginx
#RUN pip3 install uwsgi
COPY ./ ./app
WORKDIR ./app
RUN ls /app/ -a && pip3 install -r ./docker/requirements.txt
COPY ./nginx.conf /etc/nginx/sites-enabled/default
CMD ["python3", "iot-dashboard.py"]