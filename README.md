# Task Manager - mein erstes full stack projekt

## was ist das?
eine einfache aufgabenverwaltung die ich gebaut habe um .NET zu lernen und Angular aufzufrischen. man kann damit aufgaben erstellen, bearbeiten, löschen und nach verschiedenen prioritäten filtern.

## warum?
ich wollte verstehen wie eine moderne webanwendung funktioniert - also sowohl das backend (server) als auch das frontend (was der benutzer sieht). außerdem wollte ich mich auf ein vorstellungsgespräch vorbereiten und die technologien aus der stellenausschreibung ausprobieren.

## was ich verwendet habe:
Backend (.NET Web API):
.NET 8 fürs backend, Entity framework für datenbank, SQLite als datenbank (weil einfach zu setuppen), swagger für die api-dokumentation

Frontend (Angular):
bootstrap fürs design, typescript als programmiersprache

## was ich gelernt habe

konzepte die ich verstanden (oder aufgefrischt) habe:
* Dependency Injection: statt dass meine controller ihre eigenen repositories erstellen, "fragen" sie nach einem und bekommen es vom system bereitgestellt. das macht alles flexibler.
* Repository Pattern: ich habe die datenbank-zugriffe von der controller-logik getrennt. so kann ich später leichter eine andere datenbank verwenden.
* REST APIs: meine endpunkte folgen den rest-prinzipien (GET für lesen, POST für erstellen, usw.)
* Async/Await: alle datenbankoperationen benutzen async damit der server nicht blockiert

probleme die ich gelöst habe:
- enum-serialisierung: angular hat string-werte an die api geschickt, aber .NET wollte integers. das war knifflig zu debuggen :(
- cors-konfiguration: damit angular und .NET miteinander reden können
- entity framework migrations: wie man datenbank-änderungen verwaltet
- component-kommunikation in angular: wie components miteinander daten austauschen

## was ich noch verbessern könnte
testing - ich habe noch keine unit tests geschrieben, das wäre wichtig für echte projekte
validierung - mehr eingabevalidierung sowohl im frontend als auch backend
error handling - bessere fehlerbehandlung und benutzer-feedback
performance - caching und optimierungen für größere datenmengen
security - authentifizierung und authorization für mehrere benutzer
deployment - das ganze richtig auf einem server deployen

## wie starte ich das projekt?
backend:
cd TaskManagerAPI
dotnet run

frontend:
cd TaskManagerUI  
npm install
ng serve

dann kann man die app unter http://localhost:4200 benutzen und die api-dokumentation unter http://localhost:5019/swagger anschauen.

## fazit
das projekt hat mir geholfen zu verstehen wie moderne webanwendungen aufgebaut sind. am meisten gelernt habe ich beim debuggen,wenn etwas nicht funktioniert hat musste ich tief in die dokumentation und verstehen was unter der haube passiert.

für ein erstes full-stack projekt bin ich ganz zufrieden damit. es ist nicht perfekt aber ich konnte dadurch die grundlagen von .net angucken und verstehen
