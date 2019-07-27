###
By Leevo
###
1) put your db information in the cluster.py at the top
2) (chmod +x cluster.sh)
3) run cluster.sh

4) if you listed possible options at the end ("L"), you can execute worth.sh to avoid the analysis of the spawnpoints 
(there is a need of one cluster.sh run at least in order to work with that)

**Note**
You have 2 Options
1) Grab DB spawnpoints (all or unverified ones - for UIV optimization you want all - for TTH gathering you want unverified ones)
2) Import from a self imported json:
- export your spawnpoints as a json in the same folder as 'spawnpoints.json'
- when asked for verified or unverified, press 'k' instead!

With method 2, you can also import spawnpoints within a geofence:


select * from spawnpoint
 WHERE 
 ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON((
0.0 0.1,
0.2 0.3,
0.4 0.5,
0.0 0.1
))'), point(spawnpoint.lat, spawnpoint.lon));


After that, you can export the spawnpoints with software like MySQL Workbench, HeidiSQL etc(in json format!) and name it spawnpoints.json.
From then you can run the script and press k instead of using verified or all

Quick Guide to use the script:
1)chmod +x cluster.sh
2) ./cluster.sh
3) gathering:
- all spawns? -> press 'n'
- unverified spawns? -> press 'y'
- self uploaded file? -> press 'k' (needs to be in json format from rdm database with the name 'spawnpoints.json')
4) Enter the Min amount of spawns per cluster:
- You want to know how many locations you will get for each min.amount?
  Then press 'L' here and goto 6)

5) Done! your output coordinates for the 70m circles are now stored in RDM_OUTPUT.txt
6) You have a list of the output circle amounts for the min spawn amounts.
Choose one and run /worth.sh , enter the min amount of spawnpoints now and goto 5)

Have fun, i hope that script helps you guys with optimization :)
-Leevo