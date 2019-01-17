# WDP Projekt von Nitsch Samuel (S1710307082)

* Projekt-Name: Bomberman
* Projekt-Typ: Game (+Startseite mit HTML + css)
* Gruppenprojekt: Ja, mit Leko Luka (S1710307075)
* Externe JS/CSS Bibliotheken: jquery (in geringem Umfang genutzt)
* Zeitaufwand (h): 70 - 90

Es wurde das Spiel "Bomberman" sowohl als Einzelspiel- als auch als Mehrspielervariante implementiert.
Spielziel ist es, alle anderen Spieler sowie alle Monster auszuschalten.

Es wurde die Verwendung von Gamepads (getestet: Xbox 360 USB Controller. Buttonbelegung bei anderen Controller kann abweichen) ermöglicht.
Spieler 1 spielt immer an der Tastatur. Spieler 2 - 4 müssen sich mit einem Gamepad vor Spielestart regestrieren (einmal einen Button drücken).
Die Anzahl der regestrierten Spieler wird farblich codiert dargestellt.

Jeder Spieler startet in einer Ecke des Spielfeldes. Zu Beginn sind seine Statistiken (Geschwindigkeit, Bombenstärke, Bombenanzahl) niedrig.
Mit seinen Bomben kann der Spieler die zerstörbaren Blöcke sprengen und mit etwas Glück verbirgt sich dahinter ein Item, dass seine stats aufbessert.

Es gibt 2 Monster-Typen: Creeps (können nicht durch Wände gehen) und Ghosts (können fliegen).
Wenn die Monster den Spieler berühren, stirbt der. Ebenso stirbt der Spieler, wenn er in eine Explosion einer Bombe gerät.

Für das Töten von Monstern oder von Spielern bekommt man Punkte.
Diese werden in einem Scoreboard rechts angezeigt. Gleichzeitig werden die momentanen Statistiken der Spieler in einem Board links des Canvas angezeigt.

Das Spiel ist zu Ende, wenn entweder alle Spieler gestorben sind (Game Over), oder nur mehr 1 Spieler aber keine Monster übrig sind (Spiel gewonnen)

Steuerung:
Mit dem Keyboard: Bewegung = Pfeiltasten, Bombe legen: Leertaste oder Beginn
Mit dem XBox Controller: Bewegung: Linker Joystick, Bomben legen: "A" oder "B"

Zusätzlich wurde für das Spiel eine Startseite entworfen, die größtenteils auf Größenänderungen reagiert.
Ebenfalls eine nav-bar und ein Kontaktformular (ohne tatsächliches senden zu einem server). Nav-Bar und Kontaktforumular werden über jquery geladen.