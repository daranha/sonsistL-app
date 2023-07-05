# sonsistL-app

## Notes

Assuming that python is installed the following command will start a local server:

```
python3 -m http.server 8000
```

Upon completion, the output should look like:

```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

This means that the server is running and ready to listen to request. Navigae to http://localhost:8000/ to see **sketch.js** running.


Agregué los scripts "drag" y "recognize" (que encontré aquí: https://embed.plnkr.co/plunk/6qwPge) intentando permitir reacomodar el dibujo en el canvas. No funcionan, entiendo que es necesario convertir el dibujo en un objeto "shape". 
