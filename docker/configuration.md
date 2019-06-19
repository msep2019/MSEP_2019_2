# Docker installation for Windows:
### 1. Enable Hyper-V and Containers:
   1) Open "Control Panel"
   2) Select and open "Programs"
   3) Open "Turn Windows features on or off"
   4) Enable "Hyper-V" and "Containers" and restart 
      Or execute command to enable Hyper-V
      ```
      bcdedit /set hypervisorlauchtype Auto
      ```
### 2. Download Docker installation package
   ```
   https://get.daocloud.io/docker-install/windows
   ```
### 3. Open Docker installation package

# Docker installation for Ubuntu:
### 1. Check Ubuntu kernel version. Docker is support by the kernel version which is at least 3.10.
    uname -r //kernel version
### 2. Uninstall old Docker version 
   The old Docker named as `docker`, `docker-engine` or `docker.io`. Uninstall old Docker version used command as below
   ```
   sudo apt-get remove docker
   sudo apt-get remove docker-engine
   sudo apt-get remove docker.io
   ```
### 3. Install Docker
   ```
   sudo apt-get update
   sudo apt-get install docker.io
   ```
### 4. Start Docker service
   ```
   sudo service docker start
   ```
### 5 Check Docker version to guarantee install Docker successfully
   ```
   docker --version
   ```
    
