import redis
def main():
    print("Try to connect redis server")
    redis_db = redis.StrictRedis(host="localhost", port=6379, db=0)
    print(redis_db.keys())


if __name__ == "__main__":
    main()