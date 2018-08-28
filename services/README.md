
### Deployment Directory:
/data

### Service Layout:
```
{
    "rethinkdb_web": {
        "description": "dev rethinkdb management web UI",
        "host:": "http://localhost",
        "port": 8080,
        "hostdir": "<DEPLOYMENT_DIR>/rethinkdb"
    },
    "rethinkdb": {
        "description": "dev rethinkdb",
        "host": "http://localhost",
        "port": 28015,
        "hostdir": "<DEPLOYMENT_DIR>/rethinkdb"
    },
    "restapi": {
        "description": "dev restapi",
        "host": "http://localhost",
        "port": 3000,
        "hostdir": "<DEPLOYMENT_DIR>/restapi"
    }
}
```
http://localhost:8080/ - dev rethinkdb management web UI
http://localhost:3000/ - dev restapi web UI

### Run the services:
```
$ docker-compose up -d
```

### Stop the services:
```
$ docker-compose stop
```

### Display logs of services:
```
$ docker-compose logs
```