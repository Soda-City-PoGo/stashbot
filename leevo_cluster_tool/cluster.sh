#!/bin/sh
python ./cluster.py spawnpoints.json -oc spawnpoints.compressed.json -r 70 -t 180
python ./worth.py