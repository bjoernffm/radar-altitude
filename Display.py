import winsound
import time
import os

class Display:
    feetDisplayLength = 25
    callout = ""
    
    def __init__(self, container):
        self.container = container

    def cls(self):
        #os.system('cls' if os.name=='nt' else 'clear')
        os.system('clear')

    def render(self):
        self.feetDisplayLength = 25
        
        if (self.container.getFeet() <= 50):
            progressLength = int(round(self.feetDisplayLength*(self.container.getFeet()/50)))
            feetDisplay = "#" * progressLength + '-' * (self.feetDisplayLength - progressLength)
        else:
            feetDisplay = "#" * self.feetDisplayLength

        if (self.callout == "" and self.container.getFeet() <= 50):
            self.callout = "50"
            winsound.PlaySound('C:/Users/Bjoern/Desktop/tmp/radar/GPWS50.wav', winsound.SND_FILENAME|winsound.SND_ASYNC)
        elif (self.callout == "50" and self.container.getFeet() <= 40):
            self.callout = "40"
            winsound.PlaySound('C:/Users/Bjoern/Desktop/tmp/radar/GPWS40.wav', winsound.SND_FILENAME|winsound.SND_ASYNC)
        elif (self.callout == "40" and self.container.getFeet() <= 30):
            self.callout = "30"
            winsound.PlaySound('C:/Users/Bjoern/Desktop/tmp/radar/GPWS30.wav', winsound.SND_FILENAME|winsound.SND_ASYNC)
        elif (self.callout == "30" and self.container.getFeet() <= 20):
            self.callout = "20"
            winsound.PlaySound('C:/Users/Bjoern/Desktop/tmp/radar/GPWS20.wav', winsound.SND_FILENAME|winsound.SND_ASYNC)
        elif (self.callout == "20" and self.container.getFeet() <= 10):
            self.callout = "10"
            winsound.PlaySound('C:/Users/Bjoern/Desktop/tmp/radar/GPWS10.wav', winsound.SND_FILENAME|winsound.SND_ASYNC)
        
        self.cls()
        print(time.strftime("%b %d %Y %H:%M:%S UTC\n", time.gmtime()))
        print("    Status:", self.container.getStatus())
        print("Vert Speed:", round(self.container.getVerticalSpeed()), "ft/min")
        print(" Radar ALT:", round(self.container.getFeet()), "ft")
        print("           ", feetDisplay, flush=True)
