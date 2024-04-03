FROM python:3.10-alpine
RUN pip install --upgrade pip
WORKDIR /app
COPY ./requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY . /app
EXPOSE 5000
CMD ["hypercorn", "--bind=0.0.0.0:5000", "app:app"]