Write-Output "Hello"

# $IotHubConnectionString = "IotHubConnectionString=HostName=iot-hub-dasboards-dev.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=v79X1R/KriZ06plWOIvYb1lqge/9xMMDZNtuihB/cGM="

# $Template = "{ \"deviceId\": \"$.DeviceId\", \"rand_int\": $.Temp, \"rand_double\": $.DoubleValue, \"Ticks\": $.Ticks, \"Counter\": $.Counter, \"time\": \"$.Time\" }"
# $Variables = "[{name: \"Temp\", \"random\": true, \"max\": 25, \"min\": 23}, {\"name\":\"Counter\", \"min\":100, \"max\":102} ]"


# Write-Output $IotHubConnectionString
# Write-Output $Template
# Write-Output $Variables

# docker run -it -e $IotHubConnectionString -e Template=$Template -e Variables=$Variables mcr.microsoft.com/oss/azure-samples/azureiot-telemetrysimulator