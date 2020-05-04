import sys
if not len(sys.argv) == 3:
    print("Takes exactly 2 arguments:")
    print("firstImageNumberToThumbnail, imagesToThumbnail")
    quit()
   
from PIL import Image
print("generating thumbs...")
for i in range(int(sys.argv[1]),int(sys.argv[2])):
    image = Image.open(".//images//"+str(i)+".jpg").convert("RGB")
    MAX_SIZE = (300, 2048)
    image.thumbnail(MAX_SIZE) 
    image.save('.//thumbs//'+str(i)+'.jpg', "JPEG", quality=100)
    print('/thumbs/'+str(i)+'.jpg')
print("done")
