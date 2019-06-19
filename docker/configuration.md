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
    
    
