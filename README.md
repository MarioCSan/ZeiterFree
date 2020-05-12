# ZeiterFree
Para el desarrollo se debe utilizar el branch MAIN. Cuando la versión este probrada y se ejecute correctamente en un servidor docker se procedera a realizar el PULL REQUEST a la rama master.

Para utilizar git existen varias opciones:Si utilizas una distribución Linux utilizando el comando git, con el cliente GitHub Desktop y con git para windows. SI se utiliza esta última opción, selecciona lo opción de poder utilizarlo con la terminal de windows.

En este documento explico como utilizar el CLI para git.

Clonar el repositorio de GitHub.

Para clonar el repositorio en el terminal seleccionamos el directorio donde que se quiere clonar. En este directorio se almacenarán todos los archivos del repositorio.
El comando seria: git clone <dirección del repositorio> para este caso https://github.com/DrunkPsyduck/ZeiterFree.git

Hacer un fork a un repositorio

Un fork es una copia de un repositorio que permite la edición del código de un repositorio sin afectar al repositorio original 
Puede realizarse usando el botón de fork en github.

Comenzando.
El procedimiento será clonar repositorio ZeiterFree utilizando la rama Main para el código experimental (Aquel que no se ha probado o está en desarrollo). Cuando se realicen las pruebas, funcione y no se encuentre ningún error se podrá realizar un Pull Request a la rama master.

Utilizando el cliente git nos situamos en el directorio en el que se quiera clonar el repositorio, una vez echo se ejecuta: git clone https://github.com/DrunkPsyduck/ZeiterFree.git

Se empezará a clonar. Una vez completado se podría subir elementos. Se pueden seleccionar todos o los elementos deseados. Para ello se utiliza git add.
Si se quiere publicar todo se añade un punto después de add: git add . . Se puede poner el nombre de un archivo concreto.

Cuándo se añadan, se puede hacer un commit para almacenarlo con git commit -m “mensaje”. Con -m se indica que se añade un mensaje después.

Una vez realizado se realiza el push a la rama deseada, en este caso Main con el comando:
git push origin Main.

Puede dar dos errores:
No te has identificado, aparecerán en la consola los comandos que debes ejecutar
No estás en la rama Main para solucionarlo debes ejecutar git chekcout ‘b Main.
Si se va a trabajar en funciones que pueden afectar a otras funciones del servidor o suponer pérdida de información es preferible crear una rama nueva y cuando esté solucionado y funcione fusionarla mediante un pull request a la rama Main
