# Grafana

## Install Grafana via Docker
  ```
  sudo docker run -d --name=grafana -p 3000:3000 grafana/grafana
  ```
  The commond is the way to start grafana service which is official recommendation to avoid data loss
## Grafana - Data source 
  Grafana support a variety of data source
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/10.png)
  
  The influxdb connection with grafana as below. Name can be self-defining. URL will use the default one, Broweser will be picked for 'Access'. Database detaill should be the same as the database configuration on the laptop.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/9.png)
  
## Grafana - Dashboard establish

  After setting up the data source, the dashboard can be bulid. The data visualization and its interface can be complete self-defining.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/4.png)
  
  
