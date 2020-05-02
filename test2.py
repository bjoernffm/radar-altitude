import os
from datetime import datetime
import time

def cls():
    os.system('cls' if os.name=='nt' else 'clear')
    os.system('clear')

# now, to clear the screen
while True:
    cls()
    print(time.strftime("%b %d %Y %H:%M:%S UTC\n", time.gmtime()), flush=True)
    print("Radar ALT: ", 60, "ft", flush=True)
    print("Vert Speed:", -200, "ft/min", flush=True)
    time.sleep(0.1)
