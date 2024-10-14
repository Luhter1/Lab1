gradle build
scp -rP 2222 ~/web/Lab1/lab1 s408737@helios.cs.ifmo.ru:/home/studs/s408737/
ssh -p 2222 s408737@helios.cs.ifmo.ru 'bash -s' < start_server.sh