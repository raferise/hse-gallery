import sys
if not len(sys.argv) == 3:
    print("Takes exactly 2 arguments:")
    print("firstImageNumberToThumbnail, imagesToThumbnail")
    quit()
   
from PIL import Image, ExifTags
print("generating thumbs...")
for i in range(int(sys.argv[1]),int(sys.argv[2])):
    image = Image.open(".//images//"+str(i)+".jpg")
    try:
        exif=dict((ExifTags.TAGS[k], v) for k, v in image._getexif().items() if k in ExifTags.TAGS)
        if exif['Orientation'] == 3 : 
            image=image.rotate(180, expand=True)
        elif exif['Orientation'] == 6 : 
            image=image.rotate(270, expand=True)
        elif exif['Orientation'] == 8 : 
            image=image.rotate(90, expand=True)
    except:
        pass
    image = image.convert("RGB")
    image.thumbnail((300, 2048), Image.ANTIALIAS) 
    image.save('.//thumbs//'+str(i)+'.jpg', "JPEG", quality=100)
    print('/thumbs/'+str(i)+'.jpg')
print("done")
