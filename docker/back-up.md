# Docker back-up (Windows)
  Before backing up, stop the service.
 ```
 sudo docker stop [container ID]
 ```
### Inspect the container list, the properties involve container ID, image, comand, created, status, ports and names.
   ```
   sudo docker ps -a
   ```
### Use `docker commit` to create image
   ```
   sudo docker commit -p [container ID] [name]
   ```
### Inspect the docker images
   ```
   sudo docker images
   ```
### Save expected image to local disk, the image can be save as "tar" package
   ```
   sudo docker save -o [name.tar] [name]
   ```
# Restore Container and Image
### Load docker image
   ```
   sudo docker load -i [name.tar]
   ```
### Run docker container via re-loaded image
   ```
   sudo docker run -d -p 80:80 [image name]
   ```
### Stop & start the container
   ```
   sudo docker start [container ID] //start
   sudo docker stop [container ID] //stop
   ```
