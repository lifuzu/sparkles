

### Release client extension for Chrome:

```
$ pushd clients/extensions
$ zip -r Sparkle.zip chrome
$ popd
```


### Release service restapi:

#### 1. Create docker image and tag it
```
$ docker build -t sparkles .

$ docker tag sparkles:latest weimed.com/sparkles:${VERSION}
```

#### 2. Run the docker container
```
$ docker run -itd -p 3000:3000 -e RDB_HOST=host.docker.internal --name sparkles sparkles:latest
```

#### 3. Push the docker image to dockerhub
```
```

#### 4. Run tereform/docker-compose to deploy
```
```