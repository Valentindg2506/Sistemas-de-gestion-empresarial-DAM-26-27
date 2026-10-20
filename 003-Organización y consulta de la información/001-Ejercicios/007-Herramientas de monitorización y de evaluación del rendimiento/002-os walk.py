import os

for archivo,carpeta,carpetas in os.walk("/var/www/html/GitHub"):
	print(archivo)
	print(carpeta)
	print(carpetas)
