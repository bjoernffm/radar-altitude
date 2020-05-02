import random
from time import sleep

class Calc:
    buffer = []
    windowSize = 3

    def updateHeight(self, value):
        self.buffer.append(value)

    def getVerticalSpeed(self):
        if (len(self.buffer) <= self.windowSize):
            return 0

        average = 0
        for i in range(self.windowSize):
            difference = self.buffer[(i+1)*-1]-self.buffer[(i+2)*-1]
            average += difference

        return (average/self.windowSize)*60
        

calculator = Calc()

while(True):
    height = 100
    verticalSpeed = random.randint(3,6)*100

    while(True):
        #print(int(height))
        calculator.updateHeight(height)
        height -= (verticalSpeed/60)

        print(calculator.getVerticalSpeed())
        sleep(1)
