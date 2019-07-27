import json
import sys

minspawns = 10
userInput = raw_input("Enter min. amount of spawnpoints per cluster(1-50)(L for resultList): ")

if userInput[0].isdigit():
	val = userInput
	if int(val) > 0 and int(val) <= 50:
		print '[progress] using',int(val), 'as min amount'
		minspawns = int(val)
	else:
		print 'WARNING: given argument:',userInput,'not between 1 and 50. using default number 10 '
		
	worthy_clusters = list()
	with open('spawnpoints.compressed.json','r') as f:
		clusters = json.loads(f.read())
		count = 0
		for i in clusters:
			if len(i['spawnpoints']) >= minspawns:
				worthy_clusters.append(i)
		print '[info] worthy clusters:' , len(worthy_clusters)
		with open('RDM_OUTPUT.txt','w+') as f:
			for i in worthy_clusters:
				f.write( str(i['latitude']) + "," + str(i['longitude']) + "\n")
		print '[result] RDM output file saved as RDM_OUTPUT.txt'

else:
	if(userInput[0] != 'L'):
		print 'ERROR:', userInput , 'is not a valid input'
	else:
		val = userInput
	
		for j in xrange(1, 20):
			minspawns = j
			worthy_clusters = list()
			with open('spawnpoints.compressed.json','r') as f:
				clusters = json.loads(f.read())
				count = 0
				for i in clusters:
					if len(i['spawnpoints']) >= minspawns:
						worthy_clusters.append(i)
				print 'Minimum spawnpoint amount of' , j , 'is:', len(worthy_clusters)