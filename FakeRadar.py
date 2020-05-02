from timeit import default_timer as timer
import time

class FakeRadar:
    
    def __init__(self, container):
        self.height = 60
        self.verticalSpeed = 0
        self.container = container
        self.measurements = []

    def measure(self):
        now = timer()
        if (len(self.measurements) > 0):
            difference = now-self.measurements[0][1]
            
            if (self.height < 10):
                vert = (-100/60.)
            elif (self.height < 30):
                vert = (-350/60.)
            else:
                vert = (-500/60.)

            vert = vert*difference
            self.height += vert     
            
        if (len(self.measurements) > 1):
            tmpSum = 0
            
            for i in range(len(self.measurements)-1):
                heightDiff = self.measurements[i][0]-self.measurements[i+1][0]
                timeDiff = self.measurements[i][1]-self.measurements[i+1][1]

                tmpSum += (heightDiff/timeDiff)

            self.verticalSpeed = (tmpSum/(len(self.measurements)-1))*60
            
        self.measurements[0:0] = [[self.height, now]]
        self.measurements = self.measurements[:10]

        self.container.setFeet(self.height)
        self.container.setVerticalSpeed(self.verticalSpeed)

        # set status
        if (self.container.getFeet() > 0):
            if (self.container.getVerticalSpeed() < 0):
                if  (self.container.getVerticalSpeed() >= -200 and self.container.getFeet() < 30):
                    self.container.setStatus("Flare")
                else:
                    self.container.setStatus("Descend")
            else:
                self.container.setStatus("Cruise")
        elif (self.container.getFeet() <= 0):
            self.container.setStatus("Touchdown")
            self.container.setVerticalSpeed(0)
