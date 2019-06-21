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
  
  According to the requirement to set up the database data selection
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/1.png)
  
  Editing each interface, choose approprate graph and unit
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/5.png)
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/6.png)
  
## Grafana - Alert
  Using Alert to monitor whether the data meet boundaries or limitations. There are many ways to send notification.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/8.png)
  
  **Slack Alert setup and Grafana Alert setup**
  
  Before setting up on Grafana, sign into your own slack or create a new workspace
  ```
  https://slack.com/signin
  ```
  
  Then open the link below
  
  ```
  https://msep2019 [modify it refer to your own workspace].slack.com/apps/new/A0F7XDUAZ-incoming-webhooks
  ```
  Create a new channel or choose an existed channel. The channel will present the notification and alert from Grafana
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/11.png)
  
  Click `Add Incoming WebHooks Integration` and acquire a Webhook URL.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/12.png)
  
  Save settings, copy the Webhook URL and fill into the URL in the Slack settings
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/7.png)
  
  Click `Send Test` to check whether the notification can be sent to the channel succeffully.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/13.png)
  
  If it works, save setting. Open the view expected to monitor with Alert. Setting up the conditions of the alert.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/2.png)
  
  In the `Notifications`, select the appropriate Alert and setup message which expected to present in the Slack channel.
  
  ![index](https://github.com/msep2019/MSEP_2019_2/raw/master/grafana/images/3.png)
  
  
  
  
 
  
  
  
