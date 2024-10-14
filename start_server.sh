rm ./httpd-root/conf/httpd-conf-template.conf.txt ./httpd-root/fcgi-bin/server.jar
cp ./lab1/httpd-conf-template.conf.txt ./httpd-root/conf/
cp ./lab1/server.jar ./httpd-root/fcgi-bin/
cp -r ./lab1/static ./
kill $(cat ./httpd-root/httpd.pid)
# httpd -f /home/studs/s408737/httpd-root/conf/httpd-conf-template.conf.txt -k start
# java -jar -DFCGI_PORT=24248 /home/studs/s408737/httpd-root/fcgi-bin/server.jar