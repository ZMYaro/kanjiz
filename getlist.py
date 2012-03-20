from os import chdir
from os import listdir

chdir('lists')
files = listdir('.')

i = 0
while (i < len(files)):
	if (files[i].find('.xml') == -1):
		files.pop(i)
	else:
		i += 1
	# end if
# end while
