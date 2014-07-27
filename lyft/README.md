Lyft Challenge
=================

##The Challenge:
>Calculate the detour distance between two different rides. Given four latitude / longitude pairs, where driver one is traveling from point A to point B and driver two is traveling from point C to point D, write a function (in your language of choice) to calculate the shorter of the detour distances the drivers would need to take to pick-up and drop-off the other driver.

##My Solution:
Considering the challenge calls for real-world driving situations, I went with an approach that could be used by actual drivers. I used the Google Maps Distance Matrix API to find the driving distances between all of the coordinates supplied and then calculated the total distance each driver would need to drive if they were to pick up the other driver. The driver with the shortest total route was declared "winner".

Next, I used the Google Maps Direction Service API to draw a route on the map for the winning driver.

Alternatively, one could use the haversine formula to calculate the exact distance between two coordinates. I avoided this approach because it didn't have any real-world use: a driver can't drive in a straight line through buildings and bodies of water (or one would hope they wouldn't attempt to).