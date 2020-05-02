import os
from datetime import datetime
import time
import winsound
from Container import Container
from Display import Display
from FakeRadar import FakeRadar

container = Container()
display = Display(container)
radar = FakeRadar(container)

# now, to clear the screen
while True:    
    radar.measure()
    display.render()
    time.sleep(0.05)

    if (container.getStatus() == "Touchdown"):
        exit(0)
